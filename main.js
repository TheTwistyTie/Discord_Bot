const { Console } = require('console');
const Discord = require('discord.js');

const client = new Discord.Client(
    { intents: [
        "GUILDS", 
        "GUILD_MEMBERS", 
        "GUILD_BANS", 
        "GUILD_PRESENCES", 
        "GUILD_MESSAGES", 
        "GUILD_MESSAGE_REACTIONS", 
        "DIRECT_MESSAGES",
        {partials: ["MESSAGE", "CHANNEL", "REACTION"]}  
    ] 
});

const prefix = "!";

const fs = require('fs');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles)
{
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log("Bot is Online");
});

client.on('message', message =>{
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    if(command === 'ping'){
        client.commands.get('ping').execute(message, args, Discord);
    } else if(command === 'embed'){
        client.commands.get('embed').execute(message, args, Discord);
    } else if(command === 'clear'){
        client.commands.get('clear').execute(message, args, Discord);
    } else if(command === 'kick'){
        client.commands.get('kick').execute(message, args, Discord);
    } else if(command === 'ban'){
        client.commands.get('ban').execute(message, args, Discord);
    } else if(command === 'mute'){
        client.commands.get('mute').execute(message, args, Discord);
    }
})


client.login('OTE4MzU3MTEwOTMxMjE0NDA2.YbGEtQ.vRKGm9u-KO4FybsGqSqECO5Y-q4');