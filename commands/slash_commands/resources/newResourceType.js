const Resources = require('../../../models/Resources');
const {MessageActionRow, MessageButton} = require("discord.js");

const addNew = async (interaction, resources) => {
    const {channel} = interaction;
    
    await interaction.reply({
        content: 'What new category of resource would you like to add?',
        ephemeral: true,
    })

    const filter = (m) => {
        return interaction.user.id === m.author.id
    }

    const collector = channel.createMessageCollector({
        filter,
        max: 1
    })

    collector.on('collect', async message => {
        await message.channel.messages.fetch({limit: '1'}).then(messages =>{
            message.channel.bulkDelete(messages);
        });

        resources.types.push({
            value: `${message.content}`
        })

        resources.save(async err => {
            if(err) {
                console.log(err);
                message.reply({
                    content: 'An Issue has occured.',
                }).then(() => {
                    setTimeout(async () => {
                        await message.channel.messages.fetch({limit: '2'}).then(messages =>{
                            message.channel.bulkDelete(messages);
                        });
                    }, 2000);
                });
                return;
            }

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

            const btnMsg = await interaction.editReply({
                content: `Added Rescource type: \'**${message.content}**\'`,
                components: [row],
                ephemeral: true,
                fetchReply: true,
            })

            const btnFilter = (m) => {
                return interaction.user.id === m.user.id
            }

            const confCollector = btnMsg.createMessageComponentCollector({
                btnFilter,
                max: 1
            })

            confCollector.on('collect', (btnInt) => {
                if(btnInt.customId === 'continue') {
                    createResource(message.content, btnInt, resources)
                } else {
                    btnInt.reply({
                        content: 'Canceled.',
                        ephemeral: true,
                    })
                }
            })
        })
    })
}

module.exports = addNew;