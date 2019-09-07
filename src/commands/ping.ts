import Command from "../structures/Command";
import Client from "../structures/Client";
import { Message } from "discord.js";

export default class Ping extends Command {
    constructor(client:Client) {
        super(client, {
            help: {
                name: "ping",
                description: "Ping the bot.",
                category: "info"
            },
            conf: {
                aliases: ["pong"],
                perms: { }
            }
        });
    }

    async run(message:Message):Promise<Message> {
        const embed = await this.buildEmbed().setTitle("» Pinging...").setDescription("Fetching client ping.").setColor(0x3264FF);
        const reply = await message.channel.send(embed);
        
        return reply.edit(this.buildEmbed().setTitle("» Pong!").setDescription(`Took ${reply.createdTimestamp - message.createdTimestamp}ms.\n❤ **Heartbeat:** ${Math.round(this.client.ws.ping || 0)}ms`));
    }
}