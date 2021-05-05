const { Message, MessageEmbed } = require('discord.js');
module.exports = {
	name: 'vacation',
	description: 'For aproving and ending vacation',
	args: true,
    /**
     * 
     * @param { Message } message
     * @param { String[]} args
     */
	execute(message, args) {
        message.reply('vaction System is WIP')
        /**const opt = args[0];
        const target = args[1];
        const guild = message.guild;
        if(!isEnabled(guild)){
            
        }
        con.query(`SELECT vaction_enable FROM guild WHERE guild_id =''${guild.id}`, (err,result) => {
            if(err) throw err;
            const vactionEnable = result[0].vaction_enable;
            if(!vactionEnable){
                message.reply('Vaction is not enabled.\n To enable run `');
            }

        });
        if(!opt){
            con.query(`SELECT discord_id, on_vacation FROM user WHERE guild_id='${guild.id}'`, (err, result) => {
                if(err) throw err;
                let vaction = '';
                let notVaction = ';';
                result.forEach(user => {
                    if(user.on_action){
                        vaction += `\n${guild.members.resolve(user.Discord_id).displayName}`;
                    } else {
                        notVaction +=`\n${guild.members.resolve(user.Discord_id).displayName}`;
                    }
                });
                const embed = new MessageEmbed()
                .setAuthor('F.L.O.W.')
                //.setColor() set later
                .setTimestamp()
                .setTitle('Vaction Report')
                .addFields(
                    {name: 'On Vaction', value: vaction},
                    {name: 'Not on Vaction', value: notVaction},
                );
                message.reply('',embed);
            });
        }else if(!target || !target.startsWith('<@')){
            const add = '`vacation add @user`';
            const remove = '`vacation remove @user`';
            const embed = new MessageEmbed()
                .setAuthor('F.L.O.W.')
                //.setColor() set later
                .setTimestamp()
                .setTitle('Invalde Agrument or operator')
                .setDescription('use one of the given operator')
                .addFields(
                    {name: 'add', value: vaction},
                    {name: 'remove', value: notVaction},
                );
                message.reply('',embed);
        } else {
            const member = message.guild.members.resolve(target);
            con.query(`
                SELECT gc.vacation_channel_id, gr.vaction_channel_id, u.on_vaction 
                FROM guild_channels AS gc, guild_role AS gr, user AS u
                WHERE gc.guild_id = '${guild.id}
                AND gr.guild_id = gc.guild_id 
                AND u.discord_id='${member.id}'`, (err, result) =>{
                if(err) throw err;
                const vactionChannel = guild.channels.resolve(result[0].vacation_channel_id);
                const vactionrole = guild.roles.resolve(result[0].vaction_role_id);
                const onVaction = result.on_vaction;
                if(onVaction){
                    vactionChannel.send(`${member} is no longer on vacation`);
                    member.roles.remove(vactionrole);
                    console.log(`${member.displayName} is no longer on vacation`);
                    con.query(`
                        UPDATE users 
                        SET Vacation = false 
                        WHERE discord_id= '${member.id}' 
                        AND guild_id = '${guild.id}'`,
                        (err) => {if (err) throw err;});
                } else {
                    vactionChannel.send(`${member} is on vacation`);
                    member.roles.add(vactionrole);
                    console.log(`${member.displayName} is on vacation`);
                    con.query(`
                        UPDATE users 
                        SET Vacation = true 
                        WHERE discord_id = '${member.id}' 
                        AND guild_id = '${guild.id}'`,
                        (err) => {if (err) throw err;});
                }
                
            });
        }      */    
    },
};