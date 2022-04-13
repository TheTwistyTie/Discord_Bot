const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const RatingObject = require("./RatingObject");

const seeRatings = async (interaction, ratings) => {
    if(ratings.length >= 1) {
        let embedObjects = [];
        ratings.forEach(rating => {
            let {avgRating, stringRating} = rating

            let newEmbed = new MessageEmbed()
                .setTitle(avgRating + ' Stars!')
                .setDescription(stringRating)
                .setColor(getColor(avgRating))

            embedObjects.push(new RatingObject(newEmbed))
        });

        const titleMsg = await interaction.user.send({
            content: '**Ratings:**',
            fetchReply: true,
        })

        const PageHandler = require("./PageHandler");
        const handler = new PageHandler(embedObjects, interaction.channel, interaction.user.id)

        let row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('done')
                    .setLabel('Done')
                    .setStyle('DANGER')
            )

        setTimeout (async () => {
            let doneMsg = await interaction.reply({
            content: ' ',
            components: [row],
            fetchReply: true
            })

            let doneCollector = doneMsg.createMessageComponentCollector()

            doneCollector.on('collect', async btnInt => {
                titleMsg.delete()
                handler.clear()
                doneMsg.delete()
            })
        }, 800)
    }
}

const getColor = (rating) => {
    const red = '#FF0000';
    const yellow = '#FFFF00'
    const green = '#00FF00';

    let ratingPercent = (rating / 5.0) - 0.1
    let ratingColor
    
    if(ratingPercent < 0.5) {
        ratingColor = blendColors(red, yellow, ratingPercent * 2)
    } else {
        ratingColor = blendColors(yellow, green, (ratingPercent - 0.5) * 2)
    }

    return ratingColor
}

const blendColors = (color1, color2, percentage) => {
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

module.exports = seeRatings