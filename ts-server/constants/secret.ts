import "https://deno.land/std@0.190.0/dotenv/load.ts";

export const SECRET = {
    COOKIE_DOMAIN: Deno.env.get("COOKIE_DOMAIN"),
    CLIENT_URL: Deno.env.get("CLIENT_URL"),
    SERVER_URL: Deno.env.get("SERVER_URL"),
    DISCORD_TOKEN: Deno.env.get("DISCORD_TOKEN")!,
    GUILD_ID: Deno.env.get("GUILD_ID")!,
    MY_CHANNEL_ID: Deno.env.get("MY_CHANNEL_ID")!,
    ENV: Deno.env.get("DENO_ENV")!,
    AUTH_ENDPOINT: Deno.env.get("AUTH_ENDPOINT")!,
    DISCORD_CLIENT_ID: Deno.env.get("DISCORD_CLIENT_ID")!,
    DISCORD_CLIENT_SECRET: Deno.env.get("DISCORD_CLIENT_SECRET")!,
    CRYPTO_SALT: Deno.env.get("CRYPTO_SALT")!,
    CRYPTO_PASSWORD: Deno.env.get("CRYPTO_PASSWORD")!,
};
