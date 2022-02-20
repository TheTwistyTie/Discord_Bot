const GuildSettings = require('../models/GuildSettings')

const resourceAdder = async (role, message) => {
    const prefix = '<@&'
    const suffix = '>'
    const cleanedRole = role.slice(prefix.length, -suffix.length)

    let guildSettings = await GuildSettings.findOne({guild_id: message.channel.guild.id})

    if(!guildSettings) {
        guildSettings = new GuildSettings({
            guild_id: message.guild.id,
            resourceAdder: [],
        })
    }

    guildSettings.resourceAdder.push(cleanedRole)

    guildSettings.save(err => {
        if(err) {
            console.log(err);
            return;
        }
    })
}

module.exports = resourceAdder