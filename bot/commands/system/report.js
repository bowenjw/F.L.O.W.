const {Message, Guild} = require('discord.js');
const {con, getLatestReport, getUsers, getLatestProgressMessage} = require('./query');
const {isVacationEnabled, getVacationChannel} = require('./vacation')
/**
 * @description Method will render and post/edit a report
 * @param { Guild } guild Discord guild object
 * @param { Boolean } isNew flage determing if the message is new or editing an old one
 */
function drawReport(guild, isNew = false) {
    if (!guild.id) return;
    const reportChannel = getReportChannel(guild);
    if(isNew) {
        const date = new Date();
        con.query(`UPDATE user SET has_posted = false WHERE guild_id = '${guild.id}'`,(err)=>{
            if(err)throw err;
            reportChannel.send(writeReport(date,guild));
        });
    } else {
        const report = getLatestReport(guild)
        report.edit(writeReport(report.createdAt,guild))
    }
}
/**
 * 
 * @param { Date } date Date of message
 * @param { Guild } guild Guild were the message is for
 * @returns { String }String message
 */
function writeReport(date,guild){
    let report = `Weekly Check for the week of the ${date.getMonth()+1}/${date.getDate()}`;
    getUsers(guild).forEach(user => {
        const member=guild.members.resolve(user.guild_id);
        let row = ` ${member} `;
        for (let rowLength = 2+ member.displayName.length; rowLength < 30; rowLength++) {
            row += ' ';
            rowLength++;
            if(user.has_posted){
                const postDate = getLatestProgressMessage(member).createdAt;
                report += row + ` Progress ${postDate.getMonth()+1}/${postDate.getDate()}\n`;
            } else if(user.on_vacation && isVacationEnabled(guild)){
                report += row+` ${getVacationChannel(guild)}\n`;
            } else {
                report += row+' No report Submited\n';
            }
        }
    });
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
module.exports = {
    drawReport,
    newProgressUpdate,
    newReport,
    rejectPost
}