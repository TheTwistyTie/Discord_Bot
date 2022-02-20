const colorCheck = async (resourceType, guild_id) => {
    const Resources = require('../../../../models/ResourceSettings')

    let resources;
    resources = await Resources.findOne({guild_id: guild_id});

    for(i = 1; i < resources.types.length; i++) {
        if(resources.types[i].value === `${resourceType}`) {
            return resources.types[i].color;
        }
    }

    return '#ffaa55'
}

module.exports = colorCheck