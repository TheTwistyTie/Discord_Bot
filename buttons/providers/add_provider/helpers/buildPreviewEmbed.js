const { MessageEmbed } = require("discord.js");

const buildPreviewEmbed = (embedData) => {
    const {title, description, url, regionText, color, thumbnail} = embedData;

    let newEmbed = new MessageEmbed()
        .setTitle(title)
        .setDescription(description)
        .setColor('#000000')
    
    if(typeof thumbnail !== 'undefined'){
        newEmbed.setThumbnail(thumbnail)
    }

    if(typeof url !== 'undefined'){
        newEmbed.setURL(url)
    }

    if(typeof regionText !== 'undefined'){
        newEmbed.setFooter({text: regionText})
    }

    return newEmbed
}

module.exports = buildPreviewEmbed;