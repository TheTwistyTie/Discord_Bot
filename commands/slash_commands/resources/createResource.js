const {MessageActionRow, MessageButton, MessageEmbed} = require("discord.js");


const createResource = async ({resourceType: resourceType, interaction: interaction, resources: resources, embedInfo: oldEmbedInfo}) => {
    const { channel } = interaction;
    const guild = channel.guild;

    let embedInfo;
    if(!oldEmbedInfo) {
        embedInfo = new EmbedInfo(resourceType)
    } else {
        embedInfo = oldEmbedInfo;
    }

    let titleButton;
    if(embedInfo.fields[0].name === 'Default Title.') {
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
    if(embedInfo.fields[0].value === 'Default Description.') {
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
            new MessageButton()
                .setLabel('Change the Color')
                .setCustomId('change_color')
                .setStyle('SECONDARY'),
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

    const embed = previewEmbed(embedInfo);
    const componentRows = [];
    componentRows.push(titleRow);
    componentRows.push(compRowOne);
    componentRows.push(compRowTwo);
    componentRows.push(finRow);

    const preview = await interaction.reply({
        content: 'Resource Preview:',
        components: componentRows,
        embeds: [embed],
        ephemeral: true,
        fetchReply: true,
    })

    const filter = (int) => {
        return int.user.id === interaction.user.id;
    }

    const btnCollector = preview.createMessageComponentCollector({
        filter,
        max: 1,
    })

    btnCollector.on('collect', btnInt => {

        if (btnInt.customId === 'finish') {
            interaction.editReply({
                content: 'Submitting Resource...',
                components: [],
                embeds: [],
            })
            //Code Submitting a resource to the database

        } else if(btnInt.customId === 'cancel') {
            interaction.editReply({
                content: 'Canceled',
                components: [],
                embeds: [],
            })
        } else {
            interaction.editReply({
                content: 'Updating Resource...',
                components: [],
                embeds: [],
            })
        }

        switch(btnInt.customId) {
            case 'change_title':
                resourseName(embedInfo, btnInt, resources);
                break;
            case 'change_description':
                    resourseDescription(embedInfo, btnInt, resources);
                    break;
            case 'change_color':
                changeColor(embedInfo, btnInt, resources);
                break;
            case 'add_url':
                addUrl(embedInfo, btnInt, resources);
                break;
            case 'add_image':
                addImage(embedInfo, btnInt, resources);
                break;
            case 'add_phone_number':
                addPhoneNumber(embedInfo, btnInt, resources);
                break;
            case 'add_email':
                addEmail(embedInfo, btnInt, resources);
                break;
            case 'add_address':
                addAddress(embedInfo, btnInt, resources);
                break;

        }

    })
}

const previewEmbed = (embedInfo) => {

    let newEmbed = new MessageEmbed();

    if(typeof embedInfo.color !== 'undefined'){
        newEmbed.setColor(embedInfo.color);
    }
    else{
        newEmbed.setColor('#ab0b00');
    }

    if(typeof embedInfo.title !== 'undefined'){
        newEmbed.setTitle(embedInfo.title);
    } else {
        newEmbed.setTitle('Error setting title.');
    }

    if(typeof embedInfo.description !== 'undefined'){
        newEmbed.setDescription(embedInfo.description);
    } else {
        //newEmbed.setDescription('Error setting description.');
    }


    if(typeof embedInfo.url !== 'undefined'){
        newEmbed.setURL(embedInfo.url);
    }

    if(typeof embedInfo.fields !== 'undefined'){
        newEmbed.setFields(embedInfo.fields);
    }

    if(typeof embedInfo.image !== 'undefined'){
        newEmbed.setImage(embedInfo.image);
    }

    return newEmbed
}

module.exports = createResource