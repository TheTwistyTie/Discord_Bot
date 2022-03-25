const {MessageActionRow, MessageSelectMenu, MessageButton} = require("discord.js");
const Providers = require('../../../models/Providers');
const createProvider = require("./helpers/createProvider");

const addProvider = async (interaction) => {
    const {guild} = interaction

    const intialMessage = await interaction.user.send({
        content: 'What is the name of the provider you want to add?',
        fetchReply: true,
    })

    const channel = intialMessage.channel

    const collector = await intialMessage.channel.createMessageCollector({
        max: 1,
    })

    collector.on('collect', async (providerName) => {
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('confirm')
                    .setLabel('Confirm')
                    .setStyle('SUCCESS'),

                new MessageButton()
                    .setCustomId('cancel')
                    .setLabel('Cancel')
                    .setStyle('DANGER')
            )

        const confMessage = await channel.send({
            content: `Provider name: ${providerName.content}`,
            components: [row],
            fetchReply: true,
        })

        const confCollect = await confMessage.createMessageComponentCollector()
        confCollect.on('collect', (confInt) => {
            if(confInt.customId === 'confirm') {
                createProvider(providerName.content, confInt, interaction.guild);
            } else {
                confInt.reply('Cancled.')
            }
        })
    })
}

module.exports = addProvider