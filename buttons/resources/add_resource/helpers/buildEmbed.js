const { MessageEmbed } = require("discord.js");

const buildEmbed = (embedData) => {
    const {title, resourceType, image, url, fields, regionText, timestamp, color, thumbnail} = embedData;

    let newEmbed = new MessageEmbed()
        .setTitle(title + '\t|\t' + resourceType)
        .setDescription('\u200b')
        .setColor(color)
        .setFields(fields)
        .setTimestamp(timestamp)
    
    if(typeof thumbnail !== 'undefined'){
        newEmbed.setThumbnail(thumbnail)
    }

    if(typeof image !== 'undefined'){
        newEmbed.setImage(image)
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