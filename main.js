require('dotenv').config()

const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const Discord = require('discord.js')

const fs = require('fs')

const bannedWords = require('./moderation/bannedWords')
const setPermissions = require('./setPermissions')

const Database = require('./config/Database');
const adminCommands = require('./textCommands/commandHandler')
const eventHandler = require('./buttons/eventHandler')
const moderationEvents = require('./moderation/moderationEvents')
const db = new Database();
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

client.slashCommands = new Discord.Collection()

const slash = []
let slashFiles = fs.readdirSync('./slashCommands/').filter(file => file.endsWith('.js'));

for(const file of slashFiles) {
    const filePath = `./slashCommands/${file}`;

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

client.on('messageCreate', async (message) => {
    if(message.author.bot) return;
    if(message.channel.type == 'DM') return;

    bannedWords(message, client)

    if(message.content.startsWith(prefix)) {
        adminCommands(message)
    }
});

client.on('interactionCreate', (interaction) => {
    if(interaction.isCommand()) {
        const {commandName} = interaction

        const command = client.slashCommands.get(commandName)

        if(!command) return;
        try {
            command.execute(interaction, client)
        } catch (e)
        {
            return console.log(e)
        }
    } else if (interaction.isButton()) {
        eventHandler(interaction)
        moderationEvents(interaction)
    }
})

client.login(process.env.TOKEN);

const GetClient = () => {
    return client
}

module.exports = GetClient