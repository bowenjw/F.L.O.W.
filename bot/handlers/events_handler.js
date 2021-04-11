const { Client } = require('discord.js');
const fs = require('fs');
/**
 * @name events_handler
 * @description Method loads client, guild, and message event dirs and runs the respective envent when one happens
 * @author John W. Bowen
 * @param { Client } client 
 */
module.exports = (client) => {
	/**
	 * @name load_dir
	 * @description Method load dir and looks for js files then checks if the name macthes an event
	 * @author John W. Bowen
	 * @param { string } dirs
	 */
	const load_dir = (dirs) =>{
		const event_files = fs.readdirSync(`./bot/events/${dirs}`).filter(file => file.endsWith('.js'));
		for(const file of event_files) {
			const event = require(`../events/${dirs}/${file}`);
			const event_name = file.split('.')[0];
			try{client.on(event_name, event.bind(null, client));}catch(e){console.log(e)}
		}
	};
	// guild is comented out as no command is in the dir. this prevents an error
	['client', 'guild', 'message'].forEach(dirs => load_dir(dirs));
};