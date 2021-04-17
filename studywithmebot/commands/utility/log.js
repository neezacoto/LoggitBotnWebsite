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
            fetch("http://localhost:9999/Entry",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(entry)
                })
                .then((result) => {
                    console.log(result);
                    if(result)
                    {
                        message.channel.send("Welcome to the season!")
                    }
                    else if(result.status === 202)
                    {
                        fetch("http://localhost:9999/Season/Update",
                            {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(result)
                            })
                            .then((result)=>
                            {
                                message.channel.send("Successfully logged!")
                            })
                    }
                    else if(result.status === 404){
                        message.channel.send("Your server is on off season!")
                    }else {
                        message.channel.send("Something went wrong")
                    }

                })
        }else{
            message.channel.send("Please put <hours> <discord link of proof>");
        }

    },
};