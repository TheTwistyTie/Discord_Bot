const UserData = require('../../../models/User');
const Providers = require('../../../models/Providers');
const PageHandler = require('../find_provider/helpers/PageHandler')
const ResourceObject = require('../find_provider/helpers/ResourceObject');
const { MessageActionRow, MessageButton } = require('discord.js');

const savedProviders = async (interaction) => {
    const { channel } = interaction

    let userData = await UserData.findOne({id: interaction.user.id})
    if(!userData) {
        userData = new UserData({
            id: userId,
            name: btn.user.name,
            savedResources: [],
            savedProviders: [],
        })
    }

    let providers = await Providers.find({guild_id: channel.guild.id});

    let savedProviderTitles = []

    for(i = 0; i < userData.savedProviders.length; i++) {
        savedProviderTitles[userData.savedProviders[i]] = true;
    }

    let savedProviders = []
    for(i = 0; i < providers.length; i++) {
        if(savedProviderTitles[providers[i].data.title]) {
            savedProviders.push(new ResourceObject(providers[i], i, channel.guild))
        }
    }
    
    let directMessage = await interaction.user.send({
        content: 'Saved Providers:',
        fetchReply: true,
    })

    let pageHandler = new PageHandler(savedProviders, directMessage.channel, interaction.user.id)
    
    let doneMessageRow = new MessageActionRow().addComponents(
        new MessageButton()
            .setLabel('Done.')
            .setCustomId('done_button')
            .setStyle('DANGER')
    )

    setTimeout(async () => {
        let doneMessage = await interaction.user.send({
            content: ' ',
            components: [doneMessageRow],
            fetchReply: true,
        })

        let msgCollector = doneMessage.createMessageComponentCollector()

        msgCollector.on('collect', async (btnInt) => {
            if(btnInt.customId == 'done_button') {
                doneMessage.delete()
                directMessage.delete()
                pageHandler.clear()
            }

            let looseEnd = await btnInt.reply({
                content: 'Finished.',
                fetchReply: true
            })
            looseEnd.delete()
        })
    }, 800)
}

module.exports = savedProviders