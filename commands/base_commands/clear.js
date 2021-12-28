module.exports = {
    name: 'clear',
    description: "Clear messages in the channel this is called command is called from.",
    async execute(message, args){
        if(message.member.roles.cache.has('787699492061052948'))
        {
            if(!args[0]) return message.reply('Please specify amount of messages to clear.')
            if(isNaN(args[0])) return message.reply("Please enter a number");

            if(args[0] > 100) return message.reply("Please choose a smaller number");
            if(args[0] < 1) return message.reply("Must clear at least one message.");

            await message.channel.messages.fetch({limit: args[0]}).then(messages =>{
                message.channel.bulkDelete(messages);
            });
        } else {
            return message.reply('Incorrect Permissions.');
        }
    }
}