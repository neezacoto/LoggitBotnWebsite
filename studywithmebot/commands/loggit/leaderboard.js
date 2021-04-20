const fetch = require('node-fetch');
const {leaderboard_url} = require('../../endpoints.json');
const Discord = require('discord.js');
module.exports = {
    name: 'top',
    type: 'season',
    description: 'See a season rankings. [mod]',
    guildOnly:true,
    permissions: 'MANAGE_CHANNELS',
    aliases: ['leaderboard','t','rank'],
    usage: '<season> or nothing to get current season',
    args: false,
    cooldown: 10,
    async execute(message, args) {

        let user = Math.abs(args[0]) || -1
        let entry = {
            server_id: message.guild.id,
            arg: user
        }
        let server_req = await fetch(leaderboard_url+`?season_number=${entry.arg}&server_id=${entry.server_id}`, {method: "GET"})
        let {seasons} = await server_req.json();
        if (!seasons.length) {
            message.reply("there's no information for this season :(");
        } else {
            let rankings= `**SEASON ${seasons[0].season_number} LEADERBOARD:**\n----------------------------------------\n`;
            let place = 1;
            for(const position of seasons)
            {
                rankings += `**${place}** - ${position.user_id}: ${position.total_hours} minutes\n`
                place++;
            }
            rankings += `----------------------------------------`;

            message.channel.send(rankings);
        }


    },
};