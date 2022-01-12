const {MessageActionRow, MessageButton} = require("discord.js");
const Resources = require('../../../models/Resources');

const submitResource = async (embedInfoData, builtEmbed, interaction) => {
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

            let resources;
            resources = await Resources.findOne({guild_id: channel.guild.id});

            resources.resources.push({
                embedData: embedInfoData,
                embed: builtEmbed,
            })

            resources.save(err => {
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
                    content: `Added Rescource types.`,
                }).then(() => {
                    setTimeout( async () => {
                        await channel.messages.fetch({limit: '1'}).then(messages =>{
                            channel.bulkDelete(messages);
                        });
                    }, 2000);
                });
            })

        } else {
            interaction.editReply({
                content: 'Canceled',
                components: [],
                ephemeral: true,
            })
        }
    })
}

module.exports = submitResource