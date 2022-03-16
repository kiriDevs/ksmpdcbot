import { CommandInteraction, Interaction } from "discord.js";
import { EventEmitter } from "events";

const CommandHandler = class {
    ee: EventEmitter;

    constructor() {
        this.ee = new EventEmitter();
    }

    register = (name: string, handler: (interaction: CommandInteraction) => void) => {
        this.ee.on(name, handler);
    };

    handle = (interaction: Interaction) => {
        if (!interaction.isCommand()) return;
        const commandName = interaction.commandName.toString();
        this.ee.emit(commandName, interaction as CommandInteraction);
    };
};

export default CommandHandler;