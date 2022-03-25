const { MessageActionRow, MessageButton } = require("discord.js")
const UserData = require('../models/User');
const GuildSettings = require('../models/GuildSettings')
const addProvider = require('./providers/add_provider/addProvider')
const findProvider = require('./providers/find_provider/findProvider')

const providers = async (interaction) => {
    const findButton = new MessageButton()
        .setCustomId('find')
        .setLabel('Find new provider!')
        .setStyle('PRIMARY')
        
    let savedButton;
    if(await hasSaved(interaction.user)) {
        savedButton = new MessageButton()
        .setCustomId('saved')
        .setLabel('View saved providers!')
        .setStyle('PRIMARY')
    } else {
        savedButton = new MessageButton()
        .setCustomId('saved')
        .setLabel('View saved providers!')
        .setStyle('SECONDARY')
        .setDisabled(true)
    }

    const row = new MessageActionRow()
        .addComponents(
            findButton,
            savedButton
        )

    //if user has roles partner, provider, staff, or admin have button that lets you add a resource. 
    const addable = await canAddNew(interaction)
    if(addable) {
        row.addComponents(
            new MessageButton()
                .setCustomId('newProvider')
                .setLabel('Add new provider')
                .setStyle('PRIMARY')
        )
    }

    const msg = await interaction.reply({
        content: 'Resources:',
        components: [row],
        ephemeral: true,
        fetchReply: true,
    })

    const collector = msg.createMessageComponentCollector()

    collector.on('collect', int => {
        switch(int.customId) {
            case 'find':
                findProvider(int)
                break;
            case 'saved':
                savedProvider(int)
                break;
            case 'newProvider':
                addProvider(int)
                break;
        }
    })
}

const hasSaved = async (user) => {
    let userData = await UserData.findOne({id: user.id})
    if(!userData) {
        userData = new UserData({
            id: user.id,
            name: user.name,
            savedResources: [],
            savedProviders: [],
        })
    }

    if(userData.savedProviders.length > 0) {
        return true;
    } else {
        return false;
    }

}

const canAddNew = async (interaction) => {

    const guildSettings = await GuildSettings.findOne({guild_id: interaction.guild.id})
    const approvedRoles = guildSettings.resourceAdder
    if(!approvedRoles) {
        console.log('Failed to find roles apporved to add providers.')
        return false
    }

    let i = 0;
    let canAdd = false;
    while(!canAdd && i < approvedRoles.length) {
        if(interaction.member.roles.cache.has(approvedRoles[i])) {
            canAdd = true;
        }
        i++;
    }

    return canAdd
}

module.exports = providers