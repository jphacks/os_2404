import "https://deno.land/std@0.190.0/dotenv/load.ts";

export const Secret = {
  DISCORD_TOKEN: Deno.env.get("DISCORD_TOKEN")!,
  GUILD_ID: Deno.env.get("GUILD_ID")!,
  MY_CHANNEL_ID: Deno.env.get("MY_CHANNEL_ID")!,
};
