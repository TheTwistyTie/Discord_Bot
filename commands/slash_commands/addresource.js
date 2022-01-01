const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageActionRow, MessageButton, MessageSelectMenu} = require("discord.js");
const Resources = require('../../models/Resources')

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
                        value: 'Housing',
                    },
                    {
                        value: 'Furniture',
                    },
                    {
                        value: 'Employment Opportunity',
                    },
                    {
                        value: 'Finacial Help',
                    },
                    {
                        value: 'Food',
                    },
                    {
                        value: 'Clothes',
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
                        value: 'Educational',
                    },
                    {
                        value: 'LGBTQ+',
                    },
                    {
                        value: 'Hotline',
                    },
                    {
                        value: 'Covid-19',
                    },
                ]
            })

            resources.save(err => {
                if(err) {
                    console.log(err);
                    message.reply({
                        content: 'An Issue has occured.',
                    }).then(() => {
                        setTimeout(() => {
                            client.commands.get('clear').execute(message, ['1'], Discord)
                        }, 2000);
                    });
                    return;
                }

                interaction.reply({
                    content: `Added Rescource type.`,
                    ephemeral: true
                }).then(() => {
                    setTimeout(() => {
                        client.commands.get('clear').execute(message, ['1'], Discord)
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

        await interaction.reply({
            content: "What kind of resource are you trying to add?",
            components: [row],
            ephemeral: true,
        })

        const filter = (dropDownInt) => {
            return interaction.user.id === dropDownInt.user.id
        }
    
        const resourceTypeCollector = btnMsg.createMessageComponentCollector({
            filter,
            max: 1,
        })

        resourceTypeCollector.on('collect', async (btnInteraction) => {
            const { customId, values, member } = dropDownInt
            if(customId === 'add_new')
            {
                await interaction.editRply({
                    content: `What type of resource would you like to add?`,
                    components: [],
                    ephemeral: true,
                })
            } else {
                await interaction.editRply({
                    content: `What type of resource would you like to add?`,
                    components: [],
                    ephemeral: true,
                })
            }
        })
    }
}