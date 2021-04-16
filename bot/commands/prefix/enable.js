const mysql = require('mysql');
const { Message } = require('discord.js');
const con = mysql.createConnection(JSON.parse(process.env.MYSQLSERVER));
module.exports = {
	name: 'enable',
	description: 'controles the status of the bot in the server',
	args: false,
    /**
     * 
     * @param { Message } message
     */
	execute(message) {
        const guild = message.guild;
        con.query(`SELECT * FROM guild WHERE guild_id = '${guild.id}'`,(err,result)=>{
            if(result[0].report_channel_id){
                con.query(`UPDATE guild SET 
                            enabled = 1
                            WHERE guild_id = '${guild.id}'`,(err) => {if(err) throw err});
                message.reply(`bot enabled`);
            }
            else{
                let teamMemberID  = ``;
                let reportChannelID = ``;
                let progressChannelID = ``;
                guild.roles.create({
                    data:{
                        name:'Team member',
                        color:'BLUE'
                    },
                    reason: 'bot genreated channel'
                })
                .then((role)=>{teamMemberID = role.id;})
                .then(()=>{
                    guild.channels.create('Project',{
                        type: 'category',
                        permissionOverwrites: [
                             {
                                id: guild.roles.everyone,
                                deny: ['VIEW_CHANNEL']
                            },
                            {
                                id: teamMemberID,
                                allow: ['VIEW_CHANNEL']
                            }
                        ]
                    })
                    .then((category)=>{
                        guild.channels.create('reports',{
                            type: 'text',
                            parent: category,
                            permissionOverwrites: [
                                {
                                    id: teamMemberID,
                                    deny: ['SEND_MESSAGES']
                                }
                            ]
                        })
                        .then((channel) =>{reportChannelID = channel.id;});
                        guild.channels.create('progress',{
                            type: 'text',
                            parent: category,
                        })
                        .then((channel) => {progressChannelID = channel.id;});
                    });
                })
                .then(() => setTimeout(() => {
                
                    con.query(`UPDATE guild SET team_role_id = '${teamMemberID}',
                                report_channel_id = '${reportChannelID}',
                                progress_channel_id = '${progressChannelID}',
                                enabled = 1
                                WHERE guild_id = '${guild.id}'`,(err) => {if(err) throw err});
                },3000))
                .catch((e)=> console.log(e));
                message.reply(`F.L.O.W. is online`);
            }
        }); 
    },
}