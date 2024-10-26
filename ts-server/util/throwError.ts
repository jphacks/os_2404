import { HTTPException } from "../deps.ts";

export const throwAPIError = (statudCode: number, message: string) => () => {
    throw new HTTPException(statudCode, { message });
};
