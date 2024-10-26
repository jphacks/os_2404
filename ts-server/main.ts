import { type Context, Hono } from "./deps.ts";
import { middlewareOptions } from "./middleware.ts";
import Auth from "./controller/auth/index.ts";

export const app = new Hono();

app.get("/health", (c: Context) => c.json({ message: "Health" }));

app.use("/auth/signin", ...middlewareOptions({ auth: false }));
app.use("/auth/signout", ...middlewareOptions({ auth: true }));
app.use("/auth/token", ...middlewareOptions({ auth: false }));
app.use("/auth/token/check", ...middlewareOptions({ auth: true }));
app.route("/auth", Auth);

Deno.serve(app.fetch);
