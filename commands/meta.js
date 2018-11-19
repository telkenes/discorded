const discorded = require("../src/index");

module.exports = [
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