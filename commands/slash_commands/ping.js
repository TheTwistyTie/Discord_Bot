const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        //Enter Command Here
        interaction.reply({
            content: "Pong!",
            ephemeral: true,
        })
    }
}