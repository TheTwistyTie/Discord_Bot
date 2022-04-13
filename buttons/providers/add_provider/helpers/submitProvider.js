const {MessageActionRow, MessageButton} = require("discord.js");
const Providers = require("../../../../models/Providers");

const submitProvider = async (embedInfoData, builtEmbed, previewEmbed, interaction, guildId, editing, index) => {
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

            if(editing) {
                let providerList = await Providers.find({guild_id: guildId});

                let provider;
                if(typeof index !== 'undefined') {
                    if(providerList[index].data.embedData.title == embedInfoData.title) {
                        providerList[index].data.embedData = embedInfoData;
                    }

                    providerList[index].save(err => {
                        if(err) {
                            console.log(err)
                            btnInt.reply('There was an error saving this edit. Please contact the admin.')
                        } else {
                            btnInt.reply('Edit saved succesfully!')
                        }
                    })
                } else {
                    console.log('Provider at index provided is not the same as the provider you are trying to make edits to. Defaulting to searching.')
                }
            } else {
                const provider = new Providers({
                    guild_id: guildId,
                    data: embedInfoData,
                    ratings: [],
                    resources: [],
                })

                provider.save(err => {
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
                        content: `Added Provider.`,
                    }).then((msg) => {
                        setTimeout( () => {
                            msg.delete()
                        }, 2000);
                    });
                })
            }
        } else {
            interaction.editReply({
                content: 'Canceled',
                components: [],
            })
        }
    })
}

module.exports = submitProvider