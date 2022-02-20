const {MessageActionRow, MessageButton} = require("discord.js");
const genderRole = require("./add_role/genderRole");
const regionRole = require("./add_role/regionRole");

module.exports = async (interaction) => {
    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('pronouns')
                .setLabel('Pronouns Roles')
                .setStyle('PRIMARY'),

            new MessageButton()
                .setCustomId('region')
                .setLabel('Region Roles')
                .setStyle('PRIMARY')
        )

    const msg = await interaction.reply({
        content: 'Set your roles!',
        components: [row],
        ephemeral: true,
        fetchReply: true,
    })

    const collector = msg.createMessageComponentCollector()

    collector.on('collect', btnInt => {
        switch(btnInt.customId) {
            case 'pronouns':
                genderRole(btnInt);
                break;
            case 'region' :
                regionRole(btnInt);
                break;
        }
    })
}