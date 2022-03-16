import { CommandInteraction } from "discord.js";
import RequestEvent from "./RequestEvent";
import TwitchRoutes from "./TwitchRoutes";
import { ITwitchClient } from "./Twitch";

interface ITwitchBroadcaster {
    broadcaster_id: string,
    broadcaster_login: string,
    broadcaster_name: string,
    broadcaster_language: string,
    game_id: string,
    game_name: string,
    title: string,
    delay: number
}

interface ITwitchBroadcasterListResponse {
    streamers: ITwitchBroadcaster[]
}

const TwitchCommandHandler = (twitch: ITwitchClient) => {
    return (interaction: CommandInteraction) => {
        twitch.get(TwitchRoutes.channel.details, { broadcaster_id: "161030471" }, (event: RequestEvent) => {
            if (event.type == "done") {
                const resData = event.data as ITwitchBroadcasterListResponse;
                const streamer = resData.streamers[0];
                const live = streamer.delay != 0;
                if (live) {
                    interaction.reply("Kiri is **on**line!");
                    if (streamer["game_name"] == "Minecraft") {
                        if (streamer["title"].includes("kiriSMP")) {
                            interaction.followUp("**They're even streaming the kiriSMP!** :partying_face:");
                        }
                        interaction.followUp("They're also streaming Minecraft, but not the kiriSMP.");
                    } else {
                        interaction.followUp("They aren't even streaming Minecraft, though.");
                    }
                } else {
                    interaction.reply("Kiri is **off**line!");
                }
            } else {
                if (event.type == "retry") {
                    interaction.deferReply();
                } else if (event.type == "error") {
                    if (event.error == "F @twitch") {
                        interaction.reply("Twitch shit itself. Try again when it is a good platform.");
                    } else if (event.error == "F @axios") {
                        interaction.reply("Axios can't complete the request for... reasons?");
                    } else {
                        interaction.reply("Something went wrong. Sorry about that.");
                        console.log(event);
                    }
                }
            }
        });
    };
};

export default TwitchCommandHandler;