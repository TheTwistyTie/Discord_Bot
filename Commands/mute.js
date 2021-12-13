const ms = require('ms');

module.exports = {
    name: 'mute',
    description: "This will mute a user for a specified time. Defaulted to one (1) minute.",
    execute(message, args, Discord){
        if(message.member.roles.cache.has('787699492061052948'))
        {
            //Enter Command Here
            const target = message.mentions.users.first();
            if(target){
                let mainRole = message.guild.roles.cache.find(role => role.name === 'Member');
                let muteRole = message.guild.roles.cache.find(role => role.name === 'muted');
                
                let memberTarget = message.guild.members.cache.get(target.id);

                memberTarget.roles.remove(mainRole.id);
                memberTarget.roles.add(muteRole.id);

                if(!args[1]){
                    message.reply(`<@${memberTarget.user.id}> has been muted for ${ms(ms('1h'))}.`);
                    setTimeout(function () {
                        memberTarget.roles.remove(muteRole.id);
                        memberTarget.roles.add(mainRole.id);
                    }, ms('1h'));
                } else
                {
                    message.reply(`<@${memberTarget.user.id}> has been muted for ${ms(ms(args[1]))}.`);
                    setTimeout(function () {
                        memberTarget.roles.remove(muteRole.id);
                        memberTarget.roles.add(mainRole.id);
                    }, ms(args[1]));
                }
                return;
            }
            else{
                return message.reply("Cant find member.");
            }

        } else {
            return message.reply('Incorrect Permissions.');
        }
    }
}

//muted role id: 919629267694936064