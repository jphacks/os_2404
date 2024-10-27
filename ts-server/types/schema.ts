/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export type paths = Record<string, never>;

export type webhooks = Record<string, never>;

export type components = {
    schemas: {
        User: {
            id: string;
            name: string;
            avatar: string;
            joinedAt: number;
        };
        Workshop: {
            id: string;
            title: string;
            description: string;
            eventCount: number;
            latestEventDatetime?: string;
            createdAt: number;
            updatedAt: number;
        };
        WorkshopInput: {
            title: string;
            description?: string;
        };
        Event: {
            id: string;
            workshopId: string;
            theme: string;
            datetime: string;
            isCronTarget: boolean;
            createdAt: number;
            updatedAt: number;
        };
        EventInput: {
            event: {
                workshopId: string;
                theme: string;
                datetime: string;
            };
            discordIds: string[];
        };
        EventOutput: {
            speakers: {
                id: string;
                name: string;
                avatar: string;
                joinedAt: number;
            }[];
            id: string;
            workshopId: string;
            theme: string;
            datetime: string;
            isCronTarget: boolean;
            createdAt: number;
            updatedAt: number;
        };
        Speaker: {
            id: string;
            discordId: string;
            workshopId: string;
            eventId: string;
            createdAt: number;
            updatedAt: number;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
};

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export type operations = Record<string, never>;
