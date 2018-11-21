const discorded = require('../src/index');

module.exports = [
    new discorded.Command('say', async (client, ctx) => {
        ctx.send(ctx.argString);
    }),

    new discorded.Command('edit', async (client, ctx) => {
        ctx.send(`hmm`).then(msg => {
            msg.edit(`hmmm`);
        });
    }),

    new discorded.Command('info', async (client, ctx) => {
        const member = ctx.getMember(ctx.argString) || ctx.author;
        let embed = new discorded.Embed()
            .field('ID', member.id)
            .thumbnail(member.avatarURL)
            .color(ctx.author.topRole.color);
        if (member.nick) {
            embed.title(`Info of ${member.nick} aka (${member.username})`);
        } else {
            embed.title(`Info of ${member.name}`);
        }
        ctx.send(embed);
    }),

    new discorded.Command('dm', async (client, ctx) => {
        ctx.author.send('I have dmmed you.');
    }),

    new discorded.Command('roles', async (client, ctx) => {
        let member = ctx.getMember(ctx.argString) || ctx.author;
        if (!member.roles) {
            return ctx.send(`${member.name} doesn't have any roles.`);
        }
        let embed = new discorded.Embed()
            .title('Your roles.')
            .description(member.roles.map(role => role.mention).join(' '))
            .thumbnail(member.avatarURL)
            .color(ctx.author.topRole.color);
        ctx.send(embed);
    }),

    new discorded.Command('channels', async (client, ctx) => {
        let embed = new discorded.Embed()
            .title('Channels')
            .description(
                ctx.guild.channels.map(channel => `<#${channel.id}>`).join('\n')
            );
        ctx.send(embed);
    }),

    new discorded.Command(
        'kick',
        async (client, ctx) => {
            let member = ctx.getMember(ctx.args[0]);
            if (!member) {
                return ctx.send('This member was not found');
            }
            ctx.args.shift();
            await member.kick(ctx.args.join(' '));
            await ctx.send(':ok_hand:');
        },
        {}
    ),

    new discorded.Command(
        'ban',
        async (client, ctx) => {
            let member = ctx.getMember(ctx.argString);
            if (!member) {
                return ctx.send('This member was not found.');
            }
            await member.ban();
            ctx.send(':ok_hand:');
        },
        {
            help:
                'bannaa sen tyypin jonka haluut bannata tää lukee sun ajatukset'
        }
    )
];
