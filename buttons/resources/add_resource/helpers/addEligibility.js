const {MessageActionRow, MessageButton} = require("discord.js");

const itemTitle = 'Eligibility:'

const addEligibility = async (interaction, embedInfo) => {
    const { channel } = interaction;

    const mainMsg = await interaction.reply({
        content: 'What requirements must someone meet in order to be eligible for this resource?\n\t*Press (Shift + Enter) for a new line.\n\tPress (Enter) to submit.*',
        fetchReply: true,
    })

    const filter = (m) => {
        return m.author.id === interaction.user.id
    }

    const eligibilityCollector = channel.createMessageCollector({
        filter,
        max: 1,
    })

    eligibilityCollector.on('collect', async eligibilityMsg => {
        const eligibility = eligibilityMsg.content;
        
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

        const btnMsg = await interaction.editReply({
            content: `${itemTitle} \n\'**${eligibility}**\'`,
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
                embedInfo.addEligibility(eligibility)
            } else {
                interaction.editReply({
                    content: 'Canceled',
                    components: [],
                })
            }

            const createResource = require("./createResource");
            createResource(embedInfo.resourceType, btnInt, embedInfo);
        })
    })
}

module.exports = addEligibility;