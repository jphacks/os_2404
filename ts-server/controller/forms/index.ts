import { type Context, Hono } from "../../deps.ts";
import { throwAPIError } from "../../util/throwError.ts";
import { kv } from "../../db/kv.ts";

type Form = {
    userId: string;
    frequency: string;
    startDate: string;
    endDate: string;
    isSameRoleMatch: boolean;
    isSameUserMatch: boolean;
};

const app = new Hono();

/**
 * フォームを作成するエンドポイント
 */
app.post("/", async (c: Context) => {
    const formData: Form = await c.req.json();
    console.log(formData);
    if (!formData) return throwAPIError(400, "Form data is required")();
    await kv.set(["form", formData.userId], formData);
    return c.json({ status: "success" }, 200);
});

/**
 * フォームを取得するエンドポイント
 */
app.get("/:id", async (c: Context) => {
    const formUserId = c.req.param("id");
    if (!formUserId) return throwAPIError(400, "Form ID is required")();
    console.log(formUserId);
    const form = (await kv.get(["form", formUserId])).value as Form;
    if (!form) return c.json({ data: null }, 200);
    return c.json({ data: form }, 200);
});

/**
 * フォームを更新するエンドポイント
 */
app.put("/:id", async (c: Context) => {
    const formUserId = c.req.param("id");
    const formData: Form = await c.req.json();
    if (!formUserId || !formData) return throwAPIError(400, "Form ID and data are required")();
    await kv.set(["form", formUserId], formData);
    return c.json({ status: "success" }, 200);
});

export default app;
