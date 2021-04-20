const fetch = require('node-fetch');
const {entry_url, season_update_url, season_user_url,server_url} = require('../../endpoints.json');
const {prefix} = require('../../config.json')
module.exports = {
    name: 'log',
    type: 'user',
    aliases: ['entry','l'],
    description: 'Logs hours into Loggit.',
    guildOnly:true,
    usage: '<hours> <discord link proof>',
    args: true,
    cooldown: 10,
     async execute(message, args) {
         //console.log(entry_url +" " + season_update_url);
         let server_req = await fetch(server_url+message.guild.id,{method: "GET"})
         let {off_season} = await server_req.json();
         if (!off_season) {

         if (args.length === 2) {

             let check_url= () => {
                 try {
                     new URL(args[1]);
                 } catch (e) {
                     //console.error(e);
                     return false;
                 }
                 return true;
             };
             let acceptable_ext = [".jpg",".gif",".png",".pdf",".webp"];
             let ext_check = false;
             for(const ext of acceptable_ext)
             {
                 if(args[1].endsWith(ext))
                     ext_check = true;
             }

             if(check_url()&&ext_check){

             let entry = {
                 serveruser_id: (message.guild.id + "|" + message.author.toString()),
                 server_avatar: message.guild.iconURL(),
                 server_id: message.guild.id,
                 user_avatar: message.author.avatarURL(),
                 user_id: message.author.toString(),
                 hours: args[0], //hours
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
                         } else {
                             message.channel.send("Something went wrong")
                         }

                     })
             } else {
                 let {server_user_season} = await check.json();
                 fetch(entry_url,
                     {
                         method: "POST",
                         headers: {
                             "Content-Type": "application/json"
                         },
                         body: JSON.stringify(entry)
                     })
                     .then((result) => {
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
                         message.channel.send("Successfully logged!")
                     })
             }
         }else{
                 message.reply("you did not provide a proper image url!\n**I take:** \`\`jpg, png, pdf, webp, and gif\`\`" +
                     " direct links")
                 message.delete()
             }
         } else {
             message.channel.send(`Please put ${prefix}log \`\`<hours>\`\` \`\`\<discord link of proof>\`\``);
         }
     }else{message.channel.send("You can't log during the off-season :(")}

    },
};