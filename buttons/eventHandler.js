const providers = require('./providers');
const resources = require('./resources');
const roles = require('./roles');

const eventHandler = (interaction) => {
    switch(interaction.customId) {
        case 'roles':
            roles(interaction)
            break;
        case 'resources':
            resources(interaction)
            break;
        case 'providers':
            providers(interaction)
            break;
    }
} 

module.exports = eventHandler;