const {MessageActionRow, MessageButton} = require("discord.js");

const itemTitle = 'Phone Number:'

const addPhoneNumber = async (interaction, embedInfo) => {
    const { channel } = interaction;

    const mainMsg = await interaction.reply({
        content: 'What is the phone number you want to have?',
        fetchReply: true,
    })

    const filter = (m) => {
        return m.author.id === interaction.user.id
    }

    const numberCollector = channel.createMessageCollector({
        filter,
        max: 1,
    })

    numberCollector.on('collect', async numberMsg => {
        let number = numberMsg.content;

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

        let isNumber = await validNumber(number);
        //let isNumber = true;

        if(isNumber){       

            const btnMsg = await interaction.editReply({
                content: `${itemTitle} \'**${number}**\'`,
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
                    embedInfo.addPhoneNumber(number)
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
                content: "\nThis is not a proper phone number.\nFormats:\n\t(123) 456-7890\n\t(123)456-7890\n\t123-456-7890\n\t123.456.7890\n\nWould you like to try again try again.",
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
                    addPhoneNumber(btnInt, embedInfo)
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

const validNumber = (string) => {
    const tester = (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im);
    return tester.test(string);
}

module.exports = addPhoneNumber;