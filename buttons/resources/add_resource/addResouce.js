const {MessageActionRow, MessageSelectMenu} = require("discord.js");
const Resources = require('../../../models/ResourceSettings');
const addNew = require('./helpers/newResourceType');
const createResource = require('./helpers/createResource')

const addResource = async (interaction) => {
    const {guild} = interaction

    let resources = await Resources.findOne({guild_id: guild.id});

    let resourceType = [];
    if(!resources){
        resources = new Resources({
            guild_id: channel.guild.id,
            types: [
                {
                    value: 'Housing Resource',
                    color: '#8fa1fc',
                },
                {
                    value: 'Furniture Resource',
                    color: '#f6fbdc',
                },
                {
                    value: 'Employment Opportunity',
                    color: '#4e784c',
                },
                {
                    value: 'Financial Help',
                    color: '#52ec53',
                },
                {
                    value: 'Food Resource',
                    color: '#d35172',
                },
                {
                    value: 'Clothing Resource',
                    color: '#96bd6a',
                },
                {
                    value: 'Showers',
                    color: '#2fc4d6',
                },
                {
                    value: 'Childcare',
                    color: '#238eb7',
                },
                {
                    value: 'Healthcare',
                    color: '#990c2c',
                },
                {
                    value: 'Identity Documents',
                    color: '#061451',
                },
                {
                    value: 'Educational Resource',
                    color: '#b58938',
                },
                {
                    value: 'LGBTQ+ Resource',
                    color: '#fa51b4',
                },
                {
                    value: 'Hotline',
                    color: '#e9ff64',
                },
                {
                    value: 'Covid-19 Resource',
                    color: '#f13422',
                },
            ],
            languages: [
                'English',
                'Spanish',
            ],
            regions: [
                'Central Connecticut',
                'Eastern Connecticut',
                'Fairfield County',
                'Greater Hartford',
                'Greater New Haven',
                'Middletown Meriden Wallingford',
                'North West Connecticut',
            ],
        })

        resources.save(err => {
            if(err) {
                console.log(err);
                interaction.reply({
                    content: 'An Issue has occured.',
                }).then(() => {
                    setTimeout( async () => {
                        await channel.messages.fetch({limit: '1'}).then(messages =>{
                            channel.bulkDelete(messages);
                        });
                    }, 2000);
                });
                return;
            }

            channel.send({
                content: `Added Rescource types.`,
            }).then(msg => {
                setTimeout( () => {
                    msg.delete()
                }, 2000);
            });
        })

        for(i = 0; i < resources.types.length; i++) {
            resourceType.push({
                label: `${resources.types[i].value}`,
                value: `${resources.types[i].value}`,
            })
        }

    } else {
        for(i = 0; i < resources.types.length; i++) {
            resourceType.push({
                label: `${resources.types[i].value}`,
                value: `${resources.types[i].value}`,
            })
        }
    }

    resourceType.push({
        label: 'Add new type of resource',
        value: 'add_new',
    })

    const row = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId("resource_type")
                .setPlaceholder("Select a type of resource.")
                .setOptions(resourceType)
        )
    
    const resourceMsg = await interaction.user.send({
        content: "What kind of resource are you trying to add?",
        components: [row],
        fetchReply: true,
    })

    const looseEnd = await interaction.reply({
        content:'Button Clicked...',
        fetchyReply: true,
    })
    interaction.deleteReply()

    const resourceTypeCollector = resourceMsg.createMessageComponentCollector()
    resourceTypeCollector.on('collect', async (btnInteraction) => {
        const { values } = btnInteraction

        const value = values[values.length - 1];

        if(value === 'add_new')
        {
            addNew(btnInteraction, guild)
        } else {
            createResource(value, btnInteraction, guild)
        }

        resourceMsg.delete()
    })
}

module.exports = addResource;