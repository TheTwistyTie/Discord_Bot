const {MessageActionRow, MessageButton} = require("discord.js");

const itemTitle = 'Address:'

const addAddress = async (embedInfo, interaction, resources) => {
    const { channel } = interaction;

    const mainMsg = await interaction.reply({
        content: 'What is the address you want your resource to have?',
        ephemeral: true,
        fetchReply: true,
    })

    const filter = (m) => {
        return m.author.id === interaction.user.id
    }

    const addressCollector = channel.createMessageCollector({
        filter,
        max: 1,
    })

    addressCollector.on('collect', async addressMsg => {
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

        let address = addressMsg.content;

        await addressMsg.delete()
        const btnMsg = await interaction.editReply({
            content: `${itemTitle} \'**${address}**\'`,
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
                const result = embedInfo.isSet(itemTitle)
                if(result !== -1) {
                    embedInfo.fields[result].value = address;
                } else {
                    embedInfo.fields.push({
                        name: itemTitle,
                        value: address,
                        inline: true,
                    })
                }
                interaction.editReply({
                    content: 'Confimed',
                    components: []
                })
            } else {
                interaction.editReply({
                    content: 'Canceled',
                    components: []
                })
            }

            const createResource = require('./createResource');
            createResource(embedInfo.description, btnInt, resources, embedInfo)
        })
    })
}

module.exports = addAddress;