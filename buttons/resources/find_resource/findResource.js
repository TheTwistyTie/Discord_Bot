const {MessageActionRow, MessageSelectMenu, MessageButton} = require("discord.js");
const ResourceSettings = require('../../../models/ResourceSettings');
const Resources = require('../../../models/Resource');
const PageHandler = require('./helpers/PageHandler');
const ResourceObject = require('./helpers/ResourceObject');

let pageHandler;
let filterResourceMsg;
module.exports = async (interaction) => {
    //Enter Command Here
    const { guild } = interaction

    let resourceSettings = await ResourceSettings.findOne({guild_id: guild.id});
    let resources = await Resources.find({guild_id: guild.id});
    resources.reverse()

    let resourceList = []
    for(i = 0; i < resources.length; i++) {
        resourceList.push(new ResourceObject(resources[i], i, guild))
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
                .setMinValues(1)
        )

    filterResourceMsg = await interaction.user.send({
        content: 'Resource Finder Filters:',
        components: [
            typeOfResourceRow,
            regionOfResourceRow,
        ],
        fetchReply: true,
    })

    pageHandler = new PageHandler(resourceList, filterResourceMsg.channel, interaction.user.id)
    const updateListListener = filterResourceMsg.createMessageComponentCollector()

    createDoneMessage(filterResourceMsg.channel)

    let resourceFilter = [];
    let regionFilter = [];
    updateListListener.on('collect', (filterUpdate) => {
        clear(false)
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

        createDoneMessage(filterResourceMsg.channel)

        filterUpdate.reply({
            content: `Updating...`,
            fetchReply: true,
        }).then(msg => {
            msg.delete();
        })
    })

}

let doneMessage;
const createDoneMessage = (channel) => {
    let doneMessageRow = new MessageActionRow().addComponents(
        new MessageButton()
            .setLabel('Done.')
            .setCustomId('done_button')
            .setStyle('DANGER')
    )

    setTimeout(async () => {
        doneMessage = await channel.send({
            content: ' ',
            components: [doneMessageRow],
            fetchReply: true,
        })

        let msgCollector = doneMessage.createMessageComponentCollector()

        msgCollector.on('collect', async (btnInt) => {
            if(btnInt.customId == 'done_button') {
                clear(true)
            }
            let looseEnd = await btnInt.reply({
                content: 'Finished.',
                fetchReply: true
            })
            looseEnd.delete()
        })
    }, 800)
}

const clear = (removeFilters) => {
    if(removeFilters) {
        filterResourceMsg.delete()
    }
    pageHandler.clear()
    doneMessage.delete()
}
