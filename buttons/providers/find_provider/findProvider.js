const {MessageActionRow, MessageSelectMenu, MessageButton} = require("discord.js");
const ResourceSettings = require('../../../models/ResourceSettings');
const Providers = require('../../../models/Providers');
const PageHandler = require('./helpers/PageHandler');
const ResourceObject = require('./helpers/ResourceObject');

module.exports = async (interaction) => {
    //Enter Command Here
    const { guild } = interaction

    let resourceSettings = await ResourceSettings.findOne({guild_id: guild.id});
    let providers = await Providers.find({guild_id: guild.id});
    providers.reverse()

    let providerList = []
    for(i = 0; i < providers.length; i++) {
        providerList.push(new ResourceObject(providers[i].data, i))
    }

    let regionResourcesNum = [];
    let regionKeys = resourceSettings.regions;
    for(i = 0; i < regionKeys.length; i++) {
        regionResourcesNum[regionKeys[i]] = 0
    }

    let sorted = [];
    for(i = 0; i < providerList.length; i++) {
        if(providerList[i].embedData.regions.length > 0) {
            providerList[i].embedData.regions.forEach(region => {
                regionResourcesNum[region]++
            })
        }
    }

    let regionOptions = []
    for(i = 0; i < regionKeys.length; i++) {
        regionOptions.push({
            label: regionKeys[i] + ` (${regionResourcesNum[regionKeys[i]]})`,
            value: regionKeys[i]
        })
    }

    const regionOfProviderRow = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('region_filter')
                .setPlaceholder('What region are you looking for resources in?')
                .setOptions(regionOptions)
                .setMinValues(1)
        )

    const filterProviderMsg = await interaction.user.send({
        content: 'Provider Finder:',
        components: [
            regionOfProviderRow,
        ],
        fetchReply: true,
    })

    const updateListListener = filterProviderMsg.createMessageComponentCollector()

    let pageHandler = new PageHandler(providerList, filterProviderMsg.channel, interaction.user.id)
    let regionFilter = [];

    updateListListener.on('collect', (filterUpdate) => {
        pageHandler.clear()
        switch (filterUpdate.customId) {
            case 'region_filter' :
                regionFilter = []
                filterUpdate.values.forEach(selection => {
                    regionFilter.push(selection);
                })
                break;
        }

            if(regionFilter.length == 0) {
                pageHandler = new PageHandler(providerList, filterProviderMsg.channel, interaction.user.id)
            } else {
                let regionFiltered = []
                for(i = 0; i < providerList.length; i++) {
                    if(providerList[i].embedData.regions.length == 0) {
                        regionFiltered.push(providerList[i])
                    } else {
                        if(regionFilter.some(region => providerList[i].embedData.regions.includes(region))) {
                            regionFiltered.push(providerList[i])
                        }
                    }
                }

                pageHandler = new PageHandler(regionFiltered, filterProviderMsg.channel, interaction.user.id)
            }

        filterUpdate.reply({
            content: `Updating...`,
            fetchReply: true,
        }).then(msg => {
            msg.delete();
        })
    })
}
