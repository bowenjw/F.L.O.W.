/**
 * @description Main for a Discord bot using Discord.js
 * @author John W. Bowen
 */
const { Client, Collection, Intents } = require('discord.js');

// The main hub for interacting with the Discord API, and the starting point for any bot.
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// This is used throughout discord.js rather than Arrays for anything that has an ID, for significantly improved performance and ease-of-use.

// A Map with the prefix commands.
client.commands = new Collection();

// A Map with the event methods.
client.events = new Collection();

// For each Handler runs passing client
['commands_handler', 'events_handler'].forEach(handler => { require(`./handlers/${handler}`)(client); });

// Logs the client in, establishing a websocket connection to Discord.
client.login();
module.exports = client;