import { AnyChannel, Client, VoiceChannel } from "discord.js";
import axios from "axios";
const { get } = axios;

interface IServerStatusUpdaterParams {
    server: {
        address: string,
        port: number
    }, channels: {
        memberCount: string,
        serverStatus: string,
        playerCount: string,
        lastUpdate: string
    }
}

type MaybeAnyChannel = AnyChannel | undefined

const ServerStatusUpdater = class {
    options: IServerStatusUpdaterParams;

    constructor(options: IServerStatusUpdaterParams) {
        this.options = options;
    }

    updateMemberCount = (client: Client) => {
        const channel: MaybeAnyChannel = client.channels.cache.find((channel) => {
            return channel.id === this.options.channels.memberCount;
        });

        if (channel instanceof VoiceChannel) {
            get("https://smp.kirimcplay.tv/players")
                .then((res) => { const data = res.data;
                    const playerCount = data.length;
                    channel.edit({
                        "name": `Members: ${playerCount}`
                    });
                }).catch((err) => {
                    console.error("Error fetching kiriSMP-API data:");
                    console.error(err.message);
                });
        } else {
            console.error("ERROR: Found memberCount channel, but isn't voice!");
        }
    };

    updateServerStatus = (client: Client) => {
        const statusChannel: MaybeAnyChannel = client.channels.cache.find((channel) => {
            return channel.id === this.options.channels.serverStatus;
        });

        const playerCountChannel: MaybeAnyChannel = client.channels.cache.find((channel) => {
            return channel.id === this.options.channels.playerCount;
        });

        get(`https://api.mcsrvstat.us/2/${this.options.server.address}`)
            .then((res) => { const data = res.data;
                const online = data.online;
                const version = data.version;
                const onlinePC = data.players.online;
                const maxPC = data.players.max;

                if (statusChannel instanceof VoiceChannel) {
                    statusChannel.edit({
                        "name": `${online?"On":"Off"}line${online && ` | ${version}`}`
                    });
                } else {
                    console.error("ERROR: serverStatus channel is not an existing Voice Channel!");
                }

                if (playerCountChannel instanceof VoiceChannel) {
                    if (online) {
                        playerCountChannel.edit({
                            "name": `${onlinePC}/${maxPC}`
                        });
                    } else {
                        playerCountChannel.edit({
                            "name": "Server's running Windows..."
                        });
                    }
                } else {
                    console.error("ERROR: playerCount channel is not an existing Voice Channel!");
                }
            });
    };

    update = (client: Client) => {
        this.updateMemberCount(client);
        this.updateServerStatus(client);

        const lastUpdateChannel = client.channels.cache.find((channel) => {
            return channel.id == this.options.channels.lastUpdate;
        });

        const now = new Date();
        const nowDate = `${now.getDate()}.${now.getMonth()+1}.${now.getFullYear()}`;
        const nowTime = `${now.getHours()+1}:${now.getMinutes()}:${now.getSeconds()}`;
        const nowString = `${nowDate}@${nowTime}`;
        if (lastUpdateChannel instanceof VoiceChannel) {
            lastUpdateChannel.edit({
                name: `Updated: ${nowString}`
            });
        } else {
            console.error("ERROR: lastUpdate channel is not an existing Voice Channel!");
        }
    };
};

export default ServerStatusUpdater;