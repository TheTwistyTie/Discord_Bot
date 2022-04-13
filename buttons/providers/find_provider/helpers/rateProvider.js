const { MessageActionRow, MessageButton } = require('discord.js');
const Providers = require('../../../../models/Providers');
const buildEmbed = require('../../add_provider/helpers/buildEmbed');
const buildPreviewEmbed = require('../../add_provider/helpers/buildPreviewEmbed');
const getColor = require('./getColor')

const rateProvider = async (interaction, providerData, guild) => {
    let provider;

    let messages = [];

    let providerList = await Providers.find({guild_id: guild.id})

    for(let i = 0; i < providerList.length; i++) {
        if(providerList[i].data.title == providerData.title
            && providerList[i].data.description.value === providerData.description.value) {
            provider = providerList[i]
        }
    }

    const row = makeButtons(-1)

    let starMsg = await interaction.reply({
        content: 'How many stars would you rate this provider?',
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
            content: 'How many stars would you rate this provider?',
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
            content: 'Is there anything else you want to say about this provider?',
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
                            submit(messages, submitInt, provider, selected, rating)
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
                        submit(messages, submitInt, provider, selected)
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

const submit = (messages, interaction, provider, numRating, stringRating) => {
    if(typeof provider.ratings == 'undefined') {
        provider.ratings = []
    }

    if(typeof stringRating == 'undefined' || typeof stringRating == 'null') {
        stringRating = numRating + ' stars.'
    }

    let ratings = provider.ratings;
    let prevRating

    for(let i = 0; i < ratings.length; i++) {
        if(ratings[i].user_id == interaction.user.id) {
            prevRating = ratings[i]
            ratings.splice(i, 1)
        }
    }

    if(typeof prevRating == 'undefined') {
        newRating = {
            user_id: interaction.user.id,
            user_name: interaction.user.username,
            avgRating: numRating,
            numRating: numRating,
            stringRating: stringRating,
            prevReviews: []
        }

        provider.ratings.push(newRating)
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

        provider.ratings.push(prevRating)
    }

    let i = 0
    let totalRating = 0;
    while(i < provider.ratings.length) {
        totalRating += provider.ratings[i].avgRating
        i++
    }

    let avgRating = totalRating/i;

    provider.data.color = getColor(avgRating, i)

    provider.save(async (err) => {
        if(err) {
            console.log(err);
            messages.push(await interaction.reply({
                content: 'An error has occured. Please contact the admin.',
                fetchReply: true
            }))
        } else {
            messages.push(await interaction.reply({
                content: 'Provider rating successfully submitted.',
                fetchReply: true
            }))
        }

        setTimeout(() => {
            messages.forEach(message => {
                message.delete()
            })
        }, 2500)

    })
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

module.exports = rateProvider