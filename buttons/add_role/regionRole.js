const {MessageActionRow, MessageSelectMenu} = require("discord.js");
const RoleSettings = require('../../models/RoleSettings');

const regionRole = async (interaction) => {
    let roleSettings;
    roleSettings = await RoleSettings.findOne({guild_id: interaction.channel.guild.id});
    
    let regionMessageComponent;
    if(!roleSettings) {
        regionMessageComponent = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId("region_select")
                    .setPlaceholder("Select a Region!")
                    .setOptions([
                        {
                            label: 'The Central Connecticut Region',
                            value: '789305446544310323',
                        },
                        {
                            label: "The Eastern Connecticut Region",
                            value: '789305587179585536',
                        },
                        {
                            label: "The Fairfield County Region",
                            value: '789305872106913832',
                        },
                        {
                            label: "The Greater Hartford Region",
                            value: '789305981926244383',
                        },
                        {
                            label: "The Greater New Haven Region",
                            value: '789306126343602226',
                        },
                        {
                            label: "The Middletown Meriden Wallingford Region",
                            value: '789306196481671248',
                        },
                        {
                            label: "The North West Connecticut Region",
                            value: '789306439109836840',
                        },
                    ]),
            )
    } else {
        regions = [];

        for(i = 0; i < roleSettings.RegionRoles.length; i++){
            regions.push({
                label: roleSettings.RegionRoles[i].name,
                value: roleSettings.RegionRoles[i].role_id,
            })
        }

        regionMessageComponent = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId("region_select")
                    .setPlaceholder("Select a Region!")
                    .setOptions(regions),
            )
    } 
    
    const btnMsg = await interaction.reply({
        content : "**What region are you from?**",
        components : [regionMessageComponent],
        ephemeral: true,
        fetchReply: true,
    })

    const filter = (dropDownInt) => {
        return interaction.user.id === dropDownInt.user.id
    }

    const regionCollector = btnMsg.createMessageComponentCollector({
        filter,
    })

    regionCollector.on('collect', dropDownInt => {
        
        const { customId, values, member } = dropDownInt
        
        if(customId === 'region_select')
        {
            const component = dropDownInt.component
            const removed = component.options.filter((option) => {
                return !values.includes(option.value)
            })

            for (const id of removed) {
                member.roles.remove(id.value)
            }

            for(const id of values) {
                member.roles.add(id)
            }
        }
        
        interaction.editReply({
            content: "Adding Roles...",
            components: [],
            ephemeral: true
        })
        dropDownInt.reply({
            content: 'Region Updated!',
            components: [],
            ephemeral: true,
        })
    })
}

module.exports = regionRole