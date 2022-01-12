const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageActionRow, MessageSelectMenu} = require("discord.js");
const Resources = require('../models/Resources');
const addNew = require('./addResourceHelpers/newResourceType');
const createResource = require('./addResourceHelpers/createResource');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addresource')
        .setDescription('Providers and Partners can use this to add resources that users can search for.')
        .setDefaultPermission(false),

    async execute(interaction) {
        //Enter Command Here
        const { channel } = interaction

        let resources;
        resources = await Resources.findOne({guild_id: channel.guild.id});
    
        let resourceType = []
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
                        value: 'Finacial Help',
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
                ]
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
                }).then(() => {
                    setTimeout( async () => {
                        await channel.messages.fetch({limit: '1'}).then(messages =>{
                            channel.bulkDelete(messages);
                        });
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
        
        const resourceMsg = await interaction.reply({
            content: "What kind of resource are you trying to add?",
            components: [row],
            ephemeral: true,
            fetchReply: true,
        })

        const filter = (reactionInt) => {
            return interaction.user.id === reactionInt.user.id
        }
    
        const resourceTypeCollector = resourceMsg.createMessageComponentCollector({
            filter,
            max: 1,
        })

        resourceTypeCollector.on('collect', async (btnInteraction) => {
            const { values } = btnInteraction

            const value = values[0]

            if(value === 'add_new')
            {
                interaction.editReply({
                    content: "Adding new resource type.",
                    components: []
                })
                addNew(btnInteraction)
            } else {
                interaction.editReply({
                    content: `Adding ${value}`,
                    components: []
                })
                createResource(value, btnInteraction)
            }
        })
    }
}