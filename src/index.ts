import { Client, Intents } from "discord.js";

import { parse as parseenv } from "dotenv";
import { readFileSync as rfs } from "fs";
import { join as path } from "path";
const env = parseenv(rfs(path(__dirname, "..", ".env")));

import ServerStatusUpdater from "./ServerStatusUpdater";

const client: Client = new Client({ "intents": [Intents.FLAGS.GUILDS] });
const serverStatusUpdater = new ServerStatusUpdater({
    server: {
        address: "smp.kirimcplay.tv",
        port: 62000
    },
    channels: {
        memberCount: "937379305808343110",
        serverStatus: "818411031545118767",
        playerCount: "937379449484242954",
        lastUpdate: "938056774353813546"
    }
});

client.once("ready", async () => {
    console.log("Connected to Discord Gateway!");

    await client.user?.setStatus("dnd");
    await client.user?.setActivity({
        "type": "LISTENING",
        "name": "bad code from GitHub",
        "url": "https://github.com/kiriDevs/ksmpdcbot"
    });

    serverStatusUpdater.update(client);
    setInterval(() => {
        serverStatusUpdater.update(client);
    }, 1000 * 60 * 10);
});

client.login(env.DISCORD_TOKEN);