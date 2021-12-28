const { MessageActionRow, MessageButton } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

const wait = require('util').promisify(setTimeout);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shutdown')
        .setDescription("Shut the bot down."),

    async execute(interaction, client) {
        //Enter Command Here
        const {channel} = interaction

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('shut_down_yes')
                    .setLabel('Confirm')
                    .setStyle('SUCCESS'),

                new MessageButton()
                    .setCustomId('shut_down_no')
                    .setLabel('Cancel')
                    .setStyle('DANGER')
            )

        await interaction.reply({
            content: '**Are you sure?**',
            components: [row],
            ephemeral: true,
        })

        const btnCollector = channel.createMessageComponentCollector({
            max: 1,
        })

        btnCollector.on('collect', async (btnInt) => {
            if(btnInt.customId === 'shut_down_yes'){

                await btnInt.deferReply({
                    //ephemeral: true, 
                })

                await interaction.editReply({
                    content: "Shutting Down...",
                    components: [],
                })

                await wait(2000)

                let finalmessage = await btnInt.editReply({
                    content: "Shut Down.",
                    ephemeral: true
                })

                await wait(1500)

                //await tryAndDeleteMe.delete()
                await finalmessage.delete()

                await console.log("Bot is Offline");
                await client.destroy();
                await intentional.crash();

            } else {
                await interaction.editReply({
                    content: "Canceled.",
                    components: [],
                })
            }
        })
    }
}