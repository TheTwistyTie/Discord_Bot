const {SlashCommandBuilder} = require('@discordjs/builders')
const UserData = require('../models/User');
const Resources = require('../models/Resource');
const PageHandler = require('./findResourceHelpters/PageHandler')
const ResourceObject = require('./findResourceHelpters/ResourceObject');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('savedresouces')
        .setDescription('View your saved resources.'),

    async execute(interaction) {
        const { channel } = interaction

        let userData = await UserData.findOne({id: interaction.user.id})
        if(!userData) {
            userData = new UserData({
                id: userId,
                name: btn.user.name,
                savedResources: [],
            })
        }

        let resources = await Resources.find({guild_id: channel.guild.id});
        resources.reverse()

        let savedResourceTitles = []

        for(i = 0; i < userData.savedResources.length; i++) {
            savedResourceTitles[userData.savedResources[i]] = true;
        }

        let savedResources = []
        for(i = 0; i < resources.length; i++) {
            if(savedResourceTitles[resources[i].data.embedData.title]) {
                savedResources.push(new ResourceObject(resources[i].data))
            }
        }

        let pageHandler = new PageHandler(savedResources, channel, interaction.user.id)
    }
}