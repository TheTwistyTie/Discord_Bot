
const cron = require('node-cron')

const guildId = '787693265977344010'

const commands = {
    addRecource: '926647792426971146',
    clear: '925190550053855252',
    report: '931254027163951114',
    seereports: '931276142638407791',
    commandToDelete: null,
}

let roles = {
    admin: '787699492061052948',
    staff: '787698853640929280',
    provider: '787698562254503938',
    partner: '787698500896292866',
    YAH: '818936852538589184',
    member: '931227847899639859',
    nightMember: '930669848046993448',
    muted: '919629267694936064'
}

const setPermissions = async (client) => {
    

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
        {
            id: commands.seereports,
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
        }
    ];

    await client.guilds.cache.get(guildId)?.commands.permissions.set({ fullPermissions });

    if(commands.commandToDelete !== null) {
        deleteCommand(commands.commandToDelete);
    }

    startCloseCycle(client.guilds.cache.get(guildId))

} 

const deleteCommand = (guildId, commandId) => {
    client.guilds.cache.get(guildId).commands.fetch(commandId) 
      .then( (command) => {
    console.log(`Fetched command ${command.name}`)

    command.delete()
    console.log(`Deleted command ${command.name}`)

    }).catch(console.error);
}

const startCloseCycle = (client) => {
    cron.schedule('59 23 * * *', async () => {
        console.log('Switching server to night mode...')
        const oldRole = guild.roles.cache.get(roles.member);

        oldRole.members.each(member => {
            member.roles.remove(oldRole)
            member.roles.add(roles.nightMember)
        })
    })
    
    cron.schedule('59 6 * * *', () => {
        console.log('Switching server to day mode...')
        const oldRole = guild.roles.cache.get(roles.nightMember);

        oldRole.members.each(member => {
            member.roles.remove(oldRole)
            member.roles.add(roles.member)
        })
    })
}

module.exports = setPermissions;