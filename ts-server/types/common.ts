import { Env, Handler } from "../deps.ts";
import { components } from "./schema.ts";

export type schema = components["schemas"];

export type ResObj = Record<string | number | symbol, never>;
export type WrapHandler<P extends string> = Handler<
    Env,
    P,
    ResObj,
    Promise<Response>
>;
