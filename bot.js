const discorded = require("./src/index");
const meta = require("./commands/meta");

console.log(`Discorded version ${discorded.version}`);

const client = new discorded.Client(require("./config.json").token, (client, msg) => ["dc ", "dc."]);

client.loadCommands(meta);

client.on("commandError", (ctx, err) => {
    ctx.send("There was an error, try again later.\nError: " + err);
    console.log(err);
});

client.on("message", async(message) => {
    if (message.content === "dc.hello"){
        message.channel.send(`Hello there ${message.author.tag}`);
    }
});

client.on("ready", async() => {
    console.log(`Logged in as ${client.user.toString()}`);
});

client.on("checkError", ctx => {
    ctx.send(`You do not have permissions to use ${ctx.command.name}.`);
});

client.on("notNSFW", ctx => {
    ctx.send("This command cna only be used in nsfw channels.");
});

client.on("notOwner", ctx => {
    ctx.send(`The command ${ctx.command.name} is owner only command.`);
});