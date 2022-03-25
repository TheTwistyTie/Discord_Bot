const {MessageActionRow, MessageButton} = require("discord.js");
const linkToProvider = require("./helpers/linkToProvider");
const typeOfResource = require("./helpers/typeOfResource");

const addResource = async (interaction) => {
    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('provider_yes')
                .setLabel('Yes!')
                .setStyle('SUCCESS'),

            new MessageButton()
                .setCustomId('provider_no')
                .setLabel('No.')
                .setStyle('DANGER')
        )
        
   const providerQuestionMsg = await interaction.user.send({
       content: 'Is this resource linked to a specific provider?',
       components: [row],
       fetchReply: true,
   })

   const looseEnd = await interaction.reply({
       content: 'button clicked...',
       fetchReply: true
   })

   looseEnd.delete()

   const providerQuestionCollector = providerQuestionMsg.createMessageComponentCollector()
   providerQuestionCollector.on('collect', async (btnInt) => {
       const {customId} = btnInt;

       if(customId == 'provider_yes') {
            linkToProvider(btnInt, interaction.guild)
       } else if (customId == 'provider_no') {
            typeOfResource(btnInt, interaction.guild)
       }
   })
}

module.exports = addResource;