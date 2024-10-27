import { type Context, Hono } from "./deps.ts";
import { middlewareOptions } from "./middleware.ts";
import Auth from "./controller/auth/index.ts";
import User from "./controller/users/index.ts";
import Form from "./controller/forms/index.ts";
import Schedule from "./controller/schedules/index.ts";

export const app = new Hono();

app.get("/health", (c: Context) => c.json({ message: "Health" }));

app.use("/auth/signin", ...middlewareOptions({ auth: false }));
app.use("/auth/signout", ...middlewareOptions({ auth: true }));
app.use("/auth/token", ...middlewareOptions({ auth: false }));
app.use("/auth/token/check", ...middlewareOptions({ auth: true }));
app.route("/auth", Auth);
app.route("/users", User);
app.route("/form", Form);
app.route("/schedule", Schedule);
Deno.serve(app.fetch);
