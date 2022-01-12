const {MessageActionRow, MessageButton} = require("discord.js");

const addImage = async (interaction, embedInfo) => {
    const { channel } = interaction;

    const mainMsg = await interaction.reply({
        content: 'What is the url of the image you want your resource to have?',
        ephemeral: true,
        fetchReply: true,
    })

    const filter = (m) => {
        return m.author.id === interaction.user.id
    }

    const urlCollector = channel.createMessageCollector({
        filter,
        max: 1,
    })

    urlCollector.on('collect', async urlMsg => {
        let url = urlMsg.content;

        await urlMsg.delete()

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

        let isUrl = await validURL(url);
        //let isUrl = true;

        if(!isUrl){
            if(validURL('https://' + url)){
                url = 'https://' + url
                isUrl = true;
            }
        }

        if(isUrl){       

            const btnMsg = await interaction.editReply({
                content: `Image URL: \'**${url}**\'`,
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
                    embedInfo.setImage(url)
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
                content: "\nThis is not a proper URL\tFormat: \'https://website.com/imgage.png\'\n*Please make sure that your URL ends with .png, .jpg, .jpeg, or .gif*\n\nWould you like to try again try again.",
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
                    addImage(btnInt, embedInfo)
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

const validURL = (string) => {
    const imageEndings = [
        'png', 'jpg', 'jpeg', 'gif' 
    ]

    let res = false;

    if(string.startsWith('https://')) {
        if(imageEndings.some((ending) => {
            return string.endsWith(ending);
        })) {
            const tester = (/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
            res = tester.test(string);
        }
    }

    return res
}

module.exports = addImage;