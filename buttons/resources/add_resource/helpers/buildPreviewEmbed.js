const { MessageEmbed } = require("discord.js");

const buildPreviewEmbed = (embedData) => {
    const {title, resourceType, url, fields, timestamp, color, thumbnail} = embedData;

    let newEmbed = new MessageEmbed()
        .setTitle(title + '\t|\t' + resourceType)
        .setDescription(fields[0].value)
        .setColor(color)
        .setTimestamp(timestamp)
    
    if(typeof thumbnail !== 'undefined'){
        newEmbed.setThumbnail(thumbnail)
    }

    if(typeof url !== 'undefined'){
        newEmbed.setURL(url)
    }

    return newEmbed
}

module.exports = buildPreviewEmbed;