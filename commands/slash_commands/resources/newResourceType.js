const addNew = async (interaction) => {
    const intMsg = interaction.reply({
        contents: 'What new category of resource would you like to add?'
    })

    const {channel} = interaction;

    const filter = (m) => {
        return interaction.user.id === m.user.id
    }

    const collector = channel.createMessageCollector({
        filter,
        max: 1
    })

    collector.on('collect', message => {
        await message.channel.messages.fetch({limit: '1'}).then(messages =>{
            message.channel.bulkDelete(messages);
        });
    })
}

module.exports = addNew;