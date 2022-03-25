const Resources = require('../../../../models/ResourceSettings');
const {MessageActionRow, MessageButton} = require("discord.js");

const addNewLanguage = async (interaction, languages, embedInfo) => {
    let resources;
    resources = await Resources.findOne({guild_id: embedInfo.Guild.id});
    
    await interaction.reply({
        content: 'What new language would you like to add?',
    })

    const filter = (m) => {
        return interaction.user.id === m.author.id
    }

    const collector = channel.createMessageCollector({
        filter,
        max: 1
    })

    collector.on('collect', async message => {
        resources.languages.push(`${message.content}`)
        languages.push(message.content)

        const index = languages.indexOf('add_new');
        if (index > -1) {
            languages.splice(index, 1);
        }

        resources.save(async err => {
            if(err) {
                console.log(err);
                message.reply({
                    content: 'An Issue has occured.',
                }).then((msg) => {
                    setTimeout(() => {
                        msg.delete()
                    }, 2000);
                });
                return;
            }

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

            let langContentText = `Added Language: \'**${message.content}**\'`
            langContentText += '\n\nLanguage selection is:\n'
            
            let langText = ''
            for(i = 0; i < languages.length; i++) {
                langContentText += languages[i] + '\n'
                langText += languages[i] + '\n'
            }

            const btnMsg = await interaction.editReply({
                content: langContentText,
                components: [row],
                fetchReply: true,
            })

            const btnFilter = (m) => {
                return interaction.user.id === m.user.id
            }

            const confCollector = btnMsg.createMessageComponentCollector({
                btnFilter,
                max: 1
            })

            confCollector.on('collect', (btnInt) => {
                if(btnInt.customId === 'continue') {
                    interaction.editReply({
                        content: 'Added New Language.',
                        components: [],
                    })
                    embedInfo.addLanguages(langText)
                } else {
                    interaction.editReply({
                        content: 'Canceled.',
                        components: [],
                    })
                }

                const createProvider = require('./createProvider');
                createProvider(embedInfo.Name, btnInt, embedInfo.Guild, embedInfo)
            })
        })
    })
}

module.exports = addNewLanguage;