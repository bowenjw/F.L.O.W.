const mysql = require('mysql');
const { Client, Channel, Guild, Role, TextChannel } = require('discord.js');
const con = mysql.createConnection(JSON.parse(process.env.MYSQLSERVER));
/**
 * @description Emitted bot is added to server
 * @author John W. Bowen
 * @param { Client } _client 
 * @param { Guild } guild 
 */
module.exports = (_client, guild) => {
    con.query(`INSERT INTO guild (guild_id) VALUES ('${guild.id}');`, function(err){
        if(err) throw err;
        console.log(`joined and logged guild ${guild.name}`);
    });
}