const { Message, Role } = require('discord.js');
const { con, isEnabled, setEnabled, getReportChannel, setReportChannel, setProgressChannel } = require('../system/query');
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
        if(isEnabled(guild)) message.reply('F.L.O.W. is already enabled');
        else if(getReportChannel(guild)){
            setEnabled(guild,true)
            message.reply('F.L.O.W. is online');
        } else{
            /**
             * @type {Role}
             */
            let teamMember
            guild.roles.create({
                data:{
                    name:'Team member',
                    color:'BLUE'
                },
                reason: 'bot genreated channel'
            })
            .then((role)=>{teamMember = role;})
            .then(()=>{
                guild.channels.create('Project',{
                    type: 'category',
                    permissionOverwrites: [
                         {
                            id: guild.roles.everyone,
                            deny: ['VIEW_CHANNEL']
                        },
                        {
                            id: teamMember,
                            deny: ['ADD_REACTIONS']
                        },
                        {
                            id: teamMember,
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
                    .then((channel) =>{setReportChannel(channel)});
                    guild.channels.create('progress',{
                        type: 'text',
                        parent: category,
                    })
                    .then((channel) => {setProgressChannel(channel)});
                });
            })
            .catch((e)=> console.log(e));
            setEnabled(guild,true);
            message.reply(`F.L.O.W. is online`);
        } 
    },
}