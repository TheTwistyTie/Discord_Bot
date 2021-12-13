module.exports = {
    name: 'embed',
    description: "This command is used to make embeds.",
    execute(message, args, Discord){
        const newEmbed = new Discord.MessageEmbed()
        .setColor('#cfcfcf')
        .setTitle('Title')
        .setURL('https://google.com')
        .setDescription('This is a test embed')
        .addFields(
            {name: 'Line 1', value: 'test text'},
            {name: 'Line 2', value: 'text test'}
        )
        .setImage('https://media.istockphoto.com/photos/blank-paper-picture-id482690225?b=1&k=20&m=482690225&s=170667a&w=0&h=ChO-geXZF_kUtwN5O3ghBSMk0hO5az6Zqd-bzmoKtMY=')
        .setFooter('React to gain access');

        message.channel.send({embeds: [newEmbed]});
    }
}