import { CommandInteraction } from "discord.js";
import RequestEvent from "./RequestEvent";
import TwitchRoutes from "./TwitchRoutes";

const TwitchCommandHandler = (twitch: any) => {
    return (interaction: CommandInteraction) => {
        twitch.get(TwitchRoutes.channel.details, { broadcaster_id: "161030471" }, (event: RequestEvent) => {
            if (event.type == "done") {
                const streamer = event.data.data[0];
                // @ts-ignore
                const live = streamer["delay"] != 0;
                if (live) {
                    interaction.reply("Kiri is **on**line!");
                    // @ts-ignore
                    if (streamer["game_name"] == "Minecraft") {
                        // @ts-ignore
                        if (streamer["title"].contains("kiriSMP")) {
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