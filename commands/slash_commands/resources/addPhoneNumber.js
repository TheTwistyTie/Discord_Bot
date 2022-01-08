const {MessageActionRow, MessageButton} = require("discord.js");

const itemTitle = 'Phone Number:'

const addPhoneNumber = async (interaction, embedInfo) => {
    const { channel } = interaction;

    const mainMsg = await interaction.reply({
        content: 'What is the phone number you want your resource to have?',
        ephemeral: true,
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

        await numberMsg.delete()

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
                ephemeral: true,
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
                        ephemeral: true,
                    })
                    embedInfo.addPhoneNumber()
                } else {
                    interaction.editReply({
                        content: 'Canceled',
                        components: [],
                        ephemeral: true,
                    })
                }

                const createResource = require("./createResource");
                createResource(embedInfo.resourceType, btnInt, embedInfo);
            })

        } else {

            const errMsg = await interaction.editReply({
                content: "\nThis is not a proper phone number.\nFormats:\n\t(123) 456-7890\n\t(123)456-7890\n\t123-456-7890\n\t123.456.7890\n\nWould you like to try again try again.",
                components: [row],
                ephemeral: true,
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

                const createResource = require("./createResource");
                createResource(embedInfo.resourceType, btnInt, embedInfo);
            })

        }
        
    })
}

const validNumber = (string) => {
    const tester = (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im);
    return tester.test(string);
}

module.exports = addPhoneNumber;