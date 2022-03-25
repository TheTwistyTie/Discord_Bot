const { MessageActionRow, MessageSelectMenu } = require("discord.js")
const typeOfResource = require("./typeOfResource")

const selectProviderInformation = async (interaction, provider, guild) => {
    const {fullEmbed, embedData} = provider.data

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

    if(typeof embedData.thumbnail !== 'undefined') {
        data['thumbnail'] = embedData.thumbnail

        options.push({
            label: 'Logo',
            value: 'thumbnail'
        })
    }

    if(typeof embedData.url !== 'undefined') {
        data['url'] = embedData.url

        options.push({
            label: 'URL',
            value: 'url'
        })
    }

    if(typeof embedData.hours.value !== 'undefined') {
        data['hours'] = embedData.hours.value

        options.push({
            label: 'Hours',
            value: 'hours'
        })
    } 

    if(typeof embedData.languages.value !== 'undefined') {
        data['languages'] = embedData.languages.value

        options.push({
            label: 'Languages',
            value: 'languages'
        })
    } 

    if(typeof embedData.address.value !== 'undefined') {
        data['address'] = embedData.address.value

        options.push({
            label: 'Address',
            value: 'address'
        })
    } 

    if(typeof embedData.email.value !== 'undefined') {
        data['email'] = embedData.email.value

        options.push({
            label: 'Email',
            value: 'email'
        })
    } 

    if(typeof embedData.number.value !== 'undefined') {
        data['number'] = embedData.number.value

        options.push({
            label: 'Number',
            value: 'number'
        })
    } 

    if(typeof embedData.regions !== 'undefined') {
        data['regions'] = embedData.regions

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
        embeds: [fullEmbed],
        components: [row],
        fetchReply: true
    })

    const dataCollector = dataMessage.createMessageComponentCollector()

    dataCollector.on('collect', selectInt => {
        const {values} = selectInt

        let dataToSend = [];

        dataToSend['title'] = embedData.title;

        for(let i = 0; i < values.length; i++) {
            dataToSend[values[i]] = data[values[i]]
        }

        typeOfResource(selectInt, guild, dataToSend)
    })
}

module.exports = selectProviderInformation;