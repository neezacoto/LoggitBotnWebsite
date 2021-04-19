module.exports = {
    name: 'ribbit',
    type: "fun",
    aliases: ['frog'],
    description: 'get a picture of a random frog!',
    guildOnly:true,
    usage: " ",
    cooldown: 3,
    async execute(message, args) {
        let num = `${Math.floor(Math.random() * 54) + 1}`;
        num =(num.length === 1)?  "000"+num : "00"+num;

        message.channel.send(`http://www.allaboutfrogs.org/funstuff/random/${num}.jpg`);
    },
};