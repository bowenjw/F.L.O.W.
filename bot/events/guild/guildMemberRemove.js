const mysql = require('mysql');
const con = mysql.createConnection(JSON.parse(process.env.MYSQLSERVER));
const { Client, GuildMember  } = require('discord.js');
const { drawReport } = require('../../commands/system/mysqldb');
/**
 * 
 * @param { Client } _client 
 * @param { GuildMember } member
 */
module.exports = (_client, member) => {
    if(!member) return;
    try{
        const guild = member.guild;
        con.query(`DELETE FROM message WHERE discord_id = '${member.id}' AND guild_id = '${guild.id}'`,(err) => {if(err) throw err;});
        con.query(`DELETE FROM user WHERE discord_id = '${member.id}' AND guild_id = '${guild.id}'`,(err) => { 
            if(err) throw err;
            drawReport(guild); 
        });
    }catch(err){console.log(err);}
    
}