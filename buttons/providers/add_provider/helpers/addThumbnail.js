const {MessageActionRow, MessageButton} = require("discord.js");

const addThumbnail = async (interaction, embedInfo) => {
    const { channel } = interaction;

    const mainMsg = await interaction.reply({
        content: 'What is the url of the image you want your to have?',
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
        let url;
        if(urlMsg.attachments.size == 0) {

        url = urlMsg.content;

        } else {
            console.log('User sent image.')
            url = urlMsg.attachments.first().url;
            console.log(url)
        }

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
                })
                embedInfo.setThumbnail(url)
            } else {
                interaction.editReply({
                    content: 'Canceled',
                    components: [],
                })
            }

            const createProvider = require("./createProvider");
            createProvider(embedInfo.Name, btnInt, embedInfo.Guild, embedInfo);
        })
    })
}

module.exports = addThumbnail;