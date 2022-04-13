const {MessageActionRow, MessageButton} = require("discord.js");
const Resource = require("../../../../models/Resource");
const Providers = require("../../../../models/Providers");
const Resources = require('../../../../models/ResourceSettings');

const submitResource = async (embedInfoData, builtEmbed, previewEmbed, interaction, guildId) => {
    const { channel } = interaction

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

    const mainMsg = await interaction.reply({
        content: 'Are you sure that you want to submit this resource?',
        components: [row],
        embeds: [builtEmbed],
        fetchReply: true,
    })

    const btnFilter = (m) => {
        return interaction.user.id === m.user.id
    }

    const confConllector = await mainMsg.createMessageComponentCollector({
        btnFilter,
        max: 1,
    })

    confConllector.on('collect', async (btnInt) => {
        if(btnInt.customId === 'continue') {
            interaction.editReply({
                content: 'Confimed',
                components: [],
                embeds: [],
            })

            const resource = new Resource({
                guild_id: guildId,
                data: embedInfoData,
                ratings: [],
            })

            if(typeof embedInfoData.providerName !== 'undefined') {
                let providers = await Providers.find({
                    guild_id: guildId,
                });

                let providerEntry;

                providers.forEach(provider => {
                    if(provider.data.title == embedInfoData.providerName) {
                        providerEntry = provider;
                    }
                })

                console.log(providerEntry)

                console.log(embedInfoData.title)
                console.log(embedInfoData.resourceType)

                if(providerEntry.resources.length < 1 || typeof providerEntry.resources == 'undefined') {
                    providerEntry.resources = [{
                        title: embedInfoData.title,
                        type: embedInfoData.resourceType
                    }]
                } else {
                    providerEntry.resources.push({
                        title: embedInfoData.title,
                        type: embedInfoData.resourceType
                    })
                }

                providerEntry.save(err => {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log('save successful')
                    }
                })

                console.log(providerEntry.resources)
            }
            
            resource.save(err => {
                if(err) {
                    console.log(err);
                    interaction.reply({
                        content: 'An Issue has occured.',
                    }).then((msg) => {
                        setTimeout( () => {
                            msg.delete()
                        }, 2000);
                    });
                    return;
                }

                channel.send({
                    content: `Added Rescource.`,
                }).then((msg) => {
                    setTimeout( () => {
                        msg.delete()
                    }, 2000);
                });
            })

        } else {
            interaction.editReply({
                content: 'Canceled',
                components: [],
            })
        }
    })
}

module.exports = submitResource