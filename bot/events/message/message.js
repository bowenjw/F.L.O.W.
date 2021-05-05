const { Client, Message } = require('discord.js');
const { enablecheck, getGuildInfo, newProgressUpdate, newReport } =  require('../../commands/system/report');
/**
 * @description Emitted whenever a message is created
 * @author John W. Bowen
 * @param { Client } client 
 * @param { Message } message 
 */
module.exports = (client, message) => {
	const guild = message.guild;
	if(guild){
		const  member = guild.members.resolve(message.author.id);
		getGuildInfo(guild, (guildInfo)=>{
			const prefix = guildInfo.prefix;
			const reportChannel = guild.channels.resolve(guildInfo.report_channel_id);
			const progressChannel = guild.channels.resolve(guildInfo.progress_channel_id);
			if( !message.author.bot && message.content.startsWith(prefix) && (member.hasPermission('ADMINISTRATOR') || member.hasPermission('MANAGE_GUILD'))) {
				const args = message.content.slice(prefix.length).trim().split(/ +/);// removes prfix chariter
				const command = args.shift().toLowerCase();//shfits mesage to lowercase
				if (!client.commands.has(command)) return;//checks command exsits
				//command exicution is atempted
				try {
					client.commands.get(command).execute(message, args, client);
				}
				catch (err) {
					console.log(err);
					message.reply('there was an error trying to execute that command!');
				}
			} else if(!message.author.bot && message.channel == progressChannel && enablecheck(guild)){
				newProgressUpdate(message);
			} else if(message.author.bot && message.channel == reportChannel && enablecheck(guild)){
				newReport(message);
			} 
		});
		
	}
};