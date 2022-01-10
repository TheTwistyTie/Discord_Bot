const {MessageActionRow, MessageButton} = require("discord.js");
const EmbedInfo = require("./EmbedInfo");

const resourseDescription = async (interaction, embedInfo) => {
    const { channel } = interaction;

    const mainMsg = await interaction.reply({
        content: 'What would you like the description to be?',
        ephemeral: true,
        fetchReply: true,
    })

    const filter = (m) => {
        return m.author.id === interaction.user.id
    }

    const descriptionCollector = channel.createMessageCollector({
        filter,
        max: 1
    })

    descriptionCollector.on('collect', async descMsg => {
        
        const description = descMsg.content;

        await descMsg.delete();

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('continue')
                    .setLabel('Continue')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('cancel')
                    .setLabel('Cancel')
                    .setStyle('DANGER')
            )

        const btnMsg = await interaction.editReply({
            content: `Set the description as: \t\'**${description}**\'`,
            components: [row],
            ephemeral: true,
            fetchReply: true,
        })

        const btnFilter = (m) => {
            return interaction.user.id === m.user.id
        }

        const confCollector = btnMsg.createMessageComponentCollector({
            btnFilter,
            max: 1
        })

        confCollector.on('collect', (btnInt) => {
            if(btnInt.customId === 'continue') {
                interaction.editReply({
                    content: `Description Set`,
                    components: [],
                    ephemeral: true,
                })
                embedInfo.setDescription(description);
            } else {
                interaction.editReply({
                    content: `Canceled.`,
                    components: [],
                    ephemeral: true,
                })
            }
            
            const createResource = require("./createResource");
            createResource(embedInfo.resourceType, btnInt, embedInfo);
        })
    })
}

module.exports = resourseDescription;