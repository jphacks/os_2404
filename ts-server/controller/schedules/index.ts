import { type Context, Hono } from "../../deps.ts";
import { throwAPIError } from "../../util/throwError.ts";
import { kv } from "../../db/kv.ts";

type Schedule = {
    dayOfWeek: number;
    start: string;
    isEnabled: boolean;
};

const app = new Hono();

/**
 * スケジュールを作成するエンドポイント
 */
app.post("/", async (c: Context) => {
    const scheduleData: Schedule[] = await c.req.json();
    console.log("create", scheduleData);
    if (!scheduleData) return throwAPIError(400, "Schedule data is required")();
    // scheduleData.forEach((schedule) => {
    kv.set(["schedule"], scheduleData);
    return c.json({ status: "success" }, 200);
});

/**
 * スケジュールを取得するエンドポイント
 */
app.get("/", async (c: Context) => {
    const schedule = (await kv.get(["schedule"])).value as Schedule[];
    if (!schedule) return c.json({ data: null }, 200);
    return c.json({ data: schedule }, 200);
});

/**
 * スケジュールを更新するエンドポイント
 */
app.put("/", async (c: Context) => {
    const scheduleData: Schedule[] = await c.req.json();
    console.log("update", scheduleData);
    kv.set(["schedule"], scheduleData);
    return c.json({ status: "success" }, 200);
});

export default app;
