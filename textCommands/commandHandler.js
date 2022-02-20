const controlPanel = require("./controlPanel");
const resourceAdder = require("./resourceAdder");

const commandHandler = (message) => {
    if(message.member.roles.cache.has('787699492061052948')) {
        prefix = '!'
        const args = message.content.slice(prefix.length).split(/ +/);

        switch(args[0]) {
            case 'controlPanel':
                controlPanel(message.channel)
                break;
            case 'resourceAdder':
                resourceAdder(args[1], message)
                break;
        }

        message.delete();
    }
}

module.exports = commandHandler