const fetch = require('node-fetch');
const {server_season_toggle_url, server_season_create_url,server_url,entry_wipe_url} = require('../../endpoints.json');
module.exports = {
    name: 'season',
    type: 'season',
    description: 'Starts and ends seasons.',
    permissions: 'MANAGE_CHANNELS',
    guildOnly:true,
    usage: '<start> or <end>; to start or end the season',
    args: true,
    cooldown: 10,
    async execute(message, args) {
        if(args.length === 1) {
            //gets the server id
            let entry = {
                server_id: message.guild.id,
                arg: args[0]
            }
            let server = await fetch(server_url+message.guild.id, {method: "GET"})
            let {off_season} = await server.json();
            //message.channel.send("\`\`\`"+JSON.stringify(entry)+"\`\`\`");
            if(args[0].toLowerCase() ==="start") {
                if(off_season){
                fetch(server_season_toggle_url,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(entry)
                    })
                    .then((result) => {
                        console.log(result);
                        if (result.status === 404) {
                            fetch(server_season_create_url,
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify(entry)
                                })
                                .then((req) => {
                                    if (req.status === 200) {
                                        message.channel.send("Your first season has just begun!");
                                    } else {
                                        message.channel.send("Something went wrong creating your first season!")
                                    }
                                })
                        } else if (result.status === 200) {
                            message.channel.send("The season has started!!!")
                        } else {
                            message.channel.send("Something went wrong")
                        }

                    })

            }else{
                    message.reply("the season is already in progress.")
                }
            }
            else if(args[0].toLowerCase() ==="end") {
                if (!off_season)
                {

                    let bot_message = await message.reply('This command will end the season.\n'
                        + 'Confirm with 🟢 or cancel with 🔴, to end the season.')

                    bot_message.react('🟢').then(r => {
                        bot_message.react('🔴');
                    })

                    // First argument is a filter function
                    bot_message.awaitReactions((reaction, user) => user.id === message.author.id && (reaction.emoji.name === `🟢` || reaction.emoji.name === '🔴'),
                        {max: 1, time: 30000}).then(collected => {
                        if (collected.first().emoji.name === '🟢') {

                            fetch(server_season_toggle_url,
                                {
                                    method: "PUT",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify(entry)
                                })
                                .then((result) => {
                                    if (result.status === 404) {
                                        message.channel.send("There is no season to end. Please start a season first.")
                                    } else if (result.status === 200) {
                                        message.channel.send("Season has ended!");
                                    } else {
                                        message.channel.send("There is no season to end");
                                    }

                                })
                            fetch(entry_wipe_url + message.guild.id, {method: "DELETE"})
                                .then((req) => {
                                    message.channel.send("Entries cleaned");
                                })

                        } else
                            message.channel.send('Cancelled.');
                    }).catch(() => {
                        message.reply('No reaction after 30 seconds, operation canceled');
                    });
                }else{message.reply("there is no season to end.")}

            }
            else{
                message.channel.send("The arguments are **start** or **end**, for creating or ending a season.")
            }
        }else{
            message.channel.send("Please put <hours> <discord link of proof>");
        }


    },
};