const fetch = require('node-fetch');
const {entry_url, season_update_url, season_user_url,server_url} = require('../../endpoints.json');
const {prefix} = require('../../config.json')
module.exports = {
    name: 'log',
    type: 'user',
    aliases: ['entry','l'],
    description: 'Logs minutes into Loggit.',
    guildOnly:true,
    usage: '<minutes> <discord link proof>',
    args: true,
    cooldown: 10,
     async execute(message, args) {
         //console.log(entry_url +" " + season_update_url);
        if(parseInt(args[0])<=1440&&parseInt(args[0])>0)
         {
         let server_req = await fetch(server_url + message.guild.id, {method: "GET"})
         let {off_season} = await server_req.json();
         if (!off_season) {

             if (args.length === 2) {

                 let check_url = () => {
                     try {
                         new URL(args[1]);
                     } catch (e) {
                         //console.error(e);
                         return false;
                     }
                     return true;
                 };
                 let acceptable_ext = [".jpg", ".gif", ".png", ".pdf", ".webp"];
                 let ext_check = false;
                 for (const ext of acceptable_ext) {
                     if (args[1].endsWith(ext))
                         ext_check = true;
                 }

                 if (check_url() && ext_check) {

                     let entry = {
                         serveruser_id: (message.guild.id + "|" + message.author.toString()),
                         server_avatar: message.guild.iconURL(),
                         server_id: message.guild.id,
                         user_avatar: message.author.avatarURL(),
                         user_id: message.author.toString(),
                         hours: args[0], //minutes
                         proof: args[1],
                     }
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
                                     message.reply(`\`\`${args[0]}\`\` is not a valid entry; please use numbers`)
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
                                                 hours: entry.hours
                                             })
                                         })
                                     let r = await fetch("https://zenquotes.io/api/random",{method: "GET"});
                                     let quote = await r.json();
                                     let {q,a} = quote[0];
                                     message.channel.send(`\`\`Successfully logged!\`\`\n> ${q}\n-${a}`);
                                 } else {
                                     message.reply(`\`\`${args[0]}\`\` is not a valid entry; please use numbers`)
                                     message.delete();
                                 }
                              // here
                     }
                 } else {
                     message.reply("you did not provide a proper image url!\n**I take:** \`\`jpg, png, pdf, webp, and gif\`\`" +
                         " direct links")
                     message.delete()
                 }
             } else {
                 message.channel.send(`Please put ${prefix}log \`\`<minutes>\`\` \`\`\<discord link of proof>\`\``);
             }
         } else {
             message.channel.send("You can't log during the off-season :(")
         }
     }
     else{
             message.reply("there is a min of \`\`1 minute\`\` and a max of \`\`1440 minutes\`\` for every entry.\n" +
                 "please try to keep what you log **recent**!")
         }
    },
};