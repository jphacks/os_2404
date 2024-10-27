///<reference lib="deno.unstable" />
import { MESSAGE_TEXT } from "./constants.ts";
import { createBot, Intents, startBot } from "./deps.ts";
import { Secret } from "./secret.ts";
import { createResultMessage } from "./utils.ts";

const bot = createBot({
  token: Secret.DISCORD_TOKEN,
  intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent,
  events: {
    ready: (_bot, payload) => console.log(`${payload.user.username} is ready!`),
  },
});

bot.events.messageCreate = (bot, message) => {
  if (message.content === "!health") {
    bot.helpers.sendMessage(message.channelId, { content: "good!" });
  }
};

bot.events.messageCreate = async (bot, message) => {
  if (message.content === "!do") {
    bot.helpers.sendMessage(Secret.MY_CHANNEL_ID, { content: MESSAGE_TEXT });
    const allUserIds = await bot.helpers.getMembers(Secret.GUILD_ID, { limit: 10 });
    const resultMessage = createResultMessage(allUserIds.map((user) => user.id));
    bot.helpers.sendMessage(Secret.MY_CHANNEL_ID, { content: resultMessage });
  }
};

// 指定時刻に1on1への参加を可否を聞くCron
// 月曜日の21時に流す
// UTCとの時差が9時間あるので、これで21時にcronが動く
Deno.cron("watch start time cron", "*/30 * * * *", async () => {
  // 開始時間を取得してくる
  const schedulesData = await fetch(`${Secret.SERVER_URL}/schedule`, { method: "GET", cache: "no-store" });
  const schedules: { dayOfWeek: number; start: string; isEnabled: boolean }[] = await schedulesData.json();

  schedules.forEach((schedule) => {
    if (schedule.isEnabled) {
      const [hours, minutes] = schedule.start.split(":");
      const cronExpression = `${minutes} ${hours} * * ${schedule.dayOfWeek}`;
      Deno.cron(`${schedule.dayOfWeek} `, cronExpression, async () => {
        bot.helpers.sendMessage(Secret.MY_CHANNEL_ID, { content: MESSAGE_TEXT });
        const allUserIds = await bot.helpers.getMembers(Secret.GUILD_ID, { limit: 10 });
        const resultMessage = createResultMessage(allUserIds.map((user) => user.id));
        bot.helpers.sendMessage(Secret.MY_CHANNEL_ID, { content: resultMessage });
      });
    }
  });
});

await startBot(bot);
