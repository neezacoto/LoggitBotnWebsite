const fetch = require('node-fetch');
const {server_url} = require('../../endpoints.json');
const {prefix} = require('../../config.json');
const Discord = require('discord.js');
module.exports = {
    name: 'user',
    type: 'user',
    description: 'See a user\'s stats.',
    guildOnly:true,
    usage: '<user> or nothing to get your own',
    args: false,
    cooldown: 10,
    async execute(message, args) {
        let user = args[0] || message.author.toString()
        let entry = {
            server_id: message.guild.id,
            arg: user
        }
        let server_req = await fetch(server_url+message.guild.id,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(entry)
            })
        let user_seasons = await server_req
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