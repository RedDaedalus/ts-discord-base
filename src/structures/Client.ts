import Event from "./Event";

import discord from "discord.js";
import chalk from "chalk";
import fs from "fs";
import Command from "./Command";

/**
 * Represents a Discord client
 * @extends {discord.Client}
 */
export default class Client extends discord.Client {
    /**
     * Create a new client
     * @param {ClientOptions} clientOptions The options to use for the client
     */
    constructor(clientOptions:discord.ClientOptions) {
        super(clientOptions);

        /**
         * When the client was created
         * @type {Date}
         */
        this.started = new Date();

        /**
         * Collection of logs by date
         * @type {Collection<Date, {date:Date, prefix:string, message:string}>}
         */
        this.logs = new discord.Collection();

        /**
         * Collection of commands
         * @type {Collection<string, Command>}
         */
        this.commands = new discord.Collection();

        /**
         * Collection of command aliases
         * @type {Collection<string, String>}
         */
        this.aliases = new discord.Collection();

        
        // Warnings
        if (!clientOptions.logLimit) this.log("No saved log limit has been specified, this will eventually lead to memory issues.", "warn", chalk.rgb(255, 150, 0));
        if (!clientOptions.token) this.log("No token provided - please give a token on Client#login.", "warn", chalk.rgb(255, 150, 0));
    }

    /**
     * Log a message to console in the format {PREFIX} >> {message in color}
     * @param {String} message The message to log
     * @param {String} prefix The prefix of the log
     * @param {Function*} color Function to apply to log message, generally chalk.color.
     * @returns void
     */
    log(message:string, prefix:string, color:Function = chalk.blue, store:boolean = true):void {
        // Store message
        if (store) {
            this.logs.set(new Date(), { message, prefix, date: new Date() });
            if (this.options.logLimit && this.logs.size === this.options.logLimit) this.saveLogs(this.started, new Date());
        }
        // Log message
        console.log(`${chalk.bold(prefix.toUpperCase())} ${color(">>")} ${message}`);

        return undefined;
    }

    /**
     * Log in to Discord using the token provided or the token in ClientOptions
     * @param {String*} token The token to log in with
     * @returns {Promise<Client>} This client
     */
    async connect(token?:string):Promise<Client> {
        // Check if no token was found
        if (!this.options.token && !token) return Promise.reject("A token is required either in ClientOptions or in Client#login.");
        // Attempt login with token
        await super.login(token || this.options.token);

        // Return this client
        return this;
    }

    /**
     * Save logs between two times to a file
     * @param {Date} start The date to start saving from - use client.started for all
     * @param {Date} end The last date to save from
     * @param {Object*} opts The options to use
     * @param {String*} opts.path The path to save to - default "/log"
     * @param {Function*} opts.filter The filter to apply to the logs collection
     * @param {Boolean*} opts.deleteLogged Whether to delete logs that were saved
     * @returns {Promise<Collection<Date, Object>} The logged files
     */
    saveLogs(start:Date, end:Date, opts: SaveLogOptions = { path:"log", deleteLogged:true }):Promise<discord.Collection<Date, Object>> {
        return new Promise<discord.Collection<Date, Object>>((resolve, reject) => {
            // Create the path
            if (!fs.existsSync(opts.path)) fs.mkdirSync(opts.path, { recursive: true });

            // Prepends 0 to numbers < 10
            const zero = (num:number) => num.toString().length < 10 ? "0" + num : num;
            // Format the dates
            const format = (date:Date) => `${date.getFullYear()}-${zero(date.getMonth())}-${zero(date.getDate())}-${zero(date.getHours())}-${zero(date.getMinutes())}-${zero(date.getSeconds())}-${date.getMilliseconds()}`

            // Filter logs by date
            const write = this.logs.filter(log => log.date >= start && log.date <= end && (opts.filter ? opts.filter(log) : true));
            // Remove written logs from the collection
            this.logs.sweep(l => write.has(l.date));

            // Create the logs file
            fs.writeFile(`${opts.path}/${format(start)}-${format(end)}.log`, write.map(l => `[${format(l.date)}] [${l.prefix.toUpperCase()}] ${l.message}`).join("\n"), err => {
                if (err) return reject(err);
                resolve(write);
            });
        });
    }

    /**
     * Registers event files as listeners
     * @param {String} dir The event directory in reference to the project root
     * @returns {Promise<void>}
     */
    loadEvents(dir:string):Promise<void> {
        return new Promise((resolve, reject) => {
            // Read from dir in dist
            fs.readdir("dist/" + dir, async (error, files) => {
                // Check for errors
                if (error) return reject(error);
    
                // Loop through files
                for (let file of files) {
                    // Check if file isn't js (eg .js.map, etc)
                    if (!file.endsWith(".js")) continue;
                    // Import the file
                    const imported = await import(`../../${dir}/${file}`)
                    // Initialize the event
                    const event:Event = new imported.default(this);

                    // Add the listener
                    this.on(event.name, (...args:any) => event._run(...args));
                    this.log(`Event ${event.name} is now being listened for.`, "startup", chalk.rgb(50,255,100));
                }

                this.log(`All events have been loaded successfully.`, "startup", chalk.rgb(50,255,100));
                // Resolve the promise
                return resolve();
            });
        });
    }

    /**
     * Registers commandfiles as listeners
     * @param {String} dir The command directory in reference to the project root
     * @returns {Promise<void>}
     */
    loadCommands(dir:string):Promise<void> {
        return new Promise((resolve, reject) => {
            // Read from dir in dist
            fs.readdir("dist/" + dir, async (error, files) => {
                // Check for errors
                if (error) return reject(error);
    
                // Loop through files
                for (let file of files) {
                    // Check if file isn't js (eg .js.map, etc)
                    if (!file.endsWith(".js")) continue;
                    // Import the file
                    const imported = await import(`../../${dir}/${file}`)
                    // Initialize the command
                    const command:Command = new imported.default(this);

                    // Add to collection
                    this.commands.set(command.name, command);
                    command.aliases.forEach(a => this.aliases.set(a, command.name));

                    this.log(`Command '${command.name}' is now loaded with ${command.aliases.length} alias(es).`, "startup", chalk.rgb(50,255,100));
                }

                this.log(`All events have been loaded successfully.`, "startup", chalk.rgb(50,255,100));
                // Resolve the promise
                return resolve();
            });
        });
    }
}

/**
 * Save log options
 */
interface SaveLogOptions {
    /**
     * File path to save to
     */
    path: string,
    /**
     * Filters to apply
     */
    filter?: any,
    /**
     * Clear collection of logs sent?
     */
    deleteLogged: boolean
}