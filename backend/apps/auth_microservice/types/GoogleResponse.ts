export interface GoogleTokenResponse {
    access_token: string;
    refresh_token?: string; 
    id_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
}
export interface GoogleUserInfo {
    id: string;
    email: string;
    verified_email: boolean;
}