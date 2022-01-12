const setCommandPermissions = async (client) => {
    const guildId = '787693265977344010'
    const roles = {
        admin: '787699492061052948',
        staff: '787698853640929280',
        provider: '787698562254503938',
        partner: '787698500896292866',
        YAH: '818936852538589184',
        member: '787698205319102485',
        nightMember: '930669848046993448',
        muted: '919629267694936064'
    }

    const commands = {
        addRecource: '926647792426971146',
        clear: '925190550053855252',
        commandToDelete: null,
    }

    const fullPermissions = [
        {
            id: commands.addRecource,
            permissions: [
                {
                    id: roles.admin,
                    type: 'ROLE',
                    permission: true,
                },
                {
                    id: roles.staff,
                    type: 'ROLE',
                    permission: true,
                },
                {
                    id: roles.provider,
                    type: 'ROLE',
                    permission: true,
                },
                {
                    id: roles.partner,
                    type: 'ROLE',
                    permission: true,
                },
            ],
        },
        {
            id: commands.clear,
            permissions: [
                {
                    id: roles.admin,
                    type: 'ROLE',
                    permission: true,
                },
                {
                    id: roles.staff,
                    type: 'ROLE',
                    permission: true,
                },
            ]
        },
    ];

    await client.guilds.cache.get(guildId)?.commands.permissions.set({ fullPermissions });

    if(commands.commandToDelete !== null) {
        deleteCommand(commands.commandToDelete);
    }

} 

const deleteCommand = (guildId, commandId) => {
    client.guilds.cache.get(guildId).commands.fetch(commandId) // id of your command
      .then( (command) => {
    console.log(`Fetched command ${command.name}`)
    // further delete it like so:
    command.delete()
    console.log(`Deleted command ${command.name}`)
    }).catch(console.error);
}

module.exports = setCommandPermissions;