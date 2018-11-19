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
        ctx.guild.members.forEach(member => {
            if (member.id === ctx.args[0]){
                let embed = new discorded.Embed()
                .title("Info of " + member.name)
                .field("ID", member.id)
                .thumbnail(member.avatarURL);
                ctx.send(embed);
            } 
        })
    }),
    
    new discorded.Command("test", async(client, ctx) => {
        ctx.send(ctx.guild.channels.map(channel => channel.type));
    }, {
        ownerOnly:true
    }),

    new discorded.Command("dm", async(client, ctx) => {
        ctx.author.send("I have dmmed you.");
    }),

    new discorded.Command("eval", async(client, ctx) => {
        ctx.send(eval(ctx.argString));
    }, {
        ownerOnly: true
    }),

    new discorded.Command("roles", async(client, ctx) => {
        console.log(ctx.author.roles);
        let embed = new discorded.Embed()
            .title("Your roles.")
            .description(ctx.author.roles.map(role => role.mention))
            .thumbnail(ctx.author.avatarURL);
            ctx.send(embed);
    })
]