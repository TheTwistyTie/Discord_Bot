const {MessageActionRow, MessageButton} = require("discord.js");
const EmbedInfo = require('./EmbedInfo');
const addUrl = require("./addUrl");
const addImage = require("./addImage");
const resourceName = require("./resourceName");
const resourceDescription = require("./resourceDescription");
const addPhoneNumber = require("./addPhoneNumber");
const addEmail = require("./addEmail");
const addAddress = require("./addAddress");
const colorCheck = require('./colorCheck');

let preview;
let btnCollector;

const createResource = async (resourceType, interaction, oldEmbedInfo) => {
    const { channel } = interaction;
    const guild = channel.guild;

    const color = await colorCheck(resourceType, channel.guild.id)

    let embedInfo
    if(!oldEmbedInfo){
        embedInfo = new EmbedInfo(resourceType, color);
    } else {
        embedInfo = oldEmbedInfo;
    }
    
    const rows = makeMessage(embedInfo)
    preview = await interaction.reply({
        content: 'Resource Preview:',
        components: rows,
        embeds: [embedInfo.buildEmbed()],
        ephemeral: true,
        fetchReply: true,
    }) 
    
    const filter = (int) => {
        return int.user.id === interaction.user.id;
    }

    btnCollector = preview.createMessageComponentCollector({
        filter,
        max: 1,
    })

    btnCollector.on('collect', async btnInt => {
    
        if (btnInt.customId === 'finish') {
            interaction.editReply({
                content: 'Submitting Resource...',
                components: [],
                embeds: [],
            })
            embedInfo.submit(btnInt)
            btnCollector.stop()
        } else if(btnInt.customId === 'cancel') {
            interaction.editReply({
                content: 'Canceled',
                components: [],
                embeds: [],
            })
            btnCollector.stop()
        } else {
            let contentText;
            switch(btnInt.customId) {
                case 'change_title':
                    contentText = 'Changing the title...'
                    resourceName(btnInt, embedInfo)
                    break;
                case 'change_description':
                    contentText = 'Changing the description...'
                    resourceDescription(btnInt, embedInfo);
                    break;
                case 'add_url':
                    contentText = 'Adding a URL...'
                    addUrl(btnInt, embedInfo);
                    break;
                case 'add_image':
                    contentText = 'Adding an image...'
                    addImage(btnInt, embedInfo);
                    break;
                case 'add_phone_number':
                    contentText = 'Adding a phone number...'
                    addPhoneNumber(btnInt, embedInfo);
                    break;
                case 'add_email':
                    contentText = 'Adding an email address...'
                    addEmail(btnInt, embedInfo);
                    break;
                case 'add_address':
                    contentText = 'Adding an address...'
                    addAddress(btnInt, embedInfo);
                    break;
            }
            interaction.editReply({
                content: contentText,
                components: [],
                embeds: [],
            })
        }
    })
}

const makeMessage = (embedInfo) => {
    let titleButton;
    if(embedInfo.getResourceName() === 'Default Title.') {
        titleButton = new MessageButton()
            .setLabel('Set the Title')
            .setCustomId('change_title')
            .setStyle('PRIMARY')
    } else {
        titleButton = new MessageButton()
            .setLabel('Change the Title')
            .setCustomId('change_title')
            .setStyle('SECONDARY')
    }

    let descButton;
    if(embedInfo.getResourceDescription() === 'Default Description.') {
        descButton = new MessageButton()
            .setLabel('Set the Description')
            .setCustomId('change_description')
            .setStyle('PRIMARY')
    } else {
        descButton = new MessageButton()
            .setLabel('Change the Description')
            .setCustomId('change_description')
            .setStyle('SECONDARY')
    }

    const titleRow = new MessageActionRow()
        .addComponents(
            titleButton,
            descButton,
        )

    let urlButton;
    if(!embedInfo.url) {
        urlButton = new MessageButton()
            .setLabel('Add a link')
            .setCustomId('add_url')
            .setStyle('SECONDARY')
    } else {
        urlButton = new MessageButton()
            .setLabel('Change the link')
            .setCustomId('add_url')
            .setStyle('SECONDARY')
    }

    let imgButton;
    if(!embedInfo.image) {
        imgButton = new MessageButton()
            .setLabel('Add an image.')
            .setCustomId('add_image')
            .setStyle('SECONDARY')
    } else {
        imgButton = new MessageButton()
            .setLabel('Change the image')
            .setCustomId('add_image')
            .setStyle('SECONDARY')
    }

    const compRowOne = new MessageActionRow()
        .addComponents(
            urlButton,
            imgButton,
        )

    let numButton;
    if(embedInfo.index('Phone Number:') === -1) {
        numButton = new MessageButton()
            .setLabel('Add a phone number.')
            .setCustomId('add_phone_number')
            .setStyle('SECONDARY')
    } else {
        numButton = new MessageButton()
            .setLabel('Change the phone number.')
            .setCustomId('add_phone_number')
            .setStyle('SECONDARY')
    }

    let emailButton;
    if(embedInfo.index('Email Address:') === -1) {
        emailButton = new MessageButton()
            .setLabel('Add an email address.')
            .setCustomId('add_email')
            .setStyle('SECONDARY')
    } else {
        emailButton = new MessageButton()
            .setLabel('Change the email address.')
            .setCustomId('add_email')
            .setStyle('SECONDARY')
    }

    let addressButton;
    if(embedInfo.index('Address:') === -1) {
        addressButton = new MessageButton()
            .setLabel('Add an address.')
            .setCustomId('add_address')
            .setStyle('SECONDARY')
    } else {
        addressButton = new MessageButton()
            .setLabel('Change the address.')
            .setCustomId('add_address')
            .setStyle('SECONDARY')
    }

    const compRowTwo = new MessageActionRow()
        .addComponents(
            numButton,
            emailButton,
            addressButton,
        )

    const finRow = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setLabel('Finish')
                .setStyle('SUCCESS')
                .setCustomId('finish'),
            new MessageButton()
                .setLabel('Cancel')
                .setStyle('DANGER')
                .setCustomId('cancel'),
        )

    return [titleRow, compRowOne, compRowTwo, finRow]
}

module.exports = createResource