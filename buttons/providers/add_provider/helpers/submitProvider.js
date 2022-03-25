const {MessageActionRow, MessageButton} = require("discord.js");
const Providers = require("../../../../models/Providers");

const submitProvider = async (embedInfoData, builtEmbed, previewEmbed, interaction, guildId) => {
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

            const provider = new Providers({
                guild_id: guildId,
                data: {
                    embedData: embedInfoData,
                    fullEmbed: builtEmbed,
                    previewEmbed: previewEmbed,
                }
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

        } else {
            interaction.editReply({
                content: 'Canceled',
                components: [],
            })
        }
    })
}

module.exports = submitProvider