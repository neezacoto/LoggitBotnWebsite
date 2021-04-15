module.exports = {
    name: 'pingweb',
    description: 'sends a request to the webfront',
    aliases: ['web'],
    cooldown: 10,
    execute(message,args)
    {
        fetch(`http://localhost:9999/ping`,)

    }