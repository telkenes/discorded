const discorded = require("../src/index");

module.exports = [
    new discorded.Command("test", async(client, ctx) => {
        ctx.send(`Your top role's color is ${ctx.author.topRole.color}`);
    }, {
        ownerOnly:true
    }),
    
    new discorded.Command("eval", async(client, ctx) => {
        try {
            ctx.send(eval(ctx.argString));
        } catch (err) {
            ctx.send(err);
        }
    }, {
        checks: [
            ctx => ctx.author.id === "464910064965386283",
        ]
    }),

]