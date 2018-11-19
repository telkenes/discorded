const discorded = require("../src/index");

console.log(`Discorded version ${discorded.version}`);

function getPrefix(client, message){
    return ["dc.", "dc "];
}

const client = new discorded.client(require("./config.json").token, getPrefix);

const meta = [
    new discorded.Command("say", async(client, ctx) => {
        ctx.send(ctx.argString);
    }),
    
    new discorded.Command("edit", async(client, ctx) => {
        ctx.send(`hmm`).then(msg => {
            msg.edit(`hmmm`);
        });
    }),
    
    new discorded.Command("info", async(client, ctx) => {
        // const member = ctx.getMemberOrAuthor(ctx.argString);
        const member = ctx.author;
        let embed = new discorded.Embed()
        .title("Info of " + member.name)
        .field("ID", member.id)
        .thumbnail(member.avatarURL);
        ctx.send(embed);
    }),
    
    new discorded.Command("test", async(client, ctx) => {
        ctx.send(ctx.guild.channels.map(channel => channel.type));
    }, {
        ownerOnly:true
    })
]

client.loadCommands(meta);

client.on("commandError", err => {
    ctx.send("There was an error, try again later.");
});

client.on("ready", async() => {
    console.log(`Logged in as ${client.user.toString()}`);
});

client.on("checkError", ctx => {
    ctx.send("You do not have permissions to do that.");
});

client.on("notNSFW", ctx => {
    ctx.send("This command cna only be used in nsfw channels.");
});