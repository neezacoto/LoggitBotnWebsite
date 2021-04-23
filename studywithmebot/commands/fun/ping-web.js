const fetch = require('node-fetch');
const {ping_url} = require('../../endpoints.json');
module.exports = {
    name: 'pingweb',
    type: "fun",
    description: 'Get Ponged by the webserver!',
    guildOnly:true,
    cooldown: 10,
    async execute(message, args) {
        const { ping } = await fetch(ping_url)
            .then((result)=>{
                // console.log(result);
                    return result.json();
            })
        message.channel.send(ping);
    },
};