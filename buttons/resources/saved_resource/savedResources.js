const UserData = require('../../../models/User');
const Resources = require('../../../models/Resource');
const PageHandler = require('../find_resource/helpers/PageHandler')
const ResourceObject = require('../find_resource/helpers/ResourceObject');

const savedResource = async (interaction) => {
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

    let resources = await Resources.find({guild_id: channel.guild.id});
    resources.reverse()

    let savedResourceTitles = []

    for(i = 0; i < userData.savedResources.length; i++) {
        savedResourceTitles[userData.savedResources[i].title] = true;
    }

    let savedResources = []
    for(i = 0; i < resources.length; i++) {
        if(savedResourceTitles[resources[i].data.title]) {
            savedResources.push(new ResourceObject(resources[i].data, i, channel.guild))
        }
    }

    const directMessage = await interaction.user.send({
        content: 'Saved Resources:',
        fetchReply: true,
    })

    let pageHandler = new PageHandler(savedResources, directMessage.channel, interaction.user.id)

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

module.exports = savedResource