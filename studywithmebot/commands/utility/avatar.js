const Discord = require('discord.js');
module.exports = {
    name: 'avatar',
    type: 'utility',
    aliases: ['icon','pfp','av'],
    description: "Used to retrieve avatars",
    args: false,
    cooldown: 5,
    usage: '<user>',
    execute(message, args) {

        let person = message.mentions.users.first();
        if(!args.length)
        {
            const embed = new Discord.MessageEmbed()
                .setTitle(`${message.author.username}'s avatar`)
                .setImage(message.author.avatarURL())
                .setColor("#ababab");

            return message.channel.send(embed);
        }
        const user = message.mentions.users.first();
        const embed = new Discord.MessageEmbed()
            .setTitle(`${user.username}'s avatar`)
            .setImage(user.avatarURL())
            .setColor("#ababab");

        return message.channel.send(embed)
    }

}