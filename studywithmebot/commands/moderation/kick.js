module.exports = {
    name: 'kick',
    description: 'kicks a specified member',
    args: true,
    guildOnly: true,
    usage: '<user>',
    permissions: 'KICK_MEMBERS',
    execute(message,args)
    {
        const target = args[0].mentions.users.first();
        target.send(`Looks like you've been kicked :/`);
        return target.kick();
    }
}