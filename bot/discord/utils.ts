import { MESSAGE_TEXT, NO_MATCH_TEXT, NOTICE_TEXT, START_TEXT } from "./constants.ts";
import { Bot, Collection, Message } from "./deps.ts";
import { Secret } from "./secret.ts";

// 最新の特定の内容を持つメッセージを返す
type TMessageArgs = { messages: Collection<bigint, Message> };
export const getReactedMessage = ({ messages }: TMessageArgs) => {
  const reactedMessage = messages.find((message) => message.content === MESSAGE_TEXT);
  return reactedMessage;
};

// ReactionのEmojiを返す
export const getReactionEmojis = (message: Message | undefined) => {
  if (!message || !message.reactions) return [];
  const reactionEmojis = message.reactions.map((reaction) => reaction.emoji.name);
  return reactionEmojis;
};

// reactionをしているユーザーのIDを重複を削除してから返す
type TgetReactingUserIdsArg = { bot: Bot; messageId: bigint | undefined; emojis: (string | undefined)[] };
export const getReactingUserIds = async ({ bot, messageId, emojis }: TgetReactingUserIdsArg) => {
  if (!messageId) return [];

  const filterUndefinedEmojis = emojis.filter((emoji) => emoji !== undefined) as string[];

  const userIds = await Promise.all(filterUndefinedEmojis.map(async (emoji) => {
    const users = await bot.helpers.getReactions(Secret.MY_CHANNEL_ID, messageId, emoji);
    return users.map((user) => user.id);
  }));

  const dedupeUserIds = [...new Set(userIds.flat())];

  return dedupeUserIds;
};

// マッチの結果をメッセージにして返す
export const createResultMessage = (userIds: bigint[]) => {
  if (userIds.length === 0 || userIds.length === 1) return NO_MATCH_TEXT;

  // ランダムに並べ替える
  const randomUserIds = userIds.slice().sort(() => Math.random() - Math.random());

  const userIdCount = Math.floor(randomUserIds.length / 2);
  const matchIds = Array.from(
    { length: userIdCount },
    (_, index) => {
      const isLastIndex = index === userIdCount - 1;
      const base = index * 2;
      return randomUserIds.slice(base, isLastIndex ? base + 3 : base + 2);
    },
  );

  const matchText = matchIds.map((matchId: bigint[], index: number) =>
    `room${index + 1} <@${matchId[0]}> on <@${matchId[1]}> ${matchId[2] ? `on <@${matchId[2]}>` : ""}`
  ).join("\n");

  return NOTICE_TEXT + matchText;
};

export const createStartMessage = (userIds: bigint[]) => {
  const joinMembersText = userIds.map((userId) => `<@${userId}>`).join(" ");
  return START_TEXT + joinMembersText;
};
