const {MessageActionRow, MessageButton} = require("discord.js");

const addUrl = async (interaction, embedInfo) => {
    const { channel } = interaction;

    const mainMsg = await interaction.reply({
        content: 'What is the url you want your resource to link to?',
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

        if(!isUrl){
            if(validURL('https://' + url)){
                url = 'https://' + url
                isUrl = true;
            }
        }

        if(isUrl){       
            const btnMsg = await interaction.editReply({
                content: `Links to: \'**${url}**\'`,
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
                    embedInfo.setUrl(url)
                } else {
                    interaction.editReply({
                        content: 'Canceled',
                        components: [],
                    })
                }

                const createResource = require("./createResource");
                createResource(embedInfo.resourceType, btnInt, embedInfo.Guild, embedInfo);
            })

        } else {

            const errMsg = await interaction.editReply({
                content: "This is not a proper URL. Format: \'https://website.com/page\'\n\nWould you like to try again.",
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
                        components: [],
                    })
                    addUrl(btnInt, embedInfo)
                } else {
                    interaction.editReply({
                        content: 'Canceled',
                        components: [],
                    })
                }
                const createResource = require("./createResource");
                createResource(embedInfo.resourceType, btnInt, embedInfo.Guild, embedInfo);
            })

        }
        
    })
}

const validURL = (string) => {
    let res = false;

    if(string.startsWith('https://')) {
        const tester = (/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        res = tester.test(string);
    }

    return res
}

module.exports = addUrl;