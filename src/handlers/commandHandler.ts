import Client from "../structures/Client";
import { Message } from "discord.js";

import { embeds } from "../config";

export default (client:Client, message:Message) => {
    // Split message by spaces
    const args = message.content.split(/\s+/g);
    // @ts-ignore
    const cmd = args.shift().slice(prefix.length);
    // @ts-ignore
    const command = this.client.commands.get(cmd) || this.client.commands.get(this.client.aliases.get(cmd));

    if (message.guild) {
        // @ts-ignore
        if (command.userPerms.some(p => !message.member.permissions.has(p))) return false;
        // @ts-ignore
        if (command.botPerms.some(p => !message.guild.me.permissions.has(p))) return false;
    } else if (!command.allowDMs) return false;


    try {
        command.run(message, args);
    } catch(e) {
        command.buildEmbed(embeds.error).setTitle("» Unknown Error").setDescription("An unknown error occured while running this command.");
    } finally {

    }

    return true;
}