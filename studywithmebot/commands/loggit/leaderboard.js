const fetch = require('node-fetch');
const {leaderboard_url,list_season_url} = require('../../endpoints.json');
const Discord = require('discord.js');
module.exports = {
    name: 'rank',
    type: 'user',
    description: 'Displays season rankings.',
    guildOnly:true,
    permissions: 'MANAGE_CHANNELS',
    aliases: ['ranks','r','leaderboard','top'],
    usage: '<season> or nothing to get current season',
    args: false,
    cooldown: 10,
    async execute(message, args) {

        let user = Math.abs(args[0]) || 0
        let entry = {
            server_id: message.guild.id,
            arg: user
        }

        let server_req = await fetch(leaderboard_url+`?season_number=${entry.arg}&server_id=${entry.server_id}`, {method: "GET"})
        let {seasons} = await server_req.json();
        if (!seasons.length) {
            message.reply("there's no information for this season :(");
        } else {
            let rankings= `**SEASON ${seasons[0].season_number} LEADERBOARD🏆:**\n----------------------------------------\n`;
            let place = 1;
            let top_three_emoji = ['🥇','🥈','🥉'];
            for(const position of seasons)
            {
                rankings += `${(place<4)? top_three_emoji[place-1]:`_ _***${place}***`} - **${position.tag_id}**: \`\`${position.total_hours} minutes\`\`\n`
                place++;
            }
            rankings += `...`;

            message.channel.send(rankings);
            const embed = new Discord.MessageEmbed()
                .setURL(list_season_url+`?server_id=${entry.server_id}&season_number=${entry.arg}`)
                .setTitle(`View Full Leaderboard`)
                .setColor("#5ef666")
                .setFooter(`Click on "View Full Leaderboard" to view all rankings!`, message.guild.iconURL())

            message.channel.send(embed);
        }

    },
};