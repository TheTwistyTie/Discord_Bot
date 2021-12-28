module.exports = {
    name: 'ban',
    description: "This will permanently remove a user from the server.",
    execute(message, args, Discord){
        if(message.member.roles.cache.has('787699492061052948'))
        {
            //Enter Command Here
            const member = message.mentions.users.first();
            if(member)
            {
                const memberTarget = message.guild.members.cache.get(member.id);
                memberTarget.ban();
                return message.reply(`<@${memberTarget.user.id}> has been Banned`);
            }
            else
            {
                return message.reply("No Member Specified");
            }

        } else {
            message.reply('Incorrect Permissions.');
        }
    }
}