module.exports = {
    name: 'pingweb',
    description: 'sends a request to the database',
    aliases: ['web'],
    usage: 'tests connection to the database endpoints',
    cooldown: 10,
    execute(message, args) {
        fetch(`http://localhost:9999/Ping`)
            .then((result)=>{
                if(JSON.stringify(result) === "Pong!")
                {
                    message.channel.send("Database: Pong!");
                }
            })

    }
}