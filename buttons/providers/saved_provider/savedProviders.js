const UserData = require('../../../models/User');
const Providers = require('../../../models/Providers');
const PageHandler = require('../find_provider/helpers/PageHandler')
const ResourceObject = require('../find_provider/helpers/ResourceObject');

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

    for(i = 0; i < userData.savedResources.length; i++) {
        savedProviderTitles[userData.savedProviders[i]] = true;
    }

    let savedProviders = []
    for(i = 0; i < providers.length; i++) {
        if(savedProviderTitles[providers[i].data.embedData.title]) {
            savedProviders.push(new ResourceObject(providers[i], i, channel.guild))
        }
    }

    const directMessage = await interaction.user.send({
        content: 'Saved Providers:',
        fetchReply: true,
    })

    let looseEnd = await interaction.reply({
        content: 'Button Clicked...',
        fetchReply: true
    })
    looseEnd.delete()

    let pageHandler = new PageHandler(savedProviders, directMessage.channel, interaction.user.id)
}

module.exports = savedProviders