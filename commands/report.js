const { SlashCommandBuilder } = require('@discordjs/builders');
const Reports = require('../models/Reports')

const moderationChannel = '787708029781016587'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription("Report someone.")
        .addUserOption((option) => 
            option
                .setName('user')
                .setDescription('The person you\'re reporting')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('reason')
                .setDescription('The reason for your report.')
                .setRequired(true)
        ),

    async execute(interaction) {
        //Enter Command Here
        const {channel} = interaction

        const user = interaction.options.getUser('user')
        const reason = interaction.options.getString('reason')

        interaction.reply({
            content: `Reported: ${user}\nReason: **${reason}**`,
            ephemeral: true,
        })

        interaction.guild.channels.cache.get(moderationChannel).send(
            `<@${interaction.user.id}>: reported ${user} in ${channel} for reason:\n${reason}`
        )

        let previousReports = await Reports.findOne({id: user.id})
        if(!previousReports) {
            previousReports = new Reports({
                id: user.id,
                name: user.username,
            })
        }

        previousReports.reports.push( {
            reported_by: interaction.user.username,
            reason: reason,
            timestamp: new Date()
        })

        previousReports.save(err => {
            if(err) {
                console.log(err);
                return;
            }
        })
    }
}