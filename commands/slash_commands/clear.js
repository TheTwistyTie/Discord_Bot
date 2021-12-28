const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription("Clear x amount of messages. 1-100")
        .addStringOption((option) => 
            option
                .setName('amount')
                .setDescription('The amount of messages to clear')
                .setRequired(true)
        ),
        
    /*
        .setDefaultPermission(false)
        .setPermissions([
            {
                id: '787699492061052948',
                type: 1,
                permission: true,
            }
        ]),
     
    permissions: ['ADMINISTRATOR'],
    //requireRoles: true,

    minArgs: 1,
    maxArgs: 1,
    expectedArgs: '[amount]',
    */

    async execute(interaction) {
        //Enter Command Here
        const { channel } = interaction

        const amount = parseInt(interaction.options.getString('amount'))

        const { size } = await channel.bulkDelete(amount, true)

        const response = await interaction.reply({
            content: `Deleted ${size} message(s).`,
            ephemeral: true,
        });
    }
}