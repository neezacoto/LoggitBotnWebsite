const fetch = require('node-fetch');
module.exports = {
    name: 'pingweb',
    description: 'PingWeb!',
    guildOnly:true,
    cooldown: 10,
    execute(message, args) {
        fetch(`https://45.79.131.73/Ping`)
            .then((result)=>{
                if(JSON.stringify(result) === "Pong!")
                {
                    message.channel.send("Database: Pong!");
                }
            })
    },
};