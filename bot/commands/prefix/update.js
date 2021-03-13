const mysql = require('mysql');
const { Message } = require('discord.js');
const con = mysql.createConnection(JSON.parse(process.env.MYSQLSERVER));
module.exports = {
	name: 'update',
	description: 'To update guild preferences',
	/**
     * 
     * @param { Message } message
     * @param { string[] } args
     */
	execute(message,args) {
        const guildID = message.guild.id;
        const arg = args[1];
        
		if(args[0] == 'prefix'){
            if(!arg && !( arg.startsWith('<') || arg.startsWith('#') || arg.startsWith('@'))){
                message.reply('no valide prefix provide');
            } else {
                con.query(`UPDATE guild SET prefix = '${arg}' WHERE guild_id = '${guildID}'`,function(err, result, fields){
                    if (err) throw err;
                    message.reply(` The prefix has been updates to **${arg}**`);
                });
            }
        } else if (args[0] == 'report'){
            if(arg.startsWith('<#')){
                con.query(`UPDATE guild SET report_channel_id = '${arg}' WHERE guild_id = '${guildID}'`,function(err, result, fields){
                    if (err) throw err;
                    message.reply(` The report channel has been updates to **${arg}**`);
                });
            }else{
                message.reply('please provid a valid channel')
            }
        } else if (args[0] == 'progress'){
            if(arg.startsWith('<#')){
                con.query(`UPDATE guild SET progress_channel_id = '${arg}' WHERE guild_id = '${guildID}'`,function(err, result, fields){
                    if (err) throw err;
                    message.reply(` The progress channel has been updates to **${arg}**`);
                });
            }else{
                message.reply('please provid a valid channel')
            }
        } else if (args[0] == 'role'){
            if(arg.startsWith('<@&')){
                con.query(`UPDATE guild SET team_role_id = '${arg}' WHERE guild_id = '${guildID}'`,function(err, result, fields){
                    if (err) throw err;
                    message.reply(` The team role has been updates to **${arg}**`);
                    require('../system/manageRole')(arg,message.guild);
                });
            }else{
                message.reply('please provid a valid role')
            }
        }
	},
};
