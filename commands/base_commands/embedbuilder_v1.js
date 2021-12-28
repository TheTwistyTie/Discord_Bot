const { MessageManager, Collector } = require("discord.js");

module.exports = {  
    name: 'embedbuilder',
    description: "This is an emoty base command.",
    async execute(message, args, Discord, client){
        if(message.member.roles.cache.has('787699492061052948'))
        {
            let title
            let description
            let urlBool
            let url
            //Enter Command Here

            const yes = ['yes', 'y', 'true'];
            const no = ['no', 'n', 'false'];

            const filter = m => m.author.id == message.author.id && m.channel.id == message.channel.id;
            message.reply('What would you like the title to be?');

            const collector = await message.channel.createMessageCollector({filter, max: 4});
            let counter = 0;
            collector.on('collect', m => {
                switch(counter)
                {
                    case 0: 
                        counter++;
                        title = m.content;
                        m.reply(`Title set to: ${title}`);
                        message.channel.send("Describe what this embed is for.")
                        break;
                    case 1:
                        counter++;
                        description = m.content;
                        m.reply(`Description set to: ${description}`);
                        message.channel.send("Do you want to link to a url?");
                        break;
                    case 2:
                        counter++;
                        if(yes.some(yes => yes.toLowerCase() === m.content.toLowerCase())){
                            m.reply('What is the full URL? ex: https://www.google.com/');
                            urlBool = true;
                        } else
                        {
                            counter++;
                            urlBool = false;
                            collector.stop();
                        }
                        break;
                    case 3:
                        counter++;
                        if(urlBool)
                        {
                            url = m.content;
                            m.reply(`URL saved as: ${url}`);
                            collector.stop();
                        }
                    default:
                        collector.stop();
                }
            });

            collector.on('end', collected => {
                if(collected.size === 0)
                {
                    message.reply(`There seems to have been an issue. Please report this issue to an <@${'787699492061052948'}>`);
                } else {
                    const newEmbed = new Discord.MessageEmbed()
                    .setColor('#ab0b00')
                    .setTitle(`${title}`)
                    .setDescription(`${description}`)
                    if(urlBool){
                        newEmbed.setURL(`${url}`);
                    }

                    message.channel.send({embeds: [newEmbed]});
                }
            })
        } else {
            return message.reply('Incorrect Permissions.');
        }
    }
}