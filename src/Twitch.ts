import axios from "axios";
import RequestEvent from "./RequestEvent";
import TwitchRoutes from "./TwitchRoutes";
const { get, post } = axios;

export type TTwitchSession =
    { authenticated: true, token: string }
    | { authenticated: false, token: null }

export interface ITwitchClient {
    credentials: {
        cid: string,
        secret: string
    },
    session: TTwitchSession,
    authenticate: () => void,
    deauthenticate: () => void;
    get: (
        url: string,
        params: object,
        cb: (event: RequestEvent) => void,
        isRetry?: boolean
    ) => void,
    post: (
        url: string,
        params: object,
        cb: (event: RequestEvent) => void,
        isRetry?: boolean
    ) => void
}

export const TwitchClient = class implements ITwitchClient {
    static API_SCOPES = "";

    credentials: ITwitchClient["credentials"];
    session: TTwitchSession;

    constructor(appId: string, clientSecret: string) {
        this.credentials = {
            cid: appId,
            secret: clientSecret
        };
        this.session = {
            authenticated: false,
            token: null
        };
    }

    authenticate = () => {
        post(TwitchRoutes.auth.login as string, null, { params: {
            client_id: this.credentials.cid,
            client_secret: this.credentials.secret,
            grant_type: "client_credentials"
        }}).then((res) => {
            this.session = { authenticated: true, token: res.data.access_token };
            console.log("Authenticated with TwitchAPI!");
        }).catch((err) => {
            console.error("Error authenticating with TwitchAPI:");
            console.error(err.message);
        });
    };

    deauthenticate = () => {
        post(TwitchRoutes.auth.revoke as string, null, { params: {
            client_id: this.credentials.cid,
            token: this.session.token
        }}).then((res) => {
            this.session = { authenticated: false, token: null };
            console.log("Revoked token!");
            console.log(res.data);
        }).catch((err) => {
            console.error("Error revoking TwitchAPI Token:");
            console.error(err/*.message*/);
        });
    };

    private _get = async (url: string, params: object) => {
        if (!this.session.authenticated) {
            console.error("ERROR: Tried making _GET request while not authenticated!");
            return null;
        }

        return get(url, {
            headers: {
                Authorization: `Bearer ${this.session.token}`,
                "Client-Id": this.credentials.cid
            },
            params: params
        });
    };

    private _post = (url: string, params: object) => {
        if (!this.session.authenticated) {
            console.error("ERROR: Tried making _POST request while not authenticated!");
            return null;
        }

        return post(url, {
            headers: {
                Authorization: `Bearer ${this.session.token}`,
                "Client-Id": this.credentials.cid
            },
            params: params
        });
    };

    get = (url: string, params: object, cb: (event: RequestEvent) => void, isRetry = false) => {
        this._get(url, params).then((res) => {
            if (res == null) {
                cb({ type: "error", error: "F @axios" });
                return;
            }

            if (res.data == null) {
                cb({ type: "error", error: "F @Twitch" });
                return;
            }

            cb({ type: "done", data: res.data });
        }).catch((err) => {
            if (err.response.status in [401,403]) {
                if (isRetry) {
                    cb({ type: "error", error: "Can't authenticate." });
                    return;
                }

                cb({ type: "retry" });
                this.authenticate();
                setTimeout(() => { this.get(url, params, cb, true); }, 3000);
            } else {
                console.log(err.response);
                cb({ type: "error", error: "?" });
            }
        });
    };

    post = (url: string, params: object, cb: (event: RequestEvent) => void, isRetry = false) => {
        const postReq = this._post(url, params);
        
        if (postReq == null) {
            cb({ type: "error", error: "F @axios" });
            return;
        }
        
        postReq.then((res) => {
            if (res == null) {
                cb({ type: "error", error: "F @axios" });
                return;
            }

            if (res.data == null) {
                cb({ type: "error", error: "F @Twitch" });
                return;
            }

            cb({ type: "done", data: res.data });
        }).catch((err) => {
            if (err.response.data.status in [401,403]) {
                if (isRetry) {
                    cb({ type: "error", error: "Can't authenticate." });
                    return;
                }

                cb({ type: "retry" });
                this.authenticate();
                setTimeout(() => { this.post(url, params, cb, true); }, 3000);
            } else {
                cb({ type: "error", error: "F @Twitch" });
            }
        });
    };
};
