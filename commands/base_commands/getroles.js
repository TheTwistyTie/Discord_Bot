const { Client, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, MessageComponentInteraction } = require("discord.js");

module.exports = {
    //@param {Client} client
    name: 'getroles',
    description: "Lets a user set their roles!",
    async execute(message, args, Discord, client){
        if(message.member.roles.cache.has('787699492061052948'))
        {
            //Enter Command Here
            /* 
                Roles needed:
                PGP roles - Buttons
                    He/him
                    She/her
                    They/them
                    Other
                Region Roles - Select Menu
                    Central
                    Eastern
                    Fairfield
                    Greater Hartford
                    Greater New Haven
                    Middletown Meriden Wallingford
                    North West
            */

            const pgpMessageComponent = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('male_role')
                        .setLabel('He/Him')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('female_role')
                        .setLabel('She/Her')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('they_role')
                        .setLabel('They/Them')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                    .setCustomId('other_role')
                    .setLabel('Other PGPs')
                    .setStyle('PRIMARY'),
                )
            
            const regionMessageComponent = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId("region_select")
                        .setPlaceholder("Select a Region!")
                        .setOptions([
                            {
                                "label" : "Central",
                                "value" : 'central',
                                "description" : 'The Central Connecticut Region'
                            },
                            {
                                "label" : "Eastern",
                                "value" : 'eastern',
                                "description" : 'The Eastern Connecticut Region'
                            },
                            {
                                "label" : "Fairfield",
                                "value" : 'fairfield',
                                "description" : 'The Fairfield Region'
                            },
                            {
                                "label" : "Greator Hartford",
                                "value" : 'hartford',
                                "description" : 'The Greater Hartford Region'
                            },
                            {
                                "label" : "Greater New Haven",
                                "value" : 'new_haven',
                                "description" : 'The Greater New Haven Region'
                            },
                            {
                                "label" : "Middletown Meriden Wallingford",
                                "value" : 'mmw',
                                "description" : 'The Middletown Meriden Wallingford Region'
                            },
                            {
                                "label" : "North West",
                                "value" : 'north_west',
                                "description" : 'The North West Connecticut Region'
                            },
                        ]),
                )

            const pgpMessage = {
                content: "**What pronouns do you use??**",
                components: [pgpMessageComponent],
                ephemeral: true,
            }

            const regionMessage = {
                content : "**What region are you from?**",
                components : [regionMessageComponent],
                ephemeral: true,
            }

            const filter = i => i.user.id === message.author.id;

            const buttonCollector = message.channel.createMessageComponentCollector({
                filter,
                time: 60000
            })

            buttonCollector.on('collect', button => {
                const user = message.member;
                let role;

                switch(button.customId){
                    case 'male_role':
                        role = '789481727596298251'
                        break;
                    case 'female_role':
                        role = '789481812321107990'
                        break;
                    case 'they_role' :
                        role = '789481861272436746'
                        break;
                    case 'other_role' :
                        role = '789481936779345931'
                        break;
                    }
    
                    if(user.roles.cache.has(role)){
                        user.roles.remove(role);
                    } else {
                        user.roles.add(role);
                    } 
            })

            buttonCollector.on('end', collection => {
                sentPGP.delete();
            })

            const sentPGP = await message.channel.send(pgpMessage);
            const sentRegion = await message.channel.send(regionMessage);

        } else {
            return message.reply('Incorrect Permissions.');
        }
    }
}