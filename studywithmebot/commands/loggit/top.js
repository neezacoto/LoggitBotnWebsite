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
            .setURL("https://www.youtube.com/watch?v=8-NcrRzH0vA")
            .setTitle("Server Leaderboard")
            .setColor("#5ef666")
            .setFooter(`Click on "Server Leaderboard" to view all rankings!`, message.guild.iconURL())

        message.channel.send(embed);
    },
};