const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageActionRow, MessageButton, MessageSelectMenu} = require("discord.js");
const Resources = require('../../models/Resources');
const addNew = require('./resources/newResourceType');
const createResource = require('./resources/createResource');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addresource')
        .setDescription('Providers and Partners can use this to add resources that users can search for.'),

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
                    },
                    {
                        value: 'Furniture Resource',
                    },
                    {
                        value: 'Employment Opportunity',
                    },
                    {
                        value: 'Finacial Help',
                    },
                    {
                        value: 'Food Resource',
                    },
                    {
                        value: 'Clothing Resource',
                    },
                    {
                        value: 'Showers',
                    },
                    {
                        value: 'Childcare',
                    },
                    {
                        value: 'Healthcare',
                    },
                    {
                        value: 'Identity Documents',
                    },
                    {
                        value: 'Educational Resource',
                    },
                    {
                        value: 'LGBTQ+ Resource',
                    },
                    {
                        value: 'Hotline',
                    },
                    {
                        value: 'Covid-19 Resource',
                    },
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