const { Client } = require("discord.js");

module.exports = {
    //@param {Client} client
    name: 'Empty',
    description: "This is an empty base command.",
    execute(message, args, Discord, client){
        if(message.member.roles.cache.has('787699492061052948'))
        {
            //Enter Command Here

        } else {
            return message.reply('Incorrect Permissions.')
            .then(() => {
                setTimeout(() => {
                    client.commands.get('clear').execute(message, ['1'], Discord)
                }, 1500);
            });
        }
    }
}