import Event from "../structures/Event";
import Client from "../structures/Client";

import { prefix } from "../config";
import discord from "discord.js";

export default class Message extends Event {
    constructor(client:Client) {
        super(client, "message");

        this.addHandler("commandHandler", (message:discord.Message):boolean => {
            // Check for guild availability
            if (message.guild && !message.guild.available) return false;
            // Check if the message starts with prefix
            if (!message.content.startsWith(prefix)) return false;
            
            // Split message by spaces
            const args = message.content.split(/\s+/g);
            // @ts-ignore
            const cmd = args.shift().slice(prefix.length);
            // @ts-ignore
            const command = this.client.commands.get(cmd) || this.client.commands.get(this.client.aliases.get(cmd));
            
            // Check if a command was found
            if (!command) return false;
            
            // Run handler
            return true;
        });
    }

    async run() {
        
    }
}