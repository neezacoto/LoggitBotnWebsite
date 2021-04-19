const fetch = require('node-fetch');
const {server_url} = require('../../endpoints.json');
const {prefix} = require('../../config.json');
const Discord = require('discord.js');
module.exports = {
    name: 'server',
    type: 'server',
    description: 'See server stats.',
    guildOnly:true,
    usage: '<start> or <end>; to start or end the season',
    args: false,
    cooldown: 10,
    async execute(message, args) {

        let server_req = await fetch(server_url+message.guild.id,{method: "GET"})
        let {season_number,off_season,logging} = await server_req.json();
        let season_status = (off_season)? "in off-season.":"in progress!";
                const embed = new Discord.MessageEmbed()
                    .setTitle(`${message.guild.name} Server Information:`)
                    .setThumbnail(message.guild.iconURL())
                    .setColor("#5ef666")
                    .setFooter(`Use ${prefix}top to view the leaderboard!`, message.client.user.avatarURL())
                    .addFields({
                        name: "Stats:",
                        value: `\`\`\`Season Number: ${season_number}\nSeason Status: ${season_status}
Member Count: ${message.guild.memberCount}\nMembers Logging: ${logging}\n\`\`\``
                    });
                message.channel.send(embed);


    },
};