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
        const client = message.client;
        // getting the commands collection from the messages client coming from the index
        const { commands } = message.client;
        const fun = [];
        const moderation = [];
        const util = [];

        const commandFolders = fs.readdirSync('./commands');

        if (!args.length) {
            const embed = new Discord.MessageEmbed()
                .setTitle(`Here\'s a list of all my commands:`)
                .setThumbnail(message.client.user.avatarURL())
                .setColor("#127afa")
                .setFooter(`Current prefix is "${prefix}"`,client.user.avatarURL())
                .addFields(
                    {
                        name: "Commands",
                        value: (commands.map(
                            command => `**${prefix}${command.name}:** ${command.description || 'no description'}`
                        ).join('\n')).toString()
                    });

            message.reply(embed);
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
        else if(args.length) {
            try {
                const name = args[0].toLowerCase();
                const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
                const toSay = (`\n**${prefix}${command.name}:**
Description: ${command.description || 'no description'}
Usage: \`\`${prefix}${command.name} ${command.usage || `no usage description`}\`\``);
                message.reply(toSay);
            }
            catch(error)
            {
                message.reply(`${args[0]} is not a command.`)
            }
        }
        else{
            message.reply(`\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``)
        }

    }

}