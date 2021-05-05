const {Guild, GuildMember, TextChannel, Message} = require('discord.js');
const mysql = require('mysql');
const con = mysql.createConnection(JSON.parse(process.env.MYSQLSERVER));

/**
 * 
 * @param {Guild} guild
 * @returns {String} 
 */
function getPrefix(guild){
    con.query(`SELECT prefix FROM guild WHERE guild_id = '${guild.id}'`,(err,result)=>{
        if(err) throw err;
        return result.prefix;
    });
}
/**
 * 
 * @param {Guild} guild 
 * @param {String} prefix 
 */
function setPrefix(guild, prefix){
    con.query(`UPDATE guild SET prefix = '${prefix}' WHERE guild_id = '${guild.id}'`,(err)=>{if (err) throw err;});
}
/**
 * 
 * @param {Guild} guild
 * @returns {Boolean}
 */
function isEnabled(guild){
    con.query(`SELECT enabled FROM guild WHERE guild_id = '${guild.id}'`,(err,result)=>{
        if(err) throw err;
        if(result[0].enabled == 1)
            return true;
        else
            return false;
    });
}
/**
 * 
 * @param {Guild} guild 
 * @param {Boolean} isEnabled 
 */
function setEnabled(guild, isEnabled){
    con.query(`UPDATE guild SET enabled = ${isEnabled} WHERE guild_id = '${guild.id}'`,(err) => {if(err) throw err});
}
/**
 * 
 * @param {Guild} guild
 * @returns {TextChannel}
 */
function getReportChannel(guild){
    con.query(`SELECT report_channel_id FROM guild WHERE guild_id = '${guild.id}'`,(err, result)=>{
        if(err) throw err;
        if(!result) return;
        return guild.channels.resolve(result.report_channel_id);
    });
}
/**
 * 
 * @param {Guild} guild
 */
function setReportChannel(guild, channel){
    con.query(`UPDATE guild SET report_channel_id = '${channel.id}' WHERE guild_id = '${guild.id}'`,(err)=>{if (err) throw err;});
}
/**
 * 
 * @param {Guild} guild 
 * @returns {TextChannel}
 */
function getProgressChannel(guild){
    con.query(`SELECT progress_channel_id FROM guild WHERE guild_id = '${guild.id}'`,(err, result)=>{
        if(err) throw err;
        if(!result) return;
        return guild.channels.resolve(result.progress_channel_id);
    });
}
/**
 * 
 * @param {Guild} guild 
 * @param {TextChannel} channel 
 */
function setProgressChannel(guild, channel){
    con.query(`UPDATE guild SET progress_channel_id = '${channel.id}' WHERE guild_id = '${guild.id}'`,(err)=>{if (err) throw err;});
}
/**
 * 
 * @param {Guild} guild
 * @returns {Message}
 */
function getLatestReport(guild){
    con.query(`SELECT message_id FROM report ORDER BY created_at DESC WHERE guild_id = '${guild.id}'`,(err, result)=>{
        if(err) throw err;
        if(!result) return;
        return getReportChannel(guild).messages.resolve(result.message_id);
    });
}
/**
 * 
 * @param {GuildMember} guildMember
 * @returns {Message} 
 */
function getLatestProgressMessage(guildMember){
    con.query(`SELECT message_id FROM message ORDER BY created_at DESC WHERE guild_id = '${guildMember.guild.id}'`,(err,result)=>{
        if(err) throw err;
        if(!result) return;
        return getProgressChannel(guildMember.guild).messages.resolve(result.message_id);
    });
}
/**
 * 
 * @param {Guild} guild
 * @returns 
 */
function getUsers(guild){
    con.query(`SELECT discord_id, on_vacation, has_posted FROM user WHERE guild_id = '${guild.id}'`,(err,result)=>{
        if(err) throw err;
        if(!result) return;
        return result
    });
}
module.exports = {
    con, 
    getPrefix,
    setPrefix,
    isEnabled,
    setEnabled,
    getReportChannel,
    setReportChannel,
    getProgressChannel,
    setProgressChannel,
    getLatestReport,
    getLatestProgressMessage,
    getUsers
}