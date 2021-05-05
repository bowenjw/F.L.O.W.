const { Message } = require('discord.js');
const { drawReport } = require('../system/report');
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
  execute(message) { drawReport(message.guild,true); }
}