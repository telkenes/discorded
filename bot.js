const nodecord = require("./src/index");
const client = new nodecord(require("./config.json").token);

client.on("ready", async() => {
    console.log(`Logged in as ${client.user.toString()}`);
    console.log(client.channels.get("494356859147386891"));
});

client.on("message", async (ctx) => {
    switch (ctx.message.content) {
        case "nc.hello":
            ctx.send(`Hello ${ctx.author.name}. You are currently exploring the great world of ${ctx.guild.name}, it has ${ctx.guild.channels.length} channels.`);
            break;
        case "nc.info":
            try {
                const Embed = require("./src/util/Message/MessageEmbed");
                let embed = new Embed()
                .title("Info of " + ctx.author.name)
                .field("ID", ctx.author.id)
                .thumbnail(ctx.author.avatarURL)
                .pack();
                console.log(embed);
                ctx.send(embed);
            } catch (error) {
                console.error(error);
            }
        case "nc.date":
        try {
            ctx.send(ctx.message.date);
        } catch (e){
            ctx.send(e);
        }
        break;
    }
});

client.on("guildAvailable", guild => {
    console.log(guild.name + " is now available.");
});