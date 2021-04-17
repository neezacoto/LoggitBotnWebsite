const fetch = require('node-fetch');
module.exports = {
    name: 'season',
    description: 'Starts and ends seasons.',
    guildOnly:true,
    usage: '<start> or <end>; to start or end the season',
    args: true,
    cooldown: 10,
    execute(message, args) {
        if(args.length === 1) {
            //gets the server id
            let entry = {
                server_id: message.guild.id,
                arg: args[0]
            }
            message.channel.send("\`\`\`"+JSON.stringify(entry)+"\`\`\`");
            if(args[0].toLowerCase() ==="start") {
                fetch("http://localhost:9999/Season/Toggle",
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
                            fetch("http://localhost:9999/Season/Create",
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
            }
            else if(args[0].toLowerCase() ==="end")
            {
                fetch("http://localhost:9999/Season/Toggle",
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(entry)
                    })
                    .then((result)=>{
                    if (result.status === 404) {
                        message.channel.send("There is no season to end. Please start a season first.")
                    }else if(result.status === 200)
                    {
                        message.channel.send("Season has ended!");
                    }else{
                        message.channel.send("Something went wrong with ending the server");
                    }

                })
            }
            else{
                message.channel.send("The arguments are **start** or **end**, for creating or ending a season.")
            }
        }else{
            message.channel.send("Please put <hours> <discord link of proof>");
        }


    },
};