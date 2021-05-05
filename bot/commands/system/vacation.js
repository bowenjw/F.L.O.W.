const { Message, Guild, TextChannel, GuildMember, MessageEmbed} = require('discord.js');
const { con } = require('./query');
/**
 * 
 * @param {Guild} guild
 * @returns {boolean} 
 */
function isVacationEnabled(guild){
    con.query(`SELECT vacation_enabled FROM guild WHERE guild_id = '${guild.id}'`,(err,result)=>{
        if(err) throw err;
        if(result[0].vacation_enabled == 1)
            return true;
        else
            return false;
    });
}
/**
 * 
 * @param {GuildMember} guildMember 
 * @param {boolean} enable 
 */
function setVacation(guildMember, enable){
    con.query(`UPDATE user SET on_vacation = ${enable} WHERE guild_id ='${guildMember.guild.id}' AND Discord_id = '${guildMember.id}'`,(err)=>{if(err) throw err;})
}
/**
 * 
 * @param {Guild} guild
 * @returns {TextChannel}
 */
function getVacationChannel(guild){
    con.query(`SELECT vacation_channel_id FROM guild WHERE guild_is = '${guild.id}'`,(err,result)=>{
        if(err)throw err;
        if(!result) return;
        return guild.channels.resolve(result.vacation_channel_id);
    })
}
/**
 * 
 * @param { Guild } Guild 
 * @returns {MessageEmbed}
 */
function status(Guild){
    getGuildInfo(Guild, (guildInfo)=>{
        let status = ''
        if(guildInfo.vacation_enabled) status = 'Enabled';
        else status = 'Disabled'
        return new MessageEmbed()
            .setAuthor('F.L.O.W.')
            .setColor(guildInfo.color)
            .setTimestamp()
            .setTitle('Vacation Subsystem')
            .setDescription('This system provids a way of taking those how are out of the office.\n To enable the Vaction run `vacation enable`\n A channel and role will')
            .addFields(
            {name: 'Status', value: `${status}`},
        );
    });
    
}

module.exports = {
    setVacation,
    status,
    isVacationEnabled,
    getVacationChannel
}