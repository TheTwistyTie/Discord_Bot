const {MessageActionRow, MessageButton, MessageSelectMenu} = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roles')
        .setDescription("Use this command to set your roles!"),

    async execute(interaction) {
        //Enter Command Here
        const {channel} = interaction

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('pronouns')
                    .setLabel('Pronouns Roles')
                    .setStyle('PRIMARY'),

                new MessageButton()
                    .setCustomId('region')
                    .setLabel('Region Roles')
                    .setStyle('PRIMARY'),
                
                new MessageButton()
                    .setCustomId('cancel')
                    .setLabel('Cancel')
                    .setStyle('DANGER')
            )
        
        if(!interaction) return;

        const msg = await interaction.reply({
            content: 'What type of roles would you like to set?',
            components: [row],
            ephemeral: true,
            fetchReply: true,
        })

        const btnCollector = msg.createMessageComponentCollector({
            max: 1,
        })

        btnCollector.on('collect', async btnInt => {
            if(btnInt.customId === 'pronouns') {
                const pgpMessageComponent = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('789481727596298251')
                            .setLabel('He/Him')
                            .setStyle('PRIMARY'),
                        new MessageButton()
                            .setCustomId('789481812321107990')
                            .setLabel('She/Her')
                            .setStyle('PRIMARY'),
                        new MessageButton()
                            .setCustomId('789481861272436746')
                            .setLabel('They/Them')
                            .setStyle('PRIMARY'),
                        new MessageButton()
                        .setCustomId('789481936779345931')
                        .setLabel('Other PGPs')
                        .setStyle('PRIMARY'),
                    )

                
                if(!interaction || !btnInt) return;
                
                interaction.editReply({
                    content: "Adding PGP Roles...",
                    components: [],
                    ephemeral: true
                })
                const btnMsg = await btnInt.reply({
                    content: "**What pronouns do you use??**",
                    components: [pgpMessageComponent],
                    ephemeral: true,
                    fetchReply: true,
                })
    
                const filter = (btnInt) => {
                    return interaction.user.id === btnInt.user.id
                }
    
                const pgpCollector = btnMsg.createMessageComponentCollector({
                    filter,
                    time: 30000
                })
    
                pgpCollector.on('collect', pgpInt => {
                    //const roleID = btnInt.customId;
                    //const member = guild.members.cache.get(btnInt.user.id)
    
                    const {customId: roleID, member} = pgpInt
                    
                    if(!btnInt) return

                    btnInt.editReply({
                        content: "Adding Role...",
                        components: [],
                        ephemeral: true
                    })

                    if(roleID === 'region' || roleID === 'pronouns') return

                    if(member.roles.cache.has(roleID)){
                        member.roles.remove(roleID);
                        pgpInt.reply({
                            content: `Removed <@&${roleID}> successfully!`,
                            ephemeral: true,
                        })
                    } else {
                        member.roles.add(roleID);
                        pgpInt.reply({
                            content: `Added <@&${roleID}> successfully!`,
                            ephemeral: true,
                        })
                    } 

                    btnCollector.stop()
                    pgpCollector.stop()
                })
    
            } else if(btnInt.customId === 'region') {
                const regionMessageComponent = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId("region_select")
                            .setPlaceholder("Select a Region!")
                            .setOptions([
                                {
                                    //"label" : "Central",
                                    label: 'The Central Connecticut Region',
                                    value: '789305446544310323',
                                    //"description" : 'The Central Connecticut Region'
                                },
                                {
                                    label: "Eastern",
                                    value: '789305587179585536',
                                    description: 'The Eastern Connecticut Region'
                                },
                                {
                                    label: "Fairfield",
                                    value: '789305872106913832',
                                    description: 'The Fairfield Region'
                                },
                                {
                                    label: "Greater Hartford",
                                    value: '789305981926244383',
                                    description: 'The Greater Hartford Region'
                                },
                                {
                                    label: "Greater New Haven",
                                    value: '789306126343602226',
                                    description: 'The Greater New Haven Region'
                                },
                                {
                                    label: "Middletown Meriden Wallingford",
                                    value: '789306196481671248',
                                    description: 'The Middletown Meriden Wallingford Region'
                                },
                                {
                                    label: "North West",
                                    value: '789306439109836840',
                                    description: 'The North West Connecticut Region'
                                },
                            ]),
                    )

                if(!interaction || !btnInt) return;    

                interaction.editReply({
                    content: "Adding Region Roles.",
                    components: [],
                    ephemeral: true
                })
                const btnMsg = await btnInt.reply({
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

                    if(customId === 'region' || customId === 'pronouns') return
                    
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

                    if(!btnInt || !dropDownInt) return
                    
                    btnInt.editReply({
                        content: "Adding Roles...",
                        components: [],
                        ephemeral: true
                    })
                    dropDownInt.reply({
                        content: 'Region Updated!',
                        components: [],
                        ephemeral: true,
                    })
                    
                    if(btnCollector || regionCollector){
                        btnCollector.stop();
                        regionCollector.stop();
                    }
                })
            } else {
                if(!btnInt.customId === 'cancel') {
                    console.log(btnInt.customId)
                }
                btnInt.reply({
                    content: "Canceled.",
                    components: [],
                    ephemeral: true,
                })
            }
        })
    } 
}