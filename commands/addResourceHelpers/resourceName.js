const {MessageActionRow, MessageButton} = require("discord.js");

const resourseName = async (interaction, embedInfo) => {
    const { channel } = interaction;

    const mainMsg = await interaction.reply({
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
            content: `Set the title as: \t\'**${title}**\'`,
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
                    content: `Title Set`,
                    components: [],
                    ephemeral: true,
                })
                embedInfo.setName(title);
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

module.exports = resourseName;