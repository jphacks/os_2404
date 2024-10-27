export type TDiscordUser = {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    public_flags: number;
    premium_type: number;
    flags: number;
    banner?: number;
    accent_color: number;
    global_name: string;
    avatar_decoration_data?: null;
    banner_color: string;
};
