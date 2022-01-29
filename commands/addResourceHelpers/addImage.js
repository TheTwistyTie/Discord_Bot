const {MessageActionRow, MessageButton} = require("discord.js");

const addImage = async (interaction, embedInfo) => {
    const { channel } = interaction;

    const mainMsg = await interaction.reply({
        content: 'What is the url of the image you want your resource to have?',
        ephemeral: true,
        fetchReply: true,
    })

    const filter = (m) => {
        return m.author.id === interaction.user.id
    }

    const urlCollector = channel.createMessageCollector({
        filter,
        max: 1,
    })

    urlCollector.on('collect', async urlMsg => {
        let url = urlMsg.content;

        await urlMsg.delete()

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

        const btnFilter = (m) => {
            return interaction.user.id === m.user.id
        }

        
        const btnMsg = await interaction.editReply({
            content: `Image URL: \'**${url}**\'`,
            components: [row],
            ephemeral: true,
            fetchReply: true,
        })

        const confCollector = await btnMsg.createMessageComponentCollector({
            btnFilter,
            max: 1,
        })

        confCollector.on('collect', (btnInt) => {
            if(btnInt.customId === 'continue') {
                interaction.editReply({
                    content: 'Confimed',
                    components: [],
                    ephemeral: true,
                })
                embedInfo.setImage(url)
            } else {
                interaction.editReply({
                    content: 'Canceled',
                    components: [],
                    ephemeral: true,
                })
            }

            const createResource = require("./createResource");
            createResource(embedInfo.resourceType, btnInt, embedInfo);
        })
    })
}

module.exports = addImage;