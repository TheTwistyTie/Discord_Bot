const {MessageActionRow, MessageButton} = require("discord.js");

const resourseName = async (embedInfo, interaction, resources) => {
    const { channel } = interaction;

    const titleMsg = await interaction.reply({
        content: 'What would you like the title to be?',
        ephemeral: true,
        fetchReply: true,
    })

    const filter = (m) => {
        return m.author.id === interaction.user.id
    }

    const titleCollector = channel.createMessageCollector({
        filter,
        max: 1
    })

    titleCollector.on('collect', async titleMsg => {
        
        const title = titleMsg.content;

        await titleMsg.delete();

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
            content: `Set the new title as: \t\'**${title}**\'`,
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

                embedInfo.fields[0].name = title
                interaction.editReply({
                    content: `Title Set`,
                    components: [],
                    ephemeral: true,
                })
            } else {
                interaction.editReply({
                    content: `Canceled.`,
                    components: [],
                    ephemeral: true,
                })
            }

            const createResource = require('./createResource');
            createResource(embedInfo.description, btnInt, resources, embedInfo)
        })
    })
}

module.exports = resourseName;