import { CommandInteraction } from "discord.js";

const PingCommandHandler = (interaction: CommandInteraction) => {
    interaction.reply("Pong!");
};

export default PingCommandHandler;