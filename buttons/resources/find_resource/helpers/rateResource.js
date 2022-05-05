const { MessageActionRow, MessageButton } = require('discord.js');
const Resources = require('../../../../models/Resource');
const buildEmbed = require('../../add_resource/helpers/buildEmbed');
const buildPreviewEmbed = require('../../add_resource/helpers/buildPreviewEmbed');
const GetClient = require('../../../../main');
const ratingModeration = require('../../../../moderation/ratingModeration');

const rateResource = async (interaction, resourceData, guild) => {
    let resource;

    let messages = [];

    let resourceList = await Resources.find({guild_id: guild.id})

    for(let i = 0; i < resourceList.length; i++) {
        if(resourceList[i].data.title == resourceData.title
            && resourceList[i].data.resourceType == resourceData.resourceType
            && resourceList[i].data.description.value === resourceData.description.value) {
            resource = resourceList[i]
        }
    }

    const row = makeButtons(-1)

    let starMsg = await interaction.reply({
        content: 'How many stars would you rate this resource?',
        components: [row],
        fetchReply: true,
    })

    messages.push(starMsg);

    const starCollector =  starMsg.createMessageComponentCollector()

    starCollector.on('collect', async (starInt) => {
        let selected = -1;

        switch(starInt.customId) {
            case 'oneStar' :
                selected = 1;
                break;
            case 'twoStar' :
                selected = 2;
                break;
            case 'threeStar' :
                selected = 3;
                break;
            case 'fourStar' :
                selected = 4;
                break;
            case 'fiveStar' :
                selected = 5;
                break;
        }

        const updatedRow = makeButtons(selected);

        starMsg = interaction.editReply({
            content: 'How many stars would you rate this resource?',
            components: [updatedRow],
            fetchReply: true,
        })

        const openEndedQuestionRow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('oEQ_yes')
                    .setLabel('Yes')
                    .setStyle('SUCCESS'),

                new MessageButton()
                    .setCustomId('oEQ_no')
                    .setLabel('No')
                    .setStyle('DANGER')
            )

        const openEndedRating = await starInt.reply({
            content: 'Is there anything else you want to say about this resource?',
            components: [openEndedQuestionRow],
            fetchReply: true,
        })

        messages.push(openEndedRating)

        const openEndedQuestionCollector = openEndedRating.createMessageComponentCollector()

        openEndedQuestionCollector.on('collect', async (oEQInt) => {
            if(oEQInt.customId == 'oEQ_yes') {
                const oerMsg = await oEQInt.reply({
                    content: 'What would you like to say?',
                    fetchReply: true
                })

                messages.push(oerMsg)

                const openEndedRatingCollector = oerMsg.channel.createMessageCollector({
                    max: 1,
                })
        
                openEndedRatingCollector.on('collect', async (ratingMsg) => {
                    let rating = ratingMsg.content;
        
                    const confRow = new MessageActionRow().addComponents(
                        new MessageButton()
                            .setCustomId('confYes')
                            .setLabel('Submit')
                            .setStyle('SUCCESS'),

                        new MessageButton()
                            .setCustomId('confNo')
                            .setLabel('Cancel')
                            .setStyle('DANGER')
                    )

                    const submitMsg = await ratingMsg.reply({
                        content: selected + ' Star review. You also said: \n' + rating + '\nWould you like to submit your review?',
                        components: [confRow],
                        fetchReply: true,
                    })

                    messages.push(submitMsg)

                    const submitConfCollector = submitMsg.createMessageComponentCollector();

                    submitConfCollector.on('collect', async (submitInt) => {
                        if(submitInt.customId == 'confYes') {
                            submit(messages, submitInt, resource, selected, rating)
                        } else {
                            let looseEnd = await submitInt.reply({
                                content: 'Canceled.',
                                fetchReply: true
                            })

                            messages.push(looseEnd)

                            setTimeout(() => {
                                messages.forEach(message => {
                                    message.delete()
                                })
                            }, 2500)
                        }
                    })
                })
            } else {
                const confRow = new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId('confYes')
                        .setLabel('Submit')
                        .setStyle('SUCCESS'),

                    new MessageButton()
                        .setCustomId('confNo')
                        .setLabel('Cancel')
                        .setStyle('DANGER')
                )

                const submitMsg = await oEQInt.reply({
                    content: selected + ' Star review.\nWould you like to submit your review?',
                    components: [confRow],
                    fetchReply: true,
                })

                messages.push(submitMsg)

                const submitConfCollector = submitMsg.createMessageComponentCollector();

                submitConfCollector.on('collect', async (submitInt) => {
                    if(submitInt.customId == 'confYes') {
                        submit(messages, submitInt, resource, selected)
                    } else {
                        let looseEnd = await submitInt.reply({
                            content: 'Canceled.',
                            fetchReply: true
                        })

                        messages.push(looseEnd)

                        setTimeout(() => {
                            messages.forEach(message => {
                                message.delete()
                            })
                        }, 2500)
                    }
                })
            }
        })

        
    })
}

const submit = (messages, interaction, resource, numRating, stringRating) => {
    if(typeof resource.ratings == 'undefined') {
        resource.ratings = []
    }

    if(typeof stringRating == 'undefined' || typeof stringRating == 'null') {
        stringRating = numRating + ' stars.'
    }

    let ratings = resource.ratings;
    let prevRating

    for(let i = 0; i < ratings.length; i++) {
        if(ratings[i].user_id == interaction.user.id) {
            prevRating = ratings[i]
            ratings.splice(i, 1)
        }
    }

    let submittedRating
    if(typeof prevRating == 'undefined') {
        newRating = {
            user_id: interaction.user.id,
            user_name: interaction.user.username,
            avgRating: numRating,
            numRating: numRating,
            stringRating: stringRating,
            prevReviews: []
        }
        submittedRating = newRating
        resource.ratings.push(submittedRating)
    } else {
        let prvReview = {
            numRating: prevRating.numRating,
            stringRating: prevRating.stringRating
        }

        prevRating.numRating = numRating
        prevRating.stringRating = stringRating
        prevRating.prevReviews.push(prvReview)

        let i = 0;
        let totalRating = numRating;
        while(i < prevRating.prevReviews.length) {
            totalRating += prevRating.prevReviews[i].numRating
            i++
        }

        prevRating.avgRating = totalRating/(i + 1)

        submittedRating = prevRating
        resource.ratings.push(submittedRating)
    }

    let i = 0
    let totalRating = 0;
    while(i < resource.ratings.length) {
        totalRating += resource.ratings[i].avgRating
        i++
    }

    let avgRating = totalRating/i;

    resource.data.color = getColor(avgRating, i)

    resource.save(async (err) => {
        if(err) {
            console.log(err);
            messages.push(await interaction.reply({
                content: 'An error has occured. Please contact the admin.',
                fetchReply: true
            }))
        } else {
            messages.push(await interaction.reply({
                content: 'Resource rating successfully submitted.',
                fetchReply: true
            }))
        }

        setTimeout(() => {
            messages.forEach(message => {
                message.delete()
            })
        }, 2500)

    })

    ratingModeration(interaction, submittedRating, resource)
}

const makeButtons = (highligted) => {
    const row = new MessageActionRow()

    if(highligted == 1) {
        row.addComponents(
            new MessageButton()
                .setLabel('⭐️')
                .setCustomId('oneStar')
                .setStyle('SUCCESS')
        )
    } else {
        row.addComponents(
            new MessageButton()
                .setLabel('⭐️')
                .setCustomId('oneStar')
                .setStyle('PRIMARY')
        )
    }

    if(highligted == 2) {
        row.addComponents(
            new MessageButton()
                .setLabel('⭐️⭐️')
                .setCustomId('twoStar')
                .setStyle('SUCCESS')
        )
    } else {
        row.addComponents(
            new MessageButton()
                .setLabel('⭐️⭐️')
                .setCustomId('twoStar')
                .setStyle('PRIMARY')
        )
    }

    if(highligted == 3) {
        row.addComponents(
            new MessageButton()
                .setLabel('⭐️⭐️⭐️')
                .setCustomId('threeStar')
                .setStyle('SUCCESS')
        )
    } else {
        row.addComponents(
            new MessageButton()
                .setLabel('⭐️⭐️⭐️')
                .setCustomId('threeStar')
                .setStyle('PRIMARY')
        )
    }

    if(highligted == 4) {
        row.addComponents(
            new MessageButton()
                .setLabel('⭐️⭐️⭐️⭐️')
                .setCustomId('fourStar')
                .setStyle('SUCCESS')
        )
    } else {
        row.addComponents(
            new MessageButton()
                .setLabel('⭐️⭐️⭐️⭐️')
                .setCustomId('fourStar')
                .setStyle('PRIMARY')
        )
    }
        
    if(highligted == 5) {
        row.addComponents(
            new MessageButton()
                .setLabel('⭐️⭐️⭐️⭐️⭐️')
                .setCustomId('fiveStar')
                .setStyle('SUCCESS')
        )
    } else {
        row.addComponents(
            new MessageButton()
                .setLabel('⭐️⭐️⭐️⭐️⭐️')
                .setCustomId('fiveStar')
                .setStyle('PRIMARY')
        )
    }

    return row
}

const getColor = (rating, numRatings) => {
    const red = '#FF0000';
    const yellow = '#FFFF00'
    const green = '#00FF00';
    const grey = '#808080';

    /*
    console.log('Red: ' + red + '\n' +
                'Yellow: ' + yellow + '\n' +
                'Green: ' + green + '\n' +
                'Grey: ' + grey + '\n' +
                'Rating: ' + rating + '\n' +
                'Number of Ratings: ' + numRatings)
    */

    let ratingPercent = (rating / 5.0) - 0.1

    //console.log('Rating Percent:' + ratingPercent)

    let ratingColor
    if(ratingPercent < 0.5) {
        ratingColor = blendColors(red, yellow, ratingPercent * 2)
    } else {
        ratingColor = blendColors(yellow, green, (ratingPercent - 0.5) * 2)
    }

    //console.log('Rating Color: ' + ratingColor)

    if(numRatings < 5) {
        let geryblend = (numRatings / 5.0) - 0.1

        //console.log('Percent rating showing: ' + geryblend)

        ratingColor = blendColors(grey, ratingColor, geryblend)
    }

    //console.log('Final Rating Color: ' + ratingColor)

    return ratingColor
}

const blendColors = (color1, color2, percentage) => {
    //console.log('Percent of color 2 mixed in:' + percentage)

    color1RGB = [parseInt(color1[1] + color1[2], 16), parseInt(color1[3] + color1[4], 16), parseInt(color1[5] + color1[6], 16)];
    color2RGB = [parseInt(color2[1] + color2[2], 16), parseInt(color2[3] + color2[4], 16), parseInt(color2[5] + color2[6], 16)];

    let color3RGB = [ 
        (1 - percentage) * color1RGB[0] + percentage * color2RGB[0], 
        (1 - percentage) * color1RGB[1] + percentage * color2RGB[1], 
        (1 - percentage) * color1RGB[2] + percentage * color2RGB[2]
    ];

    let color3 = '#' + intToHex(color3RGB[0]) + intToHex(color3RGB[1]) + intToHex(color3RGB[2]);

    return color3
}

const intToHex = (num) => {
    let hex = Math.round(num).toString(16);
    if (hex.length == 1)
        hex = '0' + hex;
    return hex;
}

module.exports = rateResource;