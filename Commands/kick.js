module.exports = {
    name: 'kick',
    description: "This kicks a user off of the server.",
    execute(message, args, Discord){
        if(message.member.roles.cache.has('787699492061052948'))
        {
            //Enter Command Here
            const member = message.mentions.users.first();
            if(member)
            {
                const memberTarget = message.guild.members.cache.get(member.id);
                memberTarget.kick();
                return message.reply(`<@${memberTarget.user.id}> has been kicked`);
            }
            else
            {
                return message.reply("No Member Specified");
            }

        } else {
            return message.reply('Incorrect Permissions.');
        }
    }
}