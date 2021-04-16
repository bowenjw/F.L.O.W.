const mysql = require('mysql');
const { Message } = require('discord.js');
const con = mysql.createConnection(JSON.parse(process.env.MYSQLSERVER));
module.exports = {
	name: 'disable',
	description: 'controles the status of the bot in the server',
	args: false,
    /**
     * 
     * @param { Message } message
     */
	execute(message) {
        con.query(`UPDATE guild SET 
            enabled = 0
            WHERE guild_id = '${message.guild.id}'`,(err) => {if(err) throw err});
        message.reply(`F.L.O.W. is disabled`);
    },
}