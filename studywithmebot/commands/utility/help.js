const { prefix } = require('../../config.json');
const Discord = require('discord.js');
const fs = require('fs');
const filter_type = (cmds,cmd,type)=>{
    return cmds.filter((cmd)=>{
        return cmd === type;
    });
}
module.exports = {
    name: 'help',
    type: 'utility',
    description: 'List of all the commands and info',
    aliases: ['commands'],
    usage: '<command> to get the usage for another command',
    cooldown: 10,
    execute(message,args)
    {

        const client = message.client;
        // getting the commands collection from the messages client coming from the index
        const { commands } = message.client;


        const commandFolders = fs.readdirSync('./commands');
        //there's probably a better way of doing this...
        if (!args.length) {
            let fun = commands.filter((cmd)=>{
                return cmd.type === "fun";
            });
            let user = commands.filter((cmd)=>{
                return cmd.type === "user";
            });
            let server = commands.filter((cmd)=>{
                return cmd.type === "server";
            });
            let season = commands.filter((cmd)=>{
                return cmd.type === "season";
            });
            let util = commands.filter((cmd)=>{
                return cmd.type === "utility";
            });
            let types = [fun,user,server,season,util];

            for(let i = 0; i<types.length;i++)
            {

                 types[i]=(types[i].map(
                    command => `\`\`${prefix}${command.name}:\`\` ${command.description || 'no description'}`
                ).join('\n')).toString()
            }
            for(let i = 0; i<types.length;i++)
            {
                if(types[i] === "")
                {
                    types[i] = "no commands yet";
                }
            }

            const embed = new Discord.MessageEmbed()
                .setTitle(`Here\'s a list of all my commands:`)
                .setThumbnail(message.client.user.avatarURL())
                .setColor("#5ef666")
                .setFooter(`|   Current prefix is "${prefix}"   |   doing ${prefix}help on another command gives more info   |`,client.user.avatarURL())
                .addFields(
                    {
                        name: "Fun:",
                        value: types[0]
                    },
                    {
                        name: "Utility",
                        value: types[4]
                    },
                    {
                        name: "User:",
                        value: types[1]
                    },
                    {
                        name: "Server:",
                        value: types[2]
                    },
                    {
                        name: "Season [Mod Use]",
                        value: types[3]
                    }
                    );

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
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Information for ${command.name}`)
                    .setThumbnail(message.client.user.avatarURL())
                    .setColor("#5ef666")
                    .setFooter(`|   Current prefix is "${prefix}"   |`,client.user.avatarURL())
                    .addFields(
                        {
                            name: "Description:",
                            value: `\`\`${command.description || 'no description'}\`\``
                        },
                        {
                            name: "Usage:",
                            value: `\`\`${prefix}${command.name} ${command.usage || `no usage description`}\`\``
                        },
                        {
                            name: "Aliases:",
                            value: `\`\`${command.aliases || "no aliases"}\`\``
                        })
                message.reply(embed);
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