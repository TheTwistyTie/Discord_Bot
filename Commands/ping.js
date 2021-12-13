module.exports = {
    name: 'ping',
    description: "this is a ping command!",
    execute(message, args){
        if(message.member.roles.cache.has('787698205319102485'))
        {
            return message.reply('pong!');
        } else {
            return message.reply('Incorrect Permissions.');
        }
    }
}