import discord from "discord.js";
import Client from "./Client";

/**
 * Represents a Discord socket event
 */
class Event {
    /**
     * Create a new event
     * @param {Client} client The client to reference in the event
     * @param {String} name The name of the event
     */
    constructor(client:Client, name:string) {
        this.client = client;
        this.name = name;
        
        this._handlers = [];
    }

    /**
     * Add a handler to the event - a file exporting a function that runs if the function returns true
     * @param {String} name The name of the file (without extension)
     * @param {Function} func The condition to check
     */
    async addHandler(name:string, func:Function):Promise<void> {
        this._handlers.push({
            condition: func,
            run: (await import(`../handlers/${name}.js`)).default
        });

        return;
    }

    /**
     * Runs all events and handlers
     * @param {...args:any} args Any value(s) passed by discord.js events
     * @returns {void}
     */
    _run(...args:any):void {
        for (let handler of this._handlers) if (handler.condition(...args)) handler.run(this.client, ...args);
        // @ts-ignore
        this.run(...args);

        return;
    }
}

interface Event {
    client:Client;
    name:string;
    _handlers:{ condition:Function, run:Function }[];
}

export default Event;