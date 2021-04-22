const fetch = require('node-fetch');
const {refresh_url} = require('../../endpoints.json');
module.exports = {
    name: 'refresh',
    type: "season",
    aliases: ['update'],
    description: 'updates server name',
    permissions: 'MANAGE_CHANNELS',
    guildOnly:true,
    usage: " ",
    cooldown: 10,
    async execute(message, args) {

        fetch(refresh_url,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                server_id: message.guild.id,
                name: message.guild.name
            })
        })
        message.channel.send("name successfully updated!")

    },
};