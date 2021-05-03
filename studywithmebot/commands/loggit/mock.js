const fetch = require('node-fetch');
const {entry_url, season_update_url, season_user_url,server_url} = require('../../endpoints.json');
const {prefix} = require('../../config.json')
const check_url = (args)=> {
    let check_1 = false;
    let check_2 = false;
    try {
        new URL(args);
        check_1 = true;
    } catch (e) {}

    let acceptable_ext = [".jpg", ".gif", ".png", ".pdf", ".webp"];

    for (const ext of acceptable_ext) {
        if (args.endsWith(ext))
            check_2 = true;
    }
    return check_1 && check_2;

}
const log = async (message,entry,arg_one) =>{
    //message.channel.send("\`\`\`"+JSON.stringify(entry)+"\`\`\`");
    let check = await fetch(season_user_url + entry.serveruser_id, {
        method: "GET"
    })

    if (check.status === 404) {
        fetch(entry_url,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(entry)
            })
            .then((result) => {
                console.log(result);
                if (result.status === 200) {
                    message.channel.send("Welcome to the season!")
                } else if (result.status === 404) {
                    message.channel.send("Your server is on off season!")
                } else if (result.status === 500) {
                    message.reply(`\`\`${arg_one}\`\` is not a valid entry; please use numbers`)
                    message.delete();
                } else {
                    message.channel.send("Something went wrong")
                }

            })
    } else {
        let {server_user_season} = await check.json();
        let result = await fetch(entry_url,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(entry)
            })

        if (result.status === 200) {
            fetch(season_update_url,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        server_user_season: server_user_season,
                        hours: entry.hours,
                        tag_id: entry.tag_id
                    })
                })
            let r = await fetch("https://zenquotes.io/api/random",{method: "GET"});
            let quote = await r.json();
            let {q,a} = quote[0];
            message.reply(`\n\`\`Successfully logged!\`\`\n> ${q}\n-${a}`);
        } else {
            message.reply(`\`\`${arg_one}\`\` is not a valid entry; please use numbers`)
            message.delete();
        }
        // here
    }
}
module.exports = {
    name: 'mock',
    type: 'demo',
    guildOnly:true,
    permissions: `MANAGE_CHANNELS`,
    args: true,
    cooldown: 10,
    async execute(message, args) {
        //console.log(entry_url +" " + season_update_url);
            let proof_samples = [
                `https://cdn.discordapp.com/attachments/835259740690710629/835268143635103754/Screenshot_20210423-173701_Forest.jpg`,
                `https://cdn.discordapp.com/attachments/835259740690710629/835280839453048892/Screenshot_20210423-182712_Forest.jpg`,
                `https://cdn.discordapp.com/attachments/835259740690710629/835280860654993428/Screenshot_20210423-182616_Forest.jpg`,
                `https://cdn.discordapp.com/attachments/835259740690710629/835280906742136902/Screenshot_20210423-182608_Forest.jpg`,
                `https://cdn.discordapp.com/attachments/835259740690710629/838808339860946984/Screenshot_20210503-120422_Forest.jpg`,
                `https://cdn.discordapp.com/attachments/835259740690710629/835280879760703508/Screenshot_20210423-182646_Forest.jpg`
            ]
            let proof_num = `${Math.floor(Math.random() * 6)}`
            let minutes_num=`${Math.floor(Math.random() * 480) + 1}`

            let server_req = await fetch(server_url + message.guild.id, {method: "GET"})
            let {off_season} = await server_req.json();
            if (!off_season) {


                let user = message.mentions.users.first() || message.author
                        let entry = {
                            serveruser_id: (message.guild.id + "|" + user.toString()),
                            server_avatar: message.guild.iconURL(),
                            server_id: message.guild.id,
                            user_avatar: user.avatarURL(),
                            user_id: user.toString(),
                            hours: minutes_num, //minutes
                            proof: proof_samples[proof_num],
                            tag_id: `${user.username}#${user.discriminator}`,
                        }
                        await log(message,entry,minutes_num);



            } else {
                message.channel.send("You can't log during the off-season :(")
            }


    },
};