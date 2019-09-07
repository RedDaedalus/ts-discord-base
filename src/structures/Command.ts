import discord, { MessageEmbed } from "discord.js";
import Client from "./Client";

/**
 * Represents a chat command
 */
class Command {
    /**
     * Create a new command
     * @param {Client} client The client to use in the command
     * @param {opts} CommandOptions The options to use in the command
     */
    constructor(client:Client, {help, conf}:CommandOptions) {
        this.client = client;

        this.name = help.name;
        this.description = help.description;   
        this.category = help.category || "info";
        this.usage = help.usage || "";
        this.hidden = help.hidden || false;

        this.aliases = conf.aliases || [];
        this.userPerms = conf.perms.user || [];
        this.botPerms = conf.perms.bot || [];
        this.dmsEnabled = !!conf.allowDMs;
    }

    /**
     * Create an embed
     * @param data 
     */
    buildEmbed(data?:any):MessageEmbed {
        // Create MessageEmbed instance
        const embed:MessageEmbed = new MessageEmbed(data);
        
        embed.send = async (message?:string) => {
            if (!this.message) throw new Error("Command message not yet set.");
            await this.message.channel.send(message, embed);
            return this;
        }

        //Return the embed
        return embed;
    }
}

interface Command {
    client:Client;

    name:string;
    description:string;
    category:string;
    usage:string;
    hidden:boolean;

    aliases:string[];
    userPerms:string[];
    botPerms:string[];
    dmsEnabled:boolean;

    message?:discord.Message;
}

interface CommandOptions {
    readonly help:{ name:string, description:string, category:string, usage?:string, hidden?:boolean };
    readonly conf:{ aliases?:[string], perms:{ user?:[string], bot?:[string]}, allowDMs?:boolean };
}

export default Command;