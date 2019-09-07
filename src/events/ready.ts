import Event from "../structures/Event";
import Client from "../structures/Client";

import chalk from "chalk";

export default class Ready extends Event {
    constructor(client:Client) {
        super(client, "ready");
    }

    async run() {
        this.client.log("Ready!", "startup", chalk.rgb(50,255,100));
    }
}