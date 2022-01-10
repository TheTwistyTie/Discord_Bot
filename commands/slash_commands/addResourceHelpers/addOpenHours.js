const {MessageActionRow, MessageButton, MessageSelectMenu} = require("discord.js");
const formatHours = require("./formatHour");

const itemTitle = 'Open:'

const addOpenHours = async (interaction, embedInfo) => {
    const { channel } = interaction;

    const daysArray = [
        {
            label: 'Monday',
            value: 'Monday',
        },
        {
            label: 'Tuesday',
            value: 'Tuesday',
        },
        {
            label: 'Wednesday',
            value: 'Wednesday',
        },
        {
            label: 'Thursday',
            value: 'Thursday',
        },
        {
            label: 'Friday',
            value: 'Friday',
        },
        {
            label: 'Saturday',
            value: 'Saturday',
        },
        {
            label: 'Sunday',
            value: 'Sunday',
        },
    ]

    const DaysOpen = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId("daysOpen")
                .setPlaceholder("Select what days you're open.")
                .setOptions(daysArray)
                .setMinValues(1)
                .setMaxValues(7)
        )

    const mainMsg = await interaction.reply({
        content: 'What days will you be open?',
        components: [DaysOpen],
        ephemeral: true,
        fetchReply: true,
    })

    const filter = (m) => {
        return m.user.id === interaction.user.id
    }

    const daysCollector = mainMsg.createMessageComponentCollector({
        filter,
        max: 1,
    })

    daysCollector.on('collect', async daysInt => {
        const {values} = daysInt;

        const openDays = weekdaySort(values);
        const daysText = openDays.toString();

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('continue')
                    .setLabel('Continue')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('cancel')
                    .setLabel('Cancel')
                    .setStyle('DANGER')
            )

        const btnFilter = (m) => {
            return interaction.user.id === m.user.id
        }

        await interaction.editReply({
            content: `Days selected.`,
            components: [],
            ephemeral: true,
        })
        const btnMsg = await daysInt.reply({
            content: `Days Open: \n\'${daysText}\'`,
            components: [row],
            ephemeral: true,
            fetchReply: true,
        })

        const dayConfCollector = await btnMsg.createMessageComponentCollector({
            btnFilter,
            max: 1,
        })

        dayConfCollector.on('collect', async (btnInt) => {
            if(btnInt.customId === 'continue') {
                daysInt.editReply({
                    content: 'Confimed',
                    components: [],
                    ephemeral: true,
                })

                const timeArray = [
                    {
                        label: '12:00 am',
                        value: '0000',
                    },
                    {
                        label: '1:00 am',
                        value: '0100',
                    },
                    {
                        label: '2:00 am',
                        value: '0200',
                    },
                    {
                        label: '3:00 am',
                        value: '0300',
                    },
                    {
                        label: '4:00 am',
                        value: '0400',
                    },
                    {
                        label: '5:00 am',
                        value: '0500',
                    },
                    {
                        label: '6:00 am',
                        value: '0600',
                    },
                    {
                        label: '7:00 am',
                        value: '0700',
                    },
                    {
                        label: '8:00 am',
                        value: '0800',
                    },
                    {
                        label: '9:00 am',
                        value: '0900',
                    },
                    {
                        label: '10:00 am',
                        value: '1000',
                    },
                    {
                        label: '11:00 am',
                        value: '1100',
                    },
                    {
                        label: '12:00 pm',
                        value: '1200',
                    },
                    {
                        label: '1:00 pm',
                        value: '1300',
                    },
                    {
                        label: '2:00 pm',
                        value: '1400',
                    },
                    {
                        label: '3:00 pm',
                        value: '1500',
                    },
                    {
                        label: '4:00 pm',
                        value: '1600',
                    },
                    {
                        label: '5:00 pm',
                        value: '1700',
                    },
                    {
                        label: '6:00 pm',
                        value: '1800',
                    },
                    {
                        label: '7:00 pm',
                        value: '1900',
                    },
                    {
                        label: '8:00 pm',
                        value: '2000',
                    },
                    {
                        label: '9:00 pm',
                        value: '2100',
                    },
                    {
                        label: '10:00 pm',
                        value: '2200',
                    },
                    {
                        label: '11:00 pm',
                        value: '2300',
                    },
                    {
                        label: '12:00 am',
                        value: '2400',
                    },
                ]
                const timeRow = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId('timeSelectMenu')
                            .setPlaceholder('Pick times:')
                            .setOptions(timeArray)
                            .setMaxValues(25)
                            .setMinValues(1)
                    )

                let openTimes = {
                    weekdayTimes: null,
                    weekendTimes: null,
                };
                if(hasWeekdays(openDays)) {
                    const msg = await btnInt.reply({
                        content: `What times will you be open on weekdays`,
                        components: [timeRow],
                        ephemeral: true,
                        fetchReply: true,
                    })
    
                    const timeCollector = await msg.createMessageComponentCollector({
                        btnFilter,
                        max: 1,
                    })
    
                    timeCollector.on('collect', async (newInt) => {    
                        openTimes.weekdayTimes = await timeSimplifyer(newInt.values);

                        btnInt.editReply({
                            content: `Weekday hours: ${openTimes.weekdayTimes}`,
                            components: []
                        })

                        if(hasWeekend(openDays)){
                            const endMsg = await newInt.reply({
                                content: 'What times will you be open on weekends?',
                                components: [timeRow],
                                ephemeral: true,
                                fetchReply: true,
                            })

                            const endTimeCollector = await endMsg.createMessageComponentCollector({
                                btnFilter,
                                max: 1,
                            })

                            endTimeCollector.on('collect', async (finInt) => {
                                openTimes.weekendTimes = await timeSimplifyer(newInt.values);

                                newInt.editReply({
                                    content: `Weekend hours: ${openTimes.weekendTimes}`,
                                    components: []
                                })

                                formatHours(openDays, openTimes, finInt, embedInfo)
                            })

                        } else {
                            formatHours(openDays, openTimes, newInt, embedInfo)
                        }
                    })
                } else {
                    const msg = await btnInt.reply({
                        content: 'What times will you be open on weekends?',
                        components: [timeRow],
                        ephemeral: true,
                        fetchReply: true,
                    })

                    const endTimeCollector = await msg.createMessageComponentCollector({
                        btnFilter,
                        max: 1,
                    })

                    endTimeCollector.on('collect', async (finInt) => {
                        openTimes.weekendTimes = await timeSimplifyer(finInt.values);

                        btnInt.editReply({
                            content: `Weekend hours: ${openTimes.weekendTimes}`,
                            components: []
                        })

                        formatHours(openDays, openTimes, finInt, embedInfo)
                    })
                }
            } else {
                daysInt.editReply({
                    content: 'Canceled',
                    components: [],
                    ephemeral: true,
                })
            }
        })
    })
}

const weekdaySort = (array) => {
    let monday = false;
    let tuesday = false;
    let wednesday = false;
    let thursday = false;
    let friday = false;
    let saturday = false;
    let sunday = false;

    for(i = 0; i < array.length; i++) {
        switch (array[i].toLowerCase()) {
            case 'monday' :
                monday = true;
                break;
            case 'tuesday' :
                tuesday = true;
                break;
            case 'wednesday' :
                wednesday = true;
                break;
            case 'thursday' :
                thursday = true;
                break;
            case 'friday' :
                friday = true;
                break;
            case 'saturday' :
                saturday = true;
                break;
            case 'sunday' :
                sunday = true;
                break;
        }
    }

    let output = []
    if(monday) {
        output.push('Monday');
    }

    if(tuesday) {
        output.push('Tuesday');
    }

    if(wednesday) {
        output.push('Wednesday');
    }

    if(thursday) {
        output.push('Thursday');
    }

    if(friday) {
        output.push('Friday');
    }

    if(saturday) {
        output.push('Saturday');
    }

    if(sunday) {
        output.push('Sunday');
    }

    return output
}

const hasWeekdays = (array) => {
    if(array[0] == 'Saturday' || array[0] === 'Sunday') {
        return false;
    }
    return true;
}

const hasWeekend = (array) => {
    const length = array.length
    if(array[length - 1] === 'Saturday' || array[length - 1] === 'Sunday') {
        return true
    }
    return false
}

const timeSimplifyer = (array) => {
    array.sort()
    return timeSegment(0, array);
}

const timeSegment = async (startIndex, array) => {
    let startTimeMil = `${array[startIndex]}`;

    let segmentSize = 0;
    let i = 0;
    let stop = false;
    while(startIndex + i + 1 <= array.length && !stop)
    {
        let time = await parseInt(array[startIndex + i], 10)
        let nextTime = await parseInt(array[startIndex + i + 1], 10)

        if(time + 100 == nextTime) {
            time = nextTime
            segmentSize++;
        } else {
            stop = true;
        }
        i++;
    }

    let text;
    if(i === 1) {
        let time = await parseInt(array[startIndex], 10) + 100;
        
        text = `${twentyFourToTwelve(startTimeMil)} through ${twentyFourToTwelve(time.toString())}`
    } else {
        text = `${twentyFourToTwelve(startTimeMil)} through ${twentyFourToTwelve(array[startIndex + i - 1])}`
    }

    if(startIndex + i < array.length) {
        let textToAdd = await timeSegment(startIndex + i, array);
        return text + ',\n' + textToAdd;
    } else {
        return text + '.'
    }
}

const twentyFourToTwelve = (value) => {
    switch (value) {
        case '0000':
        case '2400':
            return '12:00 am';
        case '100' :
        case '0100':
            return '1:00 am';
        case '200':
        case '0200':
            return '2:00 am';
        case '300':
        case '0300':
            return '3:00 am';
        case '400':
        case '0400':
            return '4:00 am';
        case '500':
        case '0500':
            return '5:00 am';
        case '600':
        case '0600':
            return '6:00 am';
        case '700':
        case '0700':
            return '7:00 am';
        case '800':
        case '0800':
            return '8:00 am';
        case '900':
        case '0900':
            return '9:00 am';
        case '1000':
            return '10:00 am';
        case '1100' :
            return '11:00 am';
        case '1200' : 
            return '12:00 pm';
        case '1300':
            return '1:00 pm';
        case '1400':
            return '2:00 pm';
        case '1500':
            return '3:00 pm';
        case '1600':
            return '4:00 pm';
        case '1700':
            return '5:00 pm';
        case '1800':
            return '6:00 pm';
        case '1900':
            return '7:00 pm';
        case '2000':
            return '8:00 pm';
        case '2100':
            return '9:00 pm';
        case '2200':
            return '10:00 pm';
        case '2300' :
            return '11:00 pm';
    }
}
 
module.exports = addOpenHours;