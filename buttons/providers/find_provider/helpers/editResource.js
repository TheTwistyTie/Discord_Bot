const {MessageActionRow, MessageButton} = require("discord.js");
const Resource = require("../../models/Resource");
const Resources = require('../../models/ResourceSettings');

const editResource = async (embedInfoData, builtEmbed, previewEmbed, interaction, index) => {
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
        content: 'Are these edits correct?',
        components: [row],
        embeds: [builtEmbed],
        ephemeral: true,
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
                ephemeral: true,
            })

            let resources = await Resource.find({guild_id: channel.guild.id});
            let resource = resources[index]

            Resources.updateMany(
                {
                    data: resource.data
                },
                {
                    data: {
                        embedData: embedInfoData,
                        fullEmbed: builtEmbed,
                        previewEmbed: previewEmbed,
                    }
                }
            )
            console.log(`Resource at index ${index} is: ${resource.data.embedData.title}`)

            resource = new Resource({
                guild_id: btnInt.guild.id,
                data: {
                    embedData: embedInfoData,
                    fullEmbed: builtEmbed,
                    previewEmbed: previewEmbed,
                }
            })

            /*resource.save(err => {
                if(err) {
                    console.log(err);
                    interaction.reply({
                        content: 'An Issue has occured.',
                    }).then(() => {
                        setTimeout( async () => {
                            await channel.messages.fetch({limit: '1'}).then(messages =>{
                                channel.bulkDelete(messages);
                            });
                        }, 2000);
                    });
                    return;
                }

                channel.send({
                    content: `Added Rescource.`,
                }).then(() => {
                    setTimeout( async () => {
                        await channel.messages.fetch({limit: '1'}).then(messages =>{
                            channel.bulkDelete(messages);
                        });
                    }, 2000);
                });
            })*/

        } else {
            interaction.editReply({
                content: 'Canceled',
                components: [],
                ephemeral: true,
            })
        }
    })
}

module.exports = editResource