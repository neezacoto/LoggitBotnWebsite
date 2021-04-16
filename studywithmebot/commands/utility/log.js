const fetch = require('node-fetch');
module.exports = {
    name: 'log',
    description: 'Logs hours into Loggit.',
    guildOnly:true,
    usage: '<hours> <discord link proof>',
    args: true,
    cooldown: 10,
    execute(message, args) {
        if(args.length === 2) {

            let entry = {
                serveruser_id: (message.guild.id + "|" + message.author.toString()),
                server_avatar: message.guild.iconURL(),
                server_id: message.guild.id,
                user_avatar: message.author.avatarURL(),
                user_id: message.author.toString(),
                hours: args[0], //hours
                proof: args[1],
            }
            message.channel.send("\`\`\`"+JSON.stringify(entry)+"\`\`\`");
            fetch(`http://localhost:9999/Entry`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: entry
                })
                .then((result) => {
                    console.log(result);
                    if(result.status===200)
                    {
                        message.channel.send("Successfully logged ")
                    }else{
                        message.channel.send("Something went wrong")
                    }

                })
        }else{
            message.channel.send("Please put <hours> <discord link of proof>");
        }

    },
};