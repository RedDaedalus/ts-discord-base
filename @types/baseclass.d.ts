import discord from "discord.js";
import Command from "../src/structures/Command";

declare module "discord.js" {
    interface Client {
        started:Date;
        logs:discord.Collection<Date, { date:Date, prefix:string, message:string }>;
        commands:discord.Collection<string, Command>;
        aliases:discord.Collection<string, String>
    }
    
    interface ClientOptions {
        logLimit?:number;
        token?:string;
    }

    interface MessageEmbed {
        channel?:discord.TextChannel;
        send?:Function;
    }
}