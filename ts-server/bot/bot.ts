import { SECRET } from "../constants/secret.ts";
import { createBot, Intents } from "../deps.ts";

export const Bot = createBot({
    token: SECRET.DISCORD_TOKEN,
    intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent,
    events: {
        ready: (_bot, payload) => {
            console.log(`${payload.user.username} is ready!`);
        },
    },
});
