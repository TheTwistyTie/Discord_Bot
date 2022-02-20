const {MessageActionRow, MessageButton} = require("discord.js");
const RoleSettings = require('../../models/RoleSettings');

const setGenderRoles = async (interaction) => {
    let roleSettings;
    roleSettings = await RoleSettings.findOne({guild_id: interaction.channel.guild.id});
    
    let pgpMessageComponent;

    if (!roleSettings) {
        console.log('DB Roles Failed')
        pgpMessageComponent = new MessageActionRow()
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
                    .setLabel('They/They')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('789481936779345931')
                    .setLabel('Other')
                    .setStyle('PRIMARY'),
            )
    } else {
        pgpMessageComponent = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(roleSettings.GenderRoles.he_him)
                    .setLabel('He/Him')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId(roleSettings.GenderRoles.she_her)
                    .setLabel('She/Her')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId(roleSettings.GenderRoles.they_them)
                    .setLabel('They/They')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId(roleSettings.GenderRoles.other)
                    .setLabel('Other')
                    .setStyle('PRIMARY'),
            )
    }
    const btnMsg = await interaction.reply({
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
    })

    pgpCollector.on('collect', pgpInt => {
        const {customId: roleID, member} = pgpInt
        
        if(!interaction) return

        interaction.editReply({
            content: "Adding Role...",
            components: [],
            ephemeral: true
        })
        const prefix = '<@&';
        const suffix = '>';

        if(member.roles.cache.has(roleID)){
            member.roles.remove(roleID);
            pgpInt.reply({
                content: `Removed ${prefix}${roleID}${suffix} successfully!`,
                ephemeral: true,
            })
        } else {
            member.roles.add(roleID);
            pgpInt.reply({
                content: `Added ${prefix}${roleID}${suffix} successfully!`,
                ephemeral: true,
            })
        }
    })
}

module.exports = setGenderRoles