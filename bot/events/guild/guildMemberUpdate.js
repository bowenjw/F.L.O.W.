const mysql = require('mysql');
const con = mysql.createConnection(JSON.parse(process.env.MYSQLSERVER));
const { Client, GuildMember  } = require('discord.js');
const { drawReport } = require('../../commands/system/mysqldb');
/**
 * 
 * @param { Client } _client 
 * @param { GuildMember } oldMember 
 * @param { GuildMember } newMember 
 */
module.exports = (_client, oldMember, newMember) => {
    con.query(`SELECT team_role_id FROM guild WHERE guild_id = '${newMember.guild.id}'`,(err,result) =>{
        if(err) throw err;
        if(!result[0]) return;
        const roleID = result[0].team_role_id;
        const oldRoleLookUp = oldMember.roles.cache.find(role => role.id = roleID);
        const newRoleLookUp = newMember.roles.cache.find(role => role.id = roleID);
        if(oldRoleLookUp == newRoleLookUp) return;
        else if(oldRoleLookUp.id == roleID){
            con.query(`DELETE FROM user WHERE discord_id = '${newMember.id}' AND guild_id = '${newMember.guild.id}'`,(err) => { if(err) throw err; });
        }
        else if(newRoleLookUp.id == roleID){
            con.query(`INSERT INTO user (discord_id, guild_id) VALUES ('${newMember.id}', '${newMember.guild.id}') ON DUPLICATE KEY Discord_id=Discord_id`,(err) =>{ if(err) throw err; });
        }
        drawReport(newMember.guild);
    });
}
