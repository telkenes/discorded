![Banner](https://cdn.discordapp.com/attachments/513689941658566657/515115669667446787/banner.png)
[![Discord](https://discordapp.com/api/guilds/513688996816224257/embed.png?style=shield)](https://discord.gg/jFpTgs4)  
[![NpmPackage](https://nodei.co/npm/discorded.png?downloads=true)](https://www.npmjs.com/package/discorded)

## About

Discorded is a simple [Node.js](https://nodejs.org) that allows you to easily interact with the [Discord API](https://discordapp.com).

Advantages of Discorded:

-   Built in command handler
-   Planned to use less ram than other libs
-   Easy to use

Discorded is still in alpha and a very early stage. Due to this, docs are still to be made.

## Example usage

Raw Usage

```js
const Discorded = require('discorded');
const client = new Discorded.Client('token');

client.on('ready', async () => {
    console.log(`Bot started as ${client.user.tag}`);
});

client.on('message', async message => {
    if (message.content === 'ping') {
        message.channel.send('pong');
    }
});
```

Using with the built in command handler

```js
const Discorded = require('discorded');

// This function returns the prefix for the context.
function getPrefix(client, message) {
    // Here you can have custom prefixes or whatever you want.

    // The prefix can be a string.
    return 'dc ';

    // Or a list of strings
    return ['dc ', 'dc.'];
}

const client = new Discorded.Client(
    'token',
    getPrefix // Here is where we pass the getPrefix function to activate the command handler.
);

// This one is just simple ping command that sends pong to the channel.
const ping = new Discorded.Command('ping', (client, ctx) => {
    ctx.send('pong');
});

// This line loads the command to the command handler.
client.loadCommand(ping);

const eval = new Discorded.Command(
    'eval',
    (client, ctx) => {
        ctx.send(eval(ctx.argString));
    },
    {
        ownerOnly: true // This is where we pass checks, and other options like ownerOnly and nsfw
    }
);

// Here we load the command again.
client.loadCommand(eval);

//This time let's make an array of commands.

const commands = [
    new Discorded.Command(
        'discorded',
        (client, ctx) => {
            ctx.send('You are in the discorded guild.');
        },
        {
            checks: [ctx => ctx.guild.id === '513688996816224257'] // The checks must be a list even if it has only one check.
            // If the check fails this sends `checkError` event with ctx as the only argument.
        }
    ),

    new Discorded.Command(
        'dog',
        (client, ctx) => {
            // This is how you make embeds.
            let embed = new Discorded.Embed()
                .title('Here is a dog for you.', 'optional url') // Here you can set the title.
                .description('description') // The description
                .color('hex or discorded.Color') // Sets the color of the embed.
                .timestamp() // Timestamp this takes a date item in it, the default is new Date()
                .field('name', 'value', true | false) // adds a field to the embed. The last argument is inline and it is optional defaults to false
                .author('name', 'optional icon') // The author of the embed
                .footer('text') // Sets the footer
                .image('dog image url') // Image
                .thumbnail('thumbnail url'); // Thumbnail
            ctx.send(embed); // To send the embed you just pass it to the send method.
        },
        {
            nsfw: true // If we want to make this command to only respond in nsfw channel we set this. If the command is invoked in non nsfw channel this sends `notNSFW` event with the context argument.
        }
    )
];

// Then we can load a list of commands with
client.loadCommands(commands);

// Example handling for nsfw error
// This fires when nsfw check fails.
client.on('notNSFW', ctx => {
    ctx.send(
        `The command ${ctx.command.name} is only allowed in nsfw channels.`
    );
});

// Example handling for checkerror
// This fires when a check fails.
client.on('checkError', ctx => {
    ctx.send(
        `You do not have permissions to use the ${ctx.command.name} command.`
    );
});

// Example handling for notOwner error
// This fires when the ownerOnly check fails
client.on('notOwner', ctx => {
    ctx.send(
        `The command ${
            ctx.command.name
        } can only be used by the owner of the bot.`
    );
});

// Even tho you are using the built in command handler it is not restricting you from using
// The context or message event
client.on('message', message => {
    console.log(message.content);

    // OR you can get the context with
    let ctx = client.getContext(message);
});

// This fires when the bot is ready.
client.on('ready', () => {
    console.log('Ready');
});
```

## Links

-   [Discorded Discord server](https://discord.gg/jFpTgs4)
-   [Discord API Discord server](https://discord.gg/discord-api)
-   [GitHub Repo](https://github.com/telkenes/discorded)
-   [NPM](https://www.npmjs.com/package/discorded.js)

The absolute base for this library is forked from [nodecord](https://github.com/nodecord/nodecord).
