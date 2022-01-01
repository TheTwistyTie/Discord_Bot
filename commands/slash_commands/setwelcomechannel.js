const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const GuildSettings = require('../../models/GuildSettings');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setwelcomechannel')
        .setDescription('This sets the welcome channel.')
        .addChannelOption(option => option
            .setName("welcome")
            .setDescription("The new welcome channel.")
            .setRequired(true)    
        ),

    async execute(interaction) {
        //Enter Command Here
        //check for admin perms

        if(!interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])){
            interaction.reply({
                content: 'You do not have permissions to use this command.',
                ephemeral: true
            })
            return;
        }

        GuildSettings.findOne({guild_id: interaction.guild.id}, (err, settings) => {
            if(err) {
                console.log(err);
                interaction.reply({
                    content: 'An Issue has occured.',
                    ephemeral: true
                })
                return;
            }

            if(!settings) {
                settings = new GuildSettings({
                    guild_id: interaction.guild.id,
                    welcome_channel_id: interaction.options.getChannel('welcome').id
                });
            } else {
                settings.welcome_channel_id = interaction.options.getChannel('welcome').id;
            }

            settings.save(err => {
                if(err) {
                    console.log(err);
                    interaction.reply({
                        content: 'An Issue has occured.',
                        ephemeral: true
                    })
                    return;
                }

                interaction.reply({
                    content: `Welcome channel has been set to ${interaction.options.getChannel("welcome")}`,
                    ephemeral: true
                })
            })
        })
    }
}