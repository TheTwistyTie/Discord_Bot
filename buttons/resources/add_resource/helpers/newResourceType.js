const Resources = require('../../../../models/ResourceSettings');
const {MessageActionRow, MessageButton} = require("discord.js");

const addNew = async (interaction , guild) => {
    let resources;
    resources = await Resources.findOne({guild_id: guild.id});
    
    const msg = await interaction.reply({
        content: 'What new category of resource would you like to add?',
        fetchReply: true,
    })

    const collector = interaction.channel.createMessageCollector({
        max: 1
    })

    collector.on('collect', async message => {
        resources.types.push({
            value: `${message.content}`
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

        const btnMsg = await msg.edit({
            content: `Add Rescource type: \'**${message.content}**\'`,
            components: [row],
            fetchReply: true,
        })

        const confCollector = btnMsg.createMessageComponentCollector({
            max: 1
        })

        confCollector.on('collect', (btnInt) => {
            if(btnInt.customId === 'continue') {
                btnMsg.reply({
                    content: 'Added New Resource Type.',
                    components: [],
                    ephemeral: true,
                })

                resources.save(async err => {
                    if(err) {
                        console.log(err);
                        message.reply({
                            content: 'An Issue has occured.',
                        })
                        return;
                    }
                    
                })

                const createResource = require('./createResource');
                createResource(message.content, btnInt)
            } else {
                interaction.editReply({
                    content: 'Canceled.',
                    components: [],
                    ephemeral: true,
                })
            }

            btnMsg.delete();            
        })

        
    })
}

module.exports = addNew;