const fetch = require('node-fetch');
module.exports = {
    name: 'cat',
    type: "fun",
    description: 'get a picture of a random cat!',
    guildOnly:true,
    cooldown: 5,
    async execute(message, args) {
        const { file } = await fetch('https://aws.random.cat/meow')
            .then(response => {
                console.log(response);
                return response.json()});

        message.channel.send(file);
    },
};