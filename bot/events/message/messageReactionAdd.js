const {Client, MessageReaction, User } = require('discord.js');
const { getGuildInfo, rejectPost }  =  require('../../commands/system/mysqldb');
/**
 * 
 * @param { Client } client 
 * @param { MessageReaction } messageReaction 
 * @param { User } user 
 */
module.exports = (client, messageReaction, user) => {
    const message = messageReaction.message;
    const guild = message.guild;
    if(user.id != client.user.id)
        getGuildInfo(guild,(guildInfo)=>{
            const progressChannel = guild.channels.resolve(guildInfo.progress_channel_id);
            if(message.channel != progressChannel) return;
            const member = guild.members.resolve(user.id)
            if(member.hasPermission('ADMINISTRATOR') || member.hasPermission('MANAGE_GUILD'))
                rejectPost(message);
        });
}