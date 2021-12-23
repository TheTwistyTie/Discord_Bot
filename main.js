const { Console } = require('console');
const Discord = require('discord.js');
//const ReactionRole = require('discordjs-reation-role').default;

const client = new Discord.Client(
    { intents: [
        "GUILDS", 
        "GUILD_MEMBERS", 
        "GUILD_BANS", 
        "GUILD_PRESENCES",
        "GUILD_MESSAGES", 
        "GUILD_MESSAGE_REACTIONS", 
        "DIRECT_MESSAGES",
    ] , partials: ["MESSAGE", "CHANNEL", "REACTION"]
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

client.on('messageCreate', message =>{
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    switch(command){
        case 'ping':
            client.commands.get('ping').execute(message, args, Discord);
            break;
        case 'kick':
            client.commands.get('kick').execute(message, args, Discord);
            break;
        case 'ban':
            client.commands.get('ban').execute(message, args, Discord);
            break;
        case 'clear':
            client.commands.get('clear').execute(message, args, Discord);
            break;
        case 'mute':
            client.commands.get('mute').execute(message, args, Discord);
            break;
        case 'embed':
            client.commands.get('embed').execute(message, args, Discord);
            break;
        case 'embedbuilder':
            client.commands.get('embedbuilder_v2').execute(message, args, Discord, client);
            break;
        case 'shutdown':
            if(message.member.roles.cache.has('787699492061052948'))
            {
                message.reply("Shutting Down...").then(() => {
                    setTimeout(() => {
                        client.commands.get('clear').execute(message, ['2'], Discord).then(() => {
                            console.log("Bot is Offline");
                            client.destroy();
                        })
                    }, 1500);
                })
            } else {
                message.reply('Incorrect Permissions.')
                    .then(() => {
                        setTimeout(() => {
                            client.commands.get('clear').execute(message, ['1'], Discord)
                        }, 1500);
                    });
            }
            break;
        default:
            message.reply('Unknown Command.')
                .then(() => {
                    setTimeout(() => {
                        client.commands.get('clear').execute(message, ['2'], Discord)
                    }, 1500);
                });
            break;
    }
});

client.login('OTE4MzU3MTEwOTMxMjE0NDA2.YbGEtQ.vRKGm9u-KO4FybsGqSqECO5Y-q4');