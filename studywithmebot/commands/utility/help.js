const { prefix } = require('../../config.json');
const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'help',
    description: 'List of all the commands and info',
    aliases: ['commands'],
    usage: '[command]',
    cooldown: 10,
    execute(message,args)
    {
        // getting the commands collection from the messages client coming from the index
        const { commands } = message.client;
        const fun = [];
        const moderation = [];
        const util = [];

        const commandFolders = fs.readdirSync('./commands');

        for(const command of commands)
        {

        }

        if (!args.length) {
            const embed = new Discord.MessageEmbed()
                .setTitle('Here\'s a list of all my commands:')
                .setThumbnail(message.client.user.avatarURL())
                .setColor("#127afa")
                .setFooter(`Current prefix is "${prefix}"`,client.user.avatarURL())
                .addFields(
                    {
                        name: "Commands",
                        value: commands.map(
                            command => `**${prefix}${command.name}:** ${command.description || 'no description'}`
                        ).join('\n')
                    }
                );

            message.channel.send(embed,{ split: true});
            //dms method if I even want to do that
            // return message.author.send(embed, { split: true })
            //     .then(() => {
            //         if (message.channel.type === 'dm') return;
            //         message.reply('I\'ve sent you a DM with all my commands!');
            //     })
            //     .catch(error => {
            //         console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
            //         message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
            //     });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('that\'s not a valid command!');
        }

        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

        data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

        message.channel.send(data, { split: true });

    },

}