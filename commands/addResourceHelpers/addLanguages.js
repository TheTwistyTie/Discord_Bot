const {MessageActionRow, MessageButton, MessageSelectMenu} = require("discord.js");
const Resources = require('../../models/ResourceSettings');
const addNewLanguage = require("./newLanguageType");

const itemTitle = 'Languages:'

const addLanguages = async (interaction, embedInfo) => {
    const { channel } = interaction

    let resources;
    resources = await Resources.findOne({guild_id: channel.guild.id});

    let languages = [];
    for(i = 0; i < resources.languages.length; i++) {
        languages.push({
            label: resources.languages[i],
            value: resources.languages[i],
        })
    }

    languages.push({
        label: 'Add new language.',
        value: 'add_new',
    })

    const row = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('language_options')
                .setPlaceholder('Select languages:')
                .setOptions(languages)
                .setMinValues(1)
                .setMaxValues(languages.length - 1)
        )

    const mainMsg = await interaction.reply({
        content: 'What languages is your resourse able to support?',
        components: [row],
        ephemeral: true,
        fetchReply: true,
    })

    const filter = (m) => {
        return m.user.id === interaction.user.id
    }

    const languagesCollector = channel.createMessageComponentCollector({
        filter,
        max: 1,
    })

    languagesCollector.on('collect', async languagesInt => {
        let languages = languagesInt.values;

        if(languages.includes('add_new')) {

            await interaction.editReply({
                content: 'Adding new language option...',
                components: [],
            })
            addNewLanguage(languagesInt, languages, embedInfo)

        } else {

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

            let langContentText = `${itemTitle}`
            langContentText += '\n'
            
            let langText = ''
            for(i = 0; i < languages.length; i++) {
                langContentText += languages[i] + '\n'
                langText += languages[i] + '\n'
            }

            await interaction.editReply({
                content: 'Selected languages.',
                components: [],
            })
            const btnMsg = await languagesInt.reply({
                content: langContentText,
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
                    languagesInt.editReply({
                        content: 'Confimed',
                        components: [],
                        ephemeral: true,
                    })
                    embedInfo.addLanguages(langText)
                } else {
                    languagesInt.editReply({
                        content: 'Canceled',
                        components: [],
                        ephemeral: true,
                    })
                }

                const createResource = require("./createResource");
                createResource(embedInfo.resourceType, btnInt, embedInfo);
            })

        }
    })
}

module.exports = addLanguages;