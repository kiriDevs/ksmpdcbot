const TwitchRoutes = {
    auth: {
        login: "https://id.twitch.tv/oauth2/token",
        revoke: "https://id.twitch.tv/oauth2/revoke"
    }, channel: {
        search: "https://api.twitch.tv/helix/search/channels",
        details: "https://api.twitch.tv/helix/channels"
    }
};

export default TwitchRoutes;