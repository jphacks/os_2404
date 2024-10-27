import { type Context, getCookie, Hono } from "../../deps.ts";
import { throwAPIError } from "../../util/throwError.ts";
import { decrypt, parseTokenData } from "../../service/auth/index.ts";
import { getUserByAccessToken } from "../../service/user/index.ts";

const app = new Hono();

/**
 * cookieに入ってるアクセストークンからユーザー情報を取得する
 */
app.get("/me", async (c: Context) => {
    const accessToken = getCookie(c, "accessToken") ?? c.req.header()["cookie"];
    if (!accessToken) return throwAPIError(401, "accessToken is not found")();
    const decryptedAccessToken = decrypt(accessToken);
    if (!decryptedAccessToken) {
        return throwAPIError(401, "accessToken is not found")();
    }
    const requiredTokenData = parseTokenData(decryptedAccessToken);
    const user = await getUserByAccessToken(requiredTokenData.access_token);
    return c.json(user);
});

export default app;
