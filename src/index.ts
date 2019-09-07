import Client from "./structures/Client";
import * as config from "./config";

const client:Client = new Client({
    ...config,
    fetchAllMembers: true,
    logLimit: 200
});

client.loadEvents("src/events");
client.loadCommands("src/commands");
client.connect(config.token);