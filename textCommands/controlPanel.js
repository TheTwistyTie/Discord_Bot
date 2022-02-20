const { MessageActionRow, MessageButton } = require("discord.js");
const roles = require("../buttons/roles")

const controlPanel = (channel) => {

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('roles')
                .setLabel('Change Roles')
                .setStyle('PRIMARY'),

            new MessageButton()
                .setCustomId('resources')
                .setLabel('Resources')
                .setStyle('PRIMARY'),

            new MessageButton()
                .setCustomId('providers')
                .setLabel('Providers')
                .setStyle('PRIMARY'),
        )

    channel.send({
        content: '**Welcome to the control panel!**\n\nHere you can set your roles, view resources, find providers, and more!',
        components: [row]
    })
}

module.exports = controlPanel