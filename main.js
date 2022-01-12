require('dotenv').config()
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const Discord = require('discord.js')
const fs = require('fs')
const Database = require('./config/Database');
const db = new Database();
const setPermissions = require('./commands/setCommandPermissions')

db.connect();

const client = new Discord.Client({
    intents: [
        "GUILDS", 
        "GUILD_MEMBERS", 
        "GUILD_BANS", 
        "GUILD_PRESENCES",
        "GUILD_MESSAGES", 
        "GUILD_MESSAGE_REACTIONS", 
        "DIRECT_MESSAGES",
    ] , partials: ["MESSAGE", "CHANNEL", "REACTION"]
});

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

const guild = client.guilds.cache.get(guildId);

client.commands = new Discord.Collection()
client.slashCommands = new Discord.Collection()

const commandFiles = fs.readdirSync('./commands/base_commands').filter(file => file.endsWith('.js'));

for(const command of commandFiles) {
    const commandFile = require(`./commands/base_commands/${command}`)
    if(commandFile) {
        client.commands.set(commandFile.name, commandFile)
    }
}

const slash = []
let slashFiles = fs.readdirSync('./commands/slash_commands').filter(file => file.endsWith('.js'));

for(const file of slashFiles) {
    const filePath = `./commands/slash_commands/${file}`;

    const command = require(filePath);

    slash.push(command.data.toJSON());
    client.slashCommands.set(command.data.name, command);
}

const rest = new REST({version: '9'}).setToken(process.env.TOKEN);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: slash },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

client.once('ready', () => {
    console.log("Bot is Online");

    setPermissions(client);
});

const prefix = '!'

client.on('messageCreate', (message) => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    if(!client.commands.get(commandName)) {
        return message.reply('Unknown Command.')
                .then(() => {
                    setTimeout(() => {
                        client.commands.get('clear').execute(message, ['2'], Discord)
                    }, 1500);
                });
    }

    client.commands.get(commandName).execute(message, args, Discord, client);
});

client.on('interactionCreate', (interaction) => {
    if(!interaction.isCommand()) return;

    const {commandName} = interaction

    const command = client.slashCommands.get(commandName)

    if(!command) return;
    try {
        command.execute(interaction, client)
    } catch (e)
    {
        return console.log(e)
    }
})

client.login(process.env.TOKEN);