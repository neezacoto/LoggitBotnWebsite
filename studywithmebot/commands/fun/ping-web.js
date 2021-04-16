const fetch = require('node-fetch');
module.exports = {
    name: 'pingweb',
    description: 'PingWeb!',
    guildOnly:true,
    cooldown: 10,
    async execute(message, args) {
        const { ping } = await fetch(`http://localhost:9999/Ping`)
            .then((result)=>{
                console.log(result);
                    return result.json();
            })
        message.channel.send(ping);
    },
};