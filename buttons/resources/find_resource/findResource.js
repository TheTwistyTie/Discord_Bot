const {MessageActionRow, MessageSelectMenu, MessageButton} = require("discord.js");
const ResourceSettings = require('../../../models/ResourceSettings');
const Resources = require('../../../models/Resource');
const PageHandler = require('./helpers/PageHandler');
const ResourceObject = require('./helpers/ResourceObject');

module.exports = async (interaction) => {
    //Enter Command Here
    const { guild } = interaction

    let resourceSettings = await ResourceSettings.findOne({guild_id: guild.id});
    let resources = await Resources.find({guild_id: guild.id});
    resources.reverse()

    let resourceList = []
    for(i = 0; i < resources.length; i++) {
        resourceList.push(new ResourceObject(resources[i].data, i, guild))
    }

    let regionResourcesNum = [];
    let regionKeys = resourceSettings.regions;
    for(i = 0; i < regionKeys.length; i++) {
        regionResourcesNum[regionKeys[i]] = 0
    }

    let sorted = [];
    for(i = 0; i < resourceList.length; i++) {
        if(resourceList[i].embedData.regions.length > 0) {
            resourceList[i].embedData.regions.forEach(region => {
                regionResourcesNum[region]++
            })
        }
        
        if(typeof sorted[resourceList[i].embedData.resourceType] === 'undefined') {
            sorted[resourceList[i].embedData.resourceType] = []
        }
        sorted[resourceList[i].embedData.resourceType].push(i)
    }

    let typeOptions = []
    let typeKeys = []
    for(key in sorted) {
        typeKeys.push(key)
        typeOptions.push({
            label: key + ` (${sorted[key].length})`,
            value: key,
        })
    }

    let regionOptions = []
    for(i = 0; i < regionKeys.length; i++) {
        regionOptions.push({
            label: regionKeys[i] + ` (${regionResourcesNum[regionKeys[i]]})`,
            value: regionKeys[i]
        })
    }

    const typeOfResourceRow = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('resource_filter')
                .setPlaceholder('What kind of resources are you looking for?')
                .setOptions(typeOptions)
                .setMaxValues(typeOptions.length)
        )

    const regionOfResourceRow = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('region_filter')
                .setPlaceholder('What region are you looking for resources in?')
                .setOptions(regionOptions)
                .setMaxValues(regionOptions.length)
        )

    const filterResourceMsg = await interaction.user.send({
        content: 'Resource Finder Filters:',
        components: [
            typeOfResourceRow,
            regionOfResourceRow,
        ],
        fetchReply: true,
    })

    let pageHandler = new PageHandler(resourceList, filterResourceMsg.channel, interaction.user.id)
    const updateListListener = filterResourceMsg.createMessageComponentCollector()

    let resourceFilter = [];
    let regionFilter = [];
    updateListListener.on('collect', (filterUpdate) => {
        pageHandler.clear()
        switch (filterUpdate.customId) {
            case 'resource_filter' :
                resourceFilter = []
                filterUpdate.values.forEach(selection => {
                    resourceFilter.push(selection);
                })
                break;
            case 'region_filter' :
                regionFilter = []
                filterUpdate.values.forEach(selection => {
                    regionFilter.push(selection);
                })
                break;
        }

        console.log("Find Resource randomly needed console call #1")
        console.log("Find Resource randomly needed console call #2")

        if(resourceFilter.length == 0) {
            if(regionFilter.length == 0) {
                pageHandler = new PageHandler(resourceList, filterResourceMsg.channel, interaction.user.id)
            } else {
                let regionFiltered = []
                for(i = 0; i < resourceList.length; i++) {
                    if(resourceList[i].embedData.regions.length == 0) {
                        regionFiltered.push(resourceList[i])
                    } else {
                        if(regionFilter.some(region => resourceList[i].embedData.regions.includes(region))) {
                            regionFiltered.push(resourceList[i])
                        }
                    }
                }

                pageHandler = new PageHandler(regionFiltered, filterResourceMsg.channel, interaction.user.id)
            }
        } else {
            let typeFiltered = []
            resourceFilter.forEach((type) => {
                sorted[type].forEach((resource) => {
                    typeFiltered.push(resourceList[resource])
                })
            })
            if(regionFilter.length == 0) {
                pageHandler = new PageHandler(typeFiltered, filterResourceMsg.channel, interaction.user.id)
            } else {
                let regionFiltered = []
                for(i = 0; i < typeFiltered.length; i++) {
                    if(typeFiltered[i].embedData.regions.length == 0) {
                        regionFiltered.push(typeFiltered[i])
                    } else {
                        if(regionFilter.some(region => typeFiltered[i].embedData.regions.includes(region))) {
                            regionFiltered.push(typeFiltered[i])
                        }
                    }
                }

                pageHandler = new PageHandler(regionFiltered, filterResourceMsg.channel, interaction.user.id)
            }
        }

        filterUpdate.reply({
            content: `Updating...`,
            fetchReply: true,
        }).then(msg => {
            msg.delete();
        })
    })
}
