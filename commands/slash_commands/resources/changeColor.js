const {MessageActionRow, MessageButton} = require("discord.js");

const changeColor = async (embedInfo, interaction, resources) => {
    const { channel } = interaction;

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setLabel('Click for help with Hex Colors')
                .setStyle('LINK')
                .setURL('https://www.google.com/search?q=hex+color+picker')
        )

    const colorMsg = await interaction.reply({
        content: 'Using Hex colors, what would you like the color to be?',
        components: [row],
        ephemeral: true,
        fetchReply: true,
    })

    const filter = (m) => {
        return m.author.id === interaction.user.id
    }

    const colorCollector = channel.createMessageCollector({
        filter,
        max: 1
    })

    colorCollector.on('collect', async colorMsg => {
        
        let color = colorMsg.content;
        
        await colorMsg.delete()
        
        const confRow = new MessageActionRow()
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

        let formatCheck = /^#[0-9A-F]{6}$/i;

        let isColor = formatCheck.test(color)

        if(!isColor){
            if(formatCheck.test('#' + color)){
                color = '#' + color
                isColor = true;
            }
        }

        if(isColor){
            const btnMsg = await interaction.editReply({
                content: `Color entered as: \'**${color}**\'`,
                components: [confRow],
                ephemeral: true,
                fetchReply: true,
            })

            const confCollector = await btnMsg.createMessageComponentCollector({
                btnFilter,
                max: 1
            })

            confCollector.on('collect', (btnInt) => {

                console.log('button hit')

                if(btnInt.customId === 'continue') {
                    embedInfo.color = color;
                    interaction.editReply({
                        content: 'Confimed',
                        components: [],
                        ephemeral: true,
                    })
                } else {
                    interaction.editReply({
                        content: 'Canceled',
                        components: [],
                        ephemeral: true
                    })
                }

                const createResource = require('./createResource');
                createResource(embedInfo.description, btnInt, resources, embedInfo)
            })

        } else {

            const errMsg = await interaction.editReply({
                content: "This is not a proper color. Format: \'#00ff00\'\nWould you like to try again.",
                components: [confRow],
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
                        components: [],
                        ephemeral: true,
                    })
                    changeColor(embedInfo, btnInt, resources)
                } else {
                    interaction.editReply({
                        content: 'Canceled',
                        components: [],
                        ephemeral: true,
                    })
                    const createResource = require('./createResource');
                    createResource(embedInfo.description, btnInt, resources, embedInfo)
                }
                
            })

        }
    })
}

module.exports = changeColor;