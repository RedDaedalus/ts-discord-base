# ts-discord-base
#### This is a simple base Discord bot created in TypeScript that I use for all my projects.

I created this because starting from scratch for every bot you make sort of sucks so I wanted a base to build off of.

### Commands
> Create a file in your `commands` folder, which is specified by `Client#loadCommands(dir);`, and fill it like so:
```ts
import Command from "path/to/structures/folder/in/src";

export default class PascalCaseName {
    constructor(client:Client) {
        super(client, {
            help: {
                name: "commandname",
                description: "Description of the command.",
                category: "category shown in help"
            },
            conf: {
                perms: { 
                    user: ["ADMINISTRATOR"],
                    bot: ["SEND_MESSAGES", "EMBED_LINKS"]
                },
                aliases: []
            }
        });
    }

    async run(message:Message, args:string[]):Promise<void> {
        const embed = this.buildEmbed().setDescription(`Your arguments were: ${args.join(", ")}`);
        await message.channel.send(embed);

        return;
    }
}
```

### Events
> Create a file in your `events` folder, which is specified by `Client#loadEvents(dir);`, and fill it like so, but with your own event:
```ts
import Event from "path/to/structures/folder/in/src";

import chalk from "chalk";

export default class Ready extends Event {
    constructor(client:Client) {
        super(client, "ready");
    }

    async run():Promise<void> {
        this.client.log(`Bot started under ${this.client.user.tag}.`, "startup", chalk.rgb(75,255,100));
        return;
    }
}

```