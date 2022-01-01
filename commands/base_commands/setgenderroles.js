const { Client } = require("discord.js");
const { Permissions } = require('discord.js');
const RoleSettings = require('../../models/RoleSettings');

module.exports = {
    //@param {Client} client
    name: 'setgenderroles',
    description: "set up the server's gender roles.",
    execute(message, args, Discord, client, dbClient){
        if(message.member.roles.cache.has('787699492061052948'))
        {
            const prefix = '<@&'
            //Enter Command Here
            RoleSettings.findOne({guild_id: message.guild.id}, (err, settings) => {
                if(err) {
                    console.log(err);
                    interaction.reply({
                        content: 'An Issue has occured.',
                        ephemeral: true
                    }).then(() => {
                        setTimeout(() => {
                            client.commands.get('clear').execute(message, ['1'], Discord)
                        }, 2000);
                    });
                    return;
                }
    
                if(!settings) {
                    settings = new RoleSettings({
                        guild_id: message.guild.id,
                        GenderRoles:{
                        he_him: args[0].slice(prefix.length).slice(0, -1),
                        she_her: args[1].slice(prefix.length).slice(0, -1),
                        they_them: args[2].slice(prefix.length).slice(0, -1),
                        other: args[3].slice(prefix.length).slice(0, -1)}
                    });
                } else {
                    settings.GenderRoles.he_him = args[0].slice(prefix.length).slice(0, -1);
                    settings.GenderRoles.she_her = args[1].slice(prefix.length).slice(0, -1);
                    settings.GenderRoles.they_them = args[2].slice(prefix.length).slice(0, -1);
                    settings.GenderRoles.other = args[3].slice(prefix.length).slice(0, -1);
                }
    
                settings.save(err => {
                    if(err) {
                        console.log(err);
                        message.reply({
                            content: 'An Issue has occured.',
                        }).then(() => {
                            setTimeout(() => {
                                client.commands.get('clear').execute(message, ['1'], Discord)
                            }, 2000);
                        });
                        return;
                    }
    
                    message.reply({
                        content: `Gender Roles set.`,
                    }).then(() => {
                        setTimeout(() => {
                            client.commands.get('clear').execute(message, ['1'], Discord)
                        }, 2000);
                    });
                })
            })

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