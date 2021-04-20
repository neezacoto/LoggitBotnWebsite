const {rank_page} = require('../../endpoints.json');
const Discord = require('discord.js');
module.exports = {
    name: 'rank',
    type: 'user',
    description: 'See this season\'s leaderboard.',
    guildOnly:true,
    aliases: ['ranks','r','leaderboard'],
    usage: ' ',
    args: false,
    cooldown: 10,
    async execute(message, args) {

        const embed = new Discord.MessageEmbed()
            .setURL(" ")
            .setTitle("Server Leaderboard")
            .setColor("#ababab")
            .setImage(message.guild.iconURL())

        message.channel.send(embed);
    },
};