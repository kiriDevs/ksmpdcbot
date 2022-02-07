import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

import { parse as parseenv } from "dotenv";
import { readFileSync as rfs } from "fs";
import { join as path } from "path";
const env = parseenv(rfs(path(__dirname, "..", ".env")));

const commands = [
    new SlashCommandBuilder().setName("ping").setDescription("Replies with pong!"),
    new SlashCommandBuilder().setName("iskirilive").setDescription("Tells you if kiri is live!")
].map(command => command.toJSON());

const rest = new REST({ version: "9" }).setToken(env.DISCORD_TOKEN);

rest.put(Routes.applicationGuildCommands(env.DISCORD_CLIENT_ID, env.COMMAND_TEST_GUILD), { body: commands })
    .then(() => { console.log("Successfully registered application commands."); })
    .catch(console.error);
