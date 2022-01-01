const { Client } = require("discord.js");
const { Permissions } = require('discord.js');
const RoleSettings = require('../../models/RoleSettings');

module.exports = {
    //@param {Client} client
    name: 'addregionrole',
    description: "Add a new region role to your server.",
    execute(message, args, Discord, client, dbClient){
        if(message.member.roles.cache.has('787699492061052948'))
        {
            const prefix = '<@&'
            //Enter Command Here
            RoleSettings.findOne({guild_id: message.guild.id}, (err, settings) => {
                if(err) {
                    console.log(err);
                    message.reply({
                        content: 'An Issue has occured.',
                        ephemeral: true
                    }).then(() => {
                        setTimeout(() => {
                            client.commands.get('clear').execute(message, ['2'], Discord)
                        }, 2000);
                    });
                    return;
                }
    
                if(!settings) {
                    settings = new RoleSettings({
                        guild_id: message.guild.id,
                    });
                } else {
                    settings.RegionRoles.push({
                        role_id: args.shift().slice(prefix.length).slice(0, -1),
                        name: this.mergArgs(args)
                    })
                }
    
                settings.save(err => {
                    if(err) {
                        console.log(err);
                        message.reply({
                            content: 'An Issue has occured.',
                        }).then(() => {
                            setTimeout(() => {
                                client.commands.get('clear').execute(message, ['2'], Discord)
                            }, 2000);
                        });
                        return;
                    }
    
                    message.reply({
                        content: `Region Role added.`,
                    }).then(() => {
                        setTimeout(() => {
                            client.commands.get('clear').execute(message, ['2'], Discord)
                        }, 2000);
                    });
                })
            })

        } else {
            return message.reply('Incorrect Permissions.')
            .then(() => {
                setTimeout(() => {
                    client.commands.get('clear').execute(message, ['2'], Discord)
                }, 1500);
            });
        }
    },

    mergArgs(args){
        let output = "";
        for(i = 0; i < args.length; i++) {
            output += " " + args[i];
        }
        return output
    }
}