const {MessageActionRow, MessageButton} = require("discord.js");

const itemTitle = 'Email Address:'

const addEmail = async (interaction, embedInfo) => {
    const { channel } = interaction;

    const mainMsg = await interaction.reply({
        content: 'What is the email you want you to have?',
        fetchReply: true,
    })

    const filter = (m) => {
        return m.author.id === interaction.user.id
    }

    const emailCollector = channel.createMessageCollector({
        filter,
        max: 1,
    })

    emailCollector.on('collect', async emailMsg => {
        let email = emailMsg.content;

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

        const btnFilter = (m) => {
            return interaction.user.id === m.user.id
        }

        let isEmail = await validEmail(email);
        //let isEmail = true;

        if(isEmail){       

            const btnMsg = await interaction.editReply({
                content: `${itemTitle} \'**${email}**\'`,
                components: [row],
                fetchReply: true,
            })

            const confCollector = await btnMsg.createMessageComponentCollector({
                btnFilter,
                max: 1,
            })

            confCollector.on('collect', (btnInt) => {
                if(btnInt.customId === 'continue') {
                    interaction.editReply({
                        content: 'Confimed',
                        components: [],
                    })
                    embedInfo.addEmail(email)
                } else {
                    interaction.editReply({
                        content: 'Canceled',
                        components: [],
                    })
                }

                const createProvider = require("./createProvider");
                createProvider(embedInfo.Name, btnInt, embedInfo.Guild, embedInfo);
            })

        } else {

            const errMsg = await interaction.editReply({
                content: "\nThis is not a proper email.\nFormat:\n\temail@website.com\n\nWould you like to try again try again.",
                components: [row],
                fetchReply: true,
            })

            const confCollector = errMsg.createMessageComponentCollector({
                btnFilter,
                max: 1
            })

            confCollector.on('collect', (btnInt) => {
                if(btnInt.customId === 'continue') {
                    interaction.editReply({
                        content: 'Confimed',
                        components: []
                    })
                    addEmail(btnInt, embedInfo)
                } else {
                    interaction.editReply({
                        content: 'Canceled',
                        components: []
                    })
                }
                
                const createProvider = require("./createProvider");
                createProvider(embedInfo.Name, btnInt, embedInfo.Guild, embedInfo);
            })

        }
        
    })
}

const validEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

module.exports = addEmail;