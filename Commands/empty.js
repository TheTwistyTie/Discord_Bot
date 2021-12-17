const { Client } = require("discord.js");

module.exports = {
    //@param {Client} client
    name: 'Empty',
    description: "This is an empty base command.",
    execute(message, args, Discord){
        if(message.member.roles.cache.has('787699492061052948'))
        {
            //Enter Command Here

        } else {
            return message.reply('Incorrect Permissions.');
        }
    }
}