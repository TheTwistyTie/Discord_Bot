const { MessageActionRow, MessageButton } = require("discord.js")

const ratingModeration = async (interaction, rating, resource) => {
    let moderatorChannel = '787708029781016587'
    let client = interaction.client

    let {stringRating, user_name} = rating

    let row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('remove_text')
                .setLabel('Remove review text')
                .setStyle('DANGER'),

            new MessageButton()
                .setCustomId('see_user')
                .setLabel('See User')
                .setStyle('DANGER'),
        )

    let message = await client.channels.cache.get(moderatorChannel).send({
        content: '**New Review Posted:**\nUser said:\n' + stringRating,
        embeds: [],
        components: [row],
        fetchReply: true,
    })

    let collector = message.createMessageComponentCollector();

    collector.on('collect', async (btnInt) => {
        switch(btnInt.customId) {
            case 'remove_text' :
                let prvReview = {
                    numRating: rating.numRating,
                    stringRating: rating.stringRating
                }

                rating.prevReviews.push(prvReview)

                rating.stringRating = rating.numRating + 'Stars!';

                resource.ratings.push(rating)
                resource.save;

                let looseEnd = await btnInt.reply({
                    content: 'Removed.',
                    fetchReply: true
                })

                setTimeout(() => {
                    looseEnd.delete()
                }, 2000)

                break;
            case 'see_user' :
                if(canSee(interaction.member)) {
                    interaction.reply({
                        content: user_name,
                        ephemeral: true,
                    })
                } else {
                    interaction.reply({
                        content: 'You do not have permission to see this information.',
                        ephemeral: true,
                    })
                }
                break;
        }
    })
}

const canSee = (user) => {
    let i = 0;
    let canSee = false;
    let allowedRoles = ['787699492061052948', '787698853640929280']

    while(!canSee && i < allowedRoles.length) {
        if(user.roles.cache.has(allowedRoles[i])) {
            canSee = true;
        }
        i++;
    }

    return canSee
}

module.exports = ratingModeration