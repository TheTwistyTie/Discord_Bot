const Providers = require('../../../../models/Providers')
const {MessageActionRow, MessageSelectMenu, MessageButton} = require("discord.js");
const addResource = require('../addResouce');
const addProvider = require('../../../providers/add_provider/addProvider');
const selectProviderInformation = require('./selectProviderInformation');


const linkToProvider = async (interaction, guild) => {
    let providers = await Providers.find({guild_id: guild.id})

    let providerNames = [];
    for(let i = 0; i < providers.length; i++) {
        providerNames.push({
            label: providers[i].data.embedData.title,
            value: i.toString()
        })
    }

    providerNames.push({
        label: 'Provider not listed',
        value: '-1'
    })

    const row = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('provider_choice')
                .setPlaceholder('Which Provider is your resource linked to?')
                .setOptions(providerNames)
        )

    const providerMsg = await interaction.reply({
        content: 'Which provider would you like to link to?',
        components: [row],
        fetchReply: true,
    })

    const providerChoiceCollector = providerMsg.createMessageComponentCollector()
    providerChoiceCollector.on('collect', async (providerInt) => {
        const {values} = providerInt

        if(values[0] == -1) {
            //If porvider is not listed
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('newProvider')
                        .setLabel('Create New Provider')
                        .setStyle('PRIMARY'),

                    new MessageButton()
                        .setCustomId('skipAdding')
                        .setLabel('Don\'t Link')
                        .setStyle('SECONDARY'),

                    new MessageButton()
                        .setCustomId('cancel')
                        .setLabel('Cancel')
                        .setStyle('DANGER')
                )

            const newProviderMsg = await providerInt.reply({
                content: 'Would you like to create a new provider?',
                components: [row],
                fetchReply: true,
            })

            const providerQuestionCollector = newProviderMsg.createMessageComponentCollector()

            providerQuestionCollector.on('collect', noProviderInt => {
                const {customId} = noProviderInt;

                switch(customId) {
                    case 'newProvider':
                        newProviderMsg.edit('Adding new provider listing.')
                        addProvider(noProviderInt)
                        break;
                    case 'skipAdding':
                        newProviderMsg.edit('Skipping adding new provider.')
                        addResource(noProviderInt)
                        break;
                    case 'cancel':
                        newProviderMsg.edit('Canceled.')
                        break;
                }

                let looseEnd = noProviderInt.reply({
                    content: 'Button Clicked...',
                    fetchReply: true
                })
        
                looseEnd.delete()
            })
        } else {
            //When a provider is selected
            selectProviderInformation(providerInt, providers[values[0]], guild)
        }
    })
}

module.exports = linkToProvider