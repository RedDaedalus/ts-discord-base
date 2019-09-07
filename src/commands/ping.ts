import Command from "../structures/Command";
import Client from "../structures/Client";
import { Message } from "discord.js";

import { embeds } from "../config"; 

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
        // @ts-ignore
        const embed = await this.buildEmbed(embeds.info).setTitle("» Pinging...").setDescription("Fetching client ping.").setFooter(`Executed by ${message.author.tag}`);
        const reply = await message.channel.send(embed);
        
        return reply.edit(embed.setTitle("» Pong!").setDescription(`**Ping:** ${reply.createdTimestamp - message.createdTimestamp}ms\n**❤ Heartbeat:** ${this.client.ws.ping}ms`));
    }
}