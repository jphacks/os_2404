import { Bot } from "../../bot/bot.ts";
import { SECRET } from "../../constants/secret.ts";
import { Member } from "../../deps.ts";
import { schema } from "../../types/common.ts";
import { throwAPIError } from "../../util/throwError.ts";
import { TDiscordUser } from "./type.ts";
import { getAvatarURL, type Member as TDiscordBotUser } from "../../deps.ts";

type TUser = schema["User"];

/**
 * idから取得したDiscordのUserを必要な値だけ抽出して返す
 */
export const getMemberByUserId = async (id: string): Promise<TUser> => {
    const user: Member = await Bot.helpers.getMember(SECRET.GUILD_ID, id)
        .then((data: Member) => data)
        .catch(throwAPIError(401, "user not found"));

    return botUserToUser(user);
};

export const getDiscordUserByAccessToken = async (accessToken: string) => {
    const data: { user: TDiscordUser } = await fetch(
        "https://discord.com/api/oauth2/@me",
        { method: "GET", headers: { Authorization: `Bearer ${accessToken}` } },
    ).then((res) => res.json());
    return data;
};

/**
 * アクセストークンからユーザー情報を取得する
 */
export const getUserByAccessToken = async (
    accessToken: string,
): Promise<TUser> => {
    const data = await getDiscordUserByAccessToken(accessToken);
    // 二度手間だが、joinedAtをUser情報に含めるためにAPIでUserを取得してからBotを使って再取得している
    const discordUser = await getMemberByUserId(data.user.id);
    if (!discordUser) throwAPIError(404, "user not found")();

    return discordUser;
};

/**
 * Botから取得したMemberをUserに変換する
 */
export const botUserToUser = (member: TDiscordBotUser): TUser => {
    const avatarUrl = getAvatarURL(
        Bot,
        member.user?.id.toString() as string,
        member.user?.username as string,
        { avatar: member.user?.avatar },
    );

    return {
        id: member.user?.id.toString() ?? "",
        name: member.user?.username ?? "",
        avatar: avatarUrl,
        joinedAt: member.joinedAt,
    };
};
