const mysql = require('mysql');
const { Client, Guild } = require('discord.js');
/**
 * @description Emitted bot is kicked from server
 * @author John W. Bowen
 * @param { Client } client 
 * @param { Guild } guild 
 */
module.exports = (client, guild) => {
    const con = mysql.createConnection(JSON.parse(process.env.MYSQLSERVER));
    try{
        con.query(`DELETE FROM message WHERE guild_id = '${guild.id}'`, (err) => {
            if(err) throw err;
            con.query(`DELETE FROM report WHERE guild_id = '${guild.id}'`, (err) => {
                if(err) throw err;
                con.query(`DELETE FROM user WHERE guild_id = '${guild.id}'`, (err) => {
                    if(err) throw err;
                    con.query(`DELETE FROM guild WHERE guild_id = '${guild.id}'`, (err) => {
                        if(err) throw err;
                        console.log(`removed from guild ${guild.name}`);
                    });
                })
            });
        });
        
    }catch(err){
        console.log(err);
    }
};