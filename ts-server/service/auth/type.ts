export type TEncryptedData = { iv: string; encryptedData: string };

export type TAccessToken = {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
    scope: string;
};

export type TRequiredAccessToken = {
    access_token: string;
    refresh_token: string;
};

export type TGuild = {
    features: string[];
    icon: string;
    id: string;
    name: string;
    owner: boolean;
    permissions: number;
    permissions_new: string;
};
