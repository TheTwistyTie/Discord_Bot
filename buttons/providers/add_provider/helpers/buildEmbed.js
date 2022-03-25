const { MessageEmbed } = require("discord.js");

const buildEmbed = (embedData) => {
    const {title, description, url, fields, regionText, color, thumbnail, timestamp} = embedData;

    let newEmbed = new MessageEmbed()
        .setTitle(title)
        .setDescription(description)
        .setColor('#000000')
        .setTimestamp(timestamp)

    if(typeof fields !== 'undefined' && fields.length >= 1) {
        newEmbed.setFields(fields)
    }
    
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

module.exports = buildEmbed;