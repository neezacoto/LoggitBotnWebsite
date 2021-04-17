const fetch = require('node-fetch');
module.exports = {
    name: 'season',
    description: 'Starts and ends seasons.',
    guildOnly:true,
    usage: '<hours> <discord link proof>',
    args: true,
    cooldown: 10,
    execute(message, args) {
        if(args.length === 1) {
            //gets the server id
            let entry = {
                server_id: message.guild.id,
            }
            message.channel.send("\`\`\`"+JSON.stringify(entry)+"\`\`\`");
            fetch("http://localhost:9999/Season/Create",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(entry)
                })
                .then((result) => {
                    console.log(result);
                    if(result.status===404)
                    {
                        fetch("http://localhost:9999/Season/Create",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(entry)
                            })
                            .then((req)=>{
                                if(req.status===200)
                                {
                                    message.channel.send("Your first season has just begun!");
                                }else{
                                    message.channel.send("Something went wrong creating your first season!")
                                }
                            })
                    }
                    else if(result.status === 200)
                    {
                        message.channel.send("The season has started!!!")
                    }
                    else{
                        message.channel.send("Something went wrong")
                    }

                })
        }else{
            message.channel.send("Please put <hours> <discord link of proof>");
        }

    },
};