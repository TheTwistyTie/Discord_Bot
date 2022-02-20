const { MessageEmbed } = require("discord.js");

const buildEmbed = (embedData) => {
    const {title, description, url, fields, regionText, color, thumbnail} = embedData;

    let newEmbed = new MessageEmbed()
        .setTitle(title)
        .setDescription(description)
        .setColor('#000000')
        //.setFields(fields)
        //.setTimestamp(timestamp)
    
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