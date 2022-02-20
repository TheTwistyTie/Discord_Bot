const {MessageActionRow, MessageButton, MessageSelectMenu} = require("discord.js");
const Resources = require('../../../../models/ResourceSettings');

const addRegions = async (interaction, embedInfo) => {
    let resources;
    resources = await Resources.findOne({guild_id: embedInfo.Guild.id});

    let regions = []
    for(i = 0; i < resources.regions.length; i++) {
        regions.push({
            label: `${resources.regions[i]}`,
            value: `${resources.regions[i]}`,
        })
    }

    const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId("regions")
                    .setPlaceholder("Select regions your resource is avalible in.")
                    .setOptions(regions)
                    .setMinValues(1)
                    .setMaxValues(resources.regions.length)
            )

    const mainMsg = await interaction.reply({
        content: 'What regions is your resource available in?',
        components: [row],
        fetchReply: true,
    })

    const filter = (reactionInt) => {
        return interaction.user.id === reactionInt.user.id
    }

    const regionCollector = mainMsg.createMessageComponentCollector({
        filter,
        max: 1,
    })

    regionCollector.on('collect', async regionInt => {
        let regions = regionInt.values;

        await interaction.editReply({
            content: 'Adding regions...',
            components: [],
        })
        
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

        let regionText = 'Regions:\n'
        for(i = 0; i < regions.length; i++) {
            regionText += regions[i] + '\n'
        }

        const btnMsg = await regionInt.reply({
            content: regionText,
            components: [row],
            fetchReply: true,
        })

        const confCollector = btnMsg.createMessageComponentCollector({
            btnFilter,
            max: 1,
        })

        confCollector.on('collect', (btnInt) => {
            if(btnInt.customId === 'continue') {
                regionInt.editReply({
                    content: 'Confimed',
                    components: [],
                })
                embedInfo.addRegions(regions)
            } else {
                regionInt.editReply({
                    content: 'Canceled',
                    components: [],
                })
            }

            const createResource = require("./createResource");
            createResource(embedInfo.resourceType, btnInt, embedInfo.Guild, embedInfo);
        })
    })
}

module.exports = addRegions;