const fetch = require('node-fetch');
const {user_wipe_url} = require('../../endpoints.json');
module.exports = {
    name: 'wipe',
    type: 'season',
    description: 'Wipes all logs from a user.',
    permissions: 'MANAGE_CHANNELS',
    guildOnly:true,
    aliases: ['w','delete','remove'],
    usage: '<user> to wipe all logs from this user',
    args: true,
    cooldown: 10,
    async execute(message, args) {
        if (args.length > 0) {
            let user_to_delete = message.mentions.users.first().toString();

            let bot_message = await message.reply('This command will wipe all records for '+user_to_delete.toString()+'.\n'
                + 'Confirm with 🟢 or cancel with 🔴, to end the season.')

            bot_message.react('🟢').then(r => {
                bot_message.react('🔴');
            })

            // First argument is a filter function
            bot_message.awaitReactions((reaction, user) => user.id === message.author.id && (reaction.emoji.name === `🟢` || reaction.emoji.name === '🔴'),
                {max: 1, time: 30000}).then(collected => {
                if (collected.first().emoji.name === '🟢') {

                    fetch(user_wipe_url,
                        {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                user: user_to_delete,
                                server_id: message.guild.id})
                        })
                        .then((result) => {
                                message.channel.send(+user_to_delete.toString()+" has been removed from server logs");
                        })


                } else
                    message.channel.send('Cancelled.');
            }).catch(() => {
                message.reply('No reaction after 30 seconds, operation canceled');
            });
        }



    }
}