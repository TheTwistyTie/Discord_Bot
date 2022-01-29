const { SlashCommandBuilder } = require('@discordjs/builders');
const User = require('../models/User')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('seereports')
        .setDescription('See the reports on a user.')
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription('The user who\'s reports you are try see')
                .setRequired(true)
        )
        .setDefaultPermission(false),

    async execute(interaction) {
        const {channel} = interaction
        
        const user = interaction.options.getUser('user')

        let previousReports = await User.findOne({id: user.id})
        if(!previousReports || !previousReports.reports) {
            interaction.reply({
                content: 'No Previous Reports.',
                ephemeral: true,
            })
        }
        else {
            let text = 'This user has pervious reports.\n'
            
            let numAutomoderationEvents = previousReports.reports.automoderation.length;
            let numReports = previousReports.reports.userReports.length;

            text += `There are ${numAutomoderationEvents} auto-moderation events listed for this user.\n`
            text += `There are ${numReports} reports made on this user.`

            if(numReports >= 5) {
                text += ' Here are the last 5.\n'
                for(i = numReports - 1; i >= numReports - 5; i--) {
                    let reports = previousReports.reports.userReports;
                    let report = reports[i]

                    text += `\`\`\`Reason: ${report.reason}\n`
                    text += `Time: ${report.timestamp}\n`
                    text += `Reported by: ${report.reported_by}\`\`\``
                }
            } else if(numReports > 0) {
                text += ' Here are those reports.\n'
                for(i = numReports - 1; i >= 0; i--) {
                    let reports = previousReports.reports.userReports;
                    let report = reports[i]

                    text += `\`\`\`Reason: ${report.reason}\n`
                    text += `Time: ${report.timestamp}\n`
                    text += `Reported by: ${report.reported_by}\`\`\``
                }
            } 

            interaction.reply({
                content: text,
                ephemeral: true,
            })
        }
    }
}