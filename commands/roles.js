const {MessageActionRow, MessageButton} = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const genderRole = require("./add_role/genderRole");
const regionRole = require("./add_role/regionRole");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roles')
        .setDescription("Use this command to set your roles!"),

    async execute(interaction) {
        //Enter Command Here
        const {channel} = interaction

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('pronouns')
                    .setLabel('Pronouns Roles')
                    .setStyle('PRIMARY'),

                new MessageButton()
                    .setCustomId('region')
                    .setLabel('Region Roles')
                    .setStyle('PRIMARY'),
                
                new MessageButton()
                    .setCustomId('cancel')
                    .setLabel('Cancel')
                    .setStyle('DANGER')
            )

        const msgInt = await interaction.reply({
            content: 'What type of roles would you like to set?',
            components: [row],
            ephemeral: true,
            fetchReply: true,
        })

        const btnCollector = await msgInt.createMessageComponentCollector({
            max: 1,
        })

        btnCollector.on('collect', async btnInt => {
            if(btnInt.customId === 'pronouns') {
                
                genderRole(interaction, btnInt);
    
            } else if(btnInt.customId === 'region') {

                regionRole(interaction, btnInt);
                
            } else {
                if(!btnInt.customId === 'cancel') {
                    console.log(btnInt.customId)
                }
                btnInt.reply({
                    content: "Canceled.",
                    components: [],
                    ephemeral: true,
                })
            }
        })
    } 
}