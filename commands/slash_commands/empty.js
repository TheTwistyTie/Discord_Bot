const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('empty')
        .setDescription('This does nothing.'),

    async execute(interaction) {
        //Enter Command Here
        interaction.reply({
            content: "You really used an empty command? Nice.",
            ephemeral: true,
        })
    }
}