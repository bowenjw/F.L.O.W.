const { Message, Guild, TextChannel, GuildMember} = require('discord.js');
const mysql = require('mysql');
const con = mysql.createConnection(JSON.parse(process.env.MYSQLSERVER));

/**
 * @param {Guild} guild
 */
function enablecheck(guild) {
        con.query(`SELECT enabled FROM guild WHERE guild_id = '${guild.id}'`,(err,result)=>{
        if(err) throw err;
        if(result[0].enabled == 1)
            return true;
        else
            return false;
    });
}
/**
 * @description Method will render and post/edit a report
 * @param { Guild } guild Discord guild object
 * @param { Boolean } isNew flage determing if the message is new or editing an old one
 */
function drawReport(guild, isNew = false) {
    if (!guild.id) return;
    getGuildInfo(guild,(guildInfo,users)=>{
        /**
         * @constant
         */
        const reportChannel = guild.channels.resolve(guildInfo.report_channel_id);
        if(isNew) {
            const date = new Date();
            con.query(`UPDATE user SET has_posted = false WHERE guild_id = '${guild.id}'`,(err)=>{
                if(err)throw err;
                const report = writeReport(users,date,guild,guildInfo)
                reportChannel.send(report);
            });
        } else {
            getReport(reportChannel, (reportMessage)=>{
                const report = writeReport(users,reportMessage.createdAt,guild,guildInfo)
                reportMessage.edit(report);
            });
        }
    });
    
}
/**
 * 
 * @param { TextChannel } reportChannel
 * @param { (reportMessage: Message) } callback
 */
function getReport(reportChannel, callback) {
    con.query(`SELECT message_id FROM report ORDER BY created_at DESC WHERE guild_id = '${reportChannel.guild.id}'`,(err, result)=>{
        if(err) throw err;
        if(!result) return;
        const reportMessage = reportChannel.messages.resolve(result.message_id);
        return callback(reportMessage);
    });
}
/**
 * 
 * @param { Guild } guild 
 * @param { (guildInfo:String[], users:String[]) } callback 
 */
function getGuildInfo(guild, callback){
    if(!guild) return;
    con.query(`SELECT * FROM guild WHERE guild_id = '${guild.id}'`,(err, result)=>{
        if(err) throw err;
        if(!result) return;
        con.query(`SELECT discord_id, on_vacation, has_posted FROM user WHERE guild_id = '${guild.id}'`,(err,result1)=>{
            console.log(result);
            if(err) throw err;
            if(!result) return;
            return callback(result[0],result1);
        });
    });
}
/**
 * 
 * @param { GuildMember } guildMember 
 * @param { Date } reportDate
 * @param { (postDate:Date)} callback 
 */
function getPostDate(guildMember,reportDate, callback){
    con.query(`SELECT m.created_at FROM user AS u JOIN message AS m ON u.discord_id = m.discord_id WHERE m.created_at > ${reportDate.toISOString().slice(0, 10)} AND u.discord_id = ${guildMember.id} AND u.guild = '${guildMember.guild.id}' ORDER BY m.created_at DESC`,(err,result)=>{
        if(err) throw err;
        if(!result) return;
        return callback(new Date(result[0].created_at));
    });
}
/**
 * 
 * @param { Array[] } users array of users with proprties 
 * @param { Date } date Date of message
 * @param { Guild } guild
 * @param { Array[] } guildInfo array of guild properties
 * @returns String message
 */
function writeReport(users, date, guild, guildInfo){
    let report = `Weekly Check for the week of the ${date.getMonth()+1}/${date.getDate()}`;
    for(const user of users){
        const member=guild.members.resolve(user.guild_id)
        let row = ` ${member} `;
        let rowLength = 2+ member.displayName.length;
        while(rowLength < 30){
            row += ' ';
            rowLength++;
        }
        if(user.has_posted){
            getPostDate(member,(postDate)=>{
                report += row + ` Progress ${postDate.getMonth()+1}/${postDate.getDate()}\n`;
            });
        } else if(user.on_vacation && guildInfo.vacation_enabled){
            report += row+` ${guild.channels.resolve(guildInfo.vacation_channel_id)}\n`;
        } else {
            report += row+' No report Submited\n';
        }
    }
    return report;
}
/**
 * 
 * @param { Message } message 
 */
function newProgressUpdate(message){
    const subquery =`SELECT message_id FROM report ORDER BY Created_at DESC WHERE guild_id = ${message.guild.id} LIMIT 1`;
    con.query(`INSERT INTO message SET message_id='${message.id}', discord_id='${message.author.id}', report_id=(${subquery}), guild_id='${message.id}'`)
    con.query(`UPDATE user SET on_vacation = false, has_posted = true WHERE guild_id = '${message.guild.id}' AND discord_id = '${message.author.id}'`,(err)=>{if(err) throw err;})
    message.react('❌');
}
/**
 * 
 * @param { Message } message 
 */
function newReport(message) {
    con.query(`INSERT INTO report (Message_id, guild_id) VALUES ('${message.id}','${message.guild.id}')`,(err)=>{if(err) throw err;})
}
/**
 * 
 * @param { Message } message 
 */
function rejectPost(message) {
    const member = message.guild.members.resolve(message.author.id);
    con.query(`DELETE FROM message WHERE message_id = '${message.id}'`);
    con.query(`UPDATE user SET has_posted = false WHERE guild_id = '${member.guild.id}' AND discord_id = '${member.id}'`,(err)=>{
        if(err) throw err;
        drawReport(member.guild);
    });
}
module.exports = { getGuildInfo, enablecheck, drawReport, newProgressUpdate, newReport, rejectPost};