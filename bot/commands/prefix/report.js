const mysql = require('mysql');
const con = mysql.createConnection(JSON.parse(process.env.MYSQLSERVER));
const { Message } = require('discord.js');
const drawReport = require('../../commands/system/drawReport');
module.exports = {
	name: 'report',
	description: 'sends new message in report chat',
	args: false,
  /**
   * @name report
   * @description Creates new report
   * @author John W Bowen
   * @param { Message } message 
   */
  execute(message) {
    const con = mysql.createConnection(mysqlserver);
	const guild = message.guild;
    //Time
	const currentDate = new Date();
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 6);
    //message
    let report = `Weekly Check for the week of the ${currentDate.getMonth()+1}/${currentDate.getDate()} - ${nextDate.getMonth()+1}/${nextDate.getDate()}\n[${message.guild.roles.resolve(teamMember)}]                         [Date of Recent Post]\n`;
    con.query(`SELECT * FROM guild WHERE guild_id = '${guild.id}'`,(err, result) =>{
        const reportChannel = guild.channels.resolve(result[0].report_channel_id);
        drawReport(message,false);
    });
  }
}