const { MessageActionRow, MessageSelectMenu } = require("discord.js")
const buildEmbed = require("../../../providers/add_provider/helpers/buildEmbed")
const typeOfResource = require("./typeOfResource")

const selectProviderInformation = async (interaction, provider, guild) => {
    /*  
        data that can be transfered 
            Logo as thumbnail
            URL for link
            fields
                hours
                languages
                address
                email
                number
            regions

        Steps 
            check for fields with values

            show full embed 
            show buttons for each data value that is filled or drop down that lets you select all at once

            once user has selected data, create new EmbedInfo as 'providerData' and pass to 'typeOfResource(interaction, guild, providerData)'
    */

    let data = []
    let options = []

    if(typeof provider.data.thumbnail !== 'undefined') {
        data['thumbnail'] = provider.data.thumbnail

        options.push({
            label: 'Logo',
            value: 'thumbnail'
        })
    }

    if(typeof provider.data.url !== 'undefined') {
        data['url'] = provider.data.url

        options.push({
            label: 'URL',
            value: 'url'
        })
    }

    if(typeof provider.data.hours.value !== 'undefined') {
        data['hours'] = provider.data.hours.value

        options.push({
            label: 'Hours',
            value: 'hours'
        })
    } 

    if(typeof provider.data.languages.value !== 'undefined') {
        data['languages'] = provider.data.languages.value

        options.push({
            label: 'Languages',
            value: 'languages'
        })
    } 

    if(typeof provider.data.address.value !== 'undefined') {
        data['address'] = provider.data.address.value

        options.push({
            label: 'Address',
            value: 'address'
        })
    } 

    if(typeof provider.data.email.value !== 'undefined') {
        data['email'] = provider.data.email.value

        options.push({
            label: 'Email',
            value: 'email'
        })
    } 

    if(typeof provider.data.number.value !== 'undefined') {
        data['number'] = provider.data.number.value

        options.push({
            label: 'Number',
            value: 'number'
        })
    } 

    if(typeof provider.data.regions !== 'undefined') {
        data['regions'] = provider.data.regions

        options.push({
            label: 'Regions',
            value: 'regions'
        })
    } 

    const row = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('providerDataSelect')
                .setPlaceholder('Select Data')
                .setOptions(options)
                .setMinValues(1)
        )

    const dataMessage = await interaction.reply({
        content: 'What data would you like to link?',
        embeds: [buildEmbed(provider.data)],
        components: [row],
        fetchReply: true
    })

    const dataCollector = dataMessage.createMessageComponentCollector()

    dataCollector.on('collect', selectInt => {
        const {values} = selectInt

        let dataToSend = [];

        dataToSend['title'] = provider.data.title;

        for(let i = 0; i < values.length; i++) {
            dataToSend[values[i]] = data[values[i]]
        }

        typeOfResource(selectInt, guild, dataToSend)
    })
}

module.exports = selectProviderInformation;