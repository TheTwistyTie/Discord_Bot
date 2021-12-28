const { Client } = require("discord.js");

module.exports = {
    name: 'Shutdown',
    description: "This will shut the bot down!",
    execute(message, args, Discord, client){
        if(message.member.roles.cache.has('787699492061052948'))
        {
            //Enter Command Here
            message.reply("Shutting Down...").then(() => {
                setTimeout(() => {
                    client.commands.get('clear').execute(message, ['2'], Discord).then(() => {
                        console.log("Bot is Offline");
                        client.destroy();
                        intentional.crash();
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
    }
}