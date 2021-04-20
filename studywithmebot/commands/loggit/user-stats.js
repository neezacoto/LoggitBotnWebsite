const fetch = require('node-fetch');
const {user_url} = require('../../endpoints.json');
const {prefix} = require('../../config.json');
const Discord = require('discord.js');
module.exports = {
    name: 'user',
    type: 'user',
    description: 'See a user\'s stats.',
    guildOnly:true,
    aliases: ['stats','u'],
    usage: '<user> or nothing to get your own',
    args: false,
    cooldown: 10,
    async execute(message, args) {

        let user = message.mentions.users.first() || message.author
        let entry = {
            server_id: message.guild.id,
            arg: user.toString()
        }
        let server_req = await fetch(user_url+`?user_id=${entry.arg}&server_id=${entry.server_id}`, {method: "GET"})
        let {seasons} = await server_req.json();
        let fields = new Array();
        if (!seasons.length) {
            message.reply("there's no information for this user :(");
        } else {
            let total_hours = 0;
            for(const season of seasons)
            {
                total_hours += parseInt(season.total_hours);
            }
            total_hours = (parseInt(total_hours/60*100))/100;
            let temp = seasons.shift()
            fields.push({name: `:pencil: Season ${temp.season_number}`,value: `Logged: \`\`${temp.total_hours} minutes\`\``})
        for(const season of seasons)
        {
            fields.push({name: `Season ${season.season_number}:`,value: `Logged: \`\`${season.total_hours} minutes\`\``})
        }

        const embed = new Discord.MessageEmbed()
            .setTitle(`-${user.username}'s stats-`)
            .setThumbnail(user.avatarURL())
            .setColor("#5ef666")
            .setFooter(`Total hours logged: ${total_hours}`, user.avatarURL())
            .addFields(fields);
        message.channel.send(embed);
    }


    },
};