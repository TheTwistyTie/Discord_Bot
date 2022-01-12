const {MessageActionRow, MessageButton} = require("discord.js");

const formatHours = async (daysOpen, hoursOpen, interaction, embedInfo) => {
    let output = ''

    if(hoursOpen.weekdayTimes != null) {
        if(isAllWeek(daysOpen)) {
            output += `Weekdays:\n ${hoursOpen.weekdayTimes}\n`
        } else {
            output += formatWeekdays(daysOpen) + `${hoursOpen.weekdayTimes}\n`
        }
    }

    if(hoursOpen.weekendTimes != null) {
        if(isAllWeekend(daysOpen)) {
            output += `Weekends:\n ${hoursOpen.weekendTimes}\n`
        } else {
            output += `${daysOpen[daysOpen.length - 1]}:\n ${hoursOpen.weekendTimes}\n`
        }
    }

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

    const btnMsg = await interaction.reply({
        content: `${output}`,
        components: [row],
        ephemeral: true,
        fetchReply: true,
    })

    const confCollector = await btnMsg.createMessageComponentCollector({
        btnFilter,
        max: 1,
    })

    confCollector.on('collect', async (btnInt) => {
        if(btnInt.customId === 'continue') {
            interaction.editReply({
                content: 'Confimed',
                components: [],
                ephemeral: true,
            })
            embedInfo.addOpenHours(output);
        } else {
            interaction.editReply({
                content: 'Canceled',
                components: [],
                ephemeral: true,
            })
        }

        const createResource = require("./createResource");
        createResource(embedInfo.resourceType, btnInt, embedInfo);
    })
}

const isAllWeek = (days) => {
    if(days.length < 5) return false;

    let monday = false;
    let tuesday = false;
    let wednesday = false;
    let thursday = false;
    let friday = false;

    for(i = 0; i < days.length; i++) {
        switch (days[i].toLowerCase()) {
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
        }
    }

    if(monday && tuesday && wednesday && thursday && friday) {
        return true;
    }
    return false;
}

const formatWeekdays = (days) => {
    let output = ''
    for(i = 0; i < days.length; i++) {
        if(days[i] === 'Saturday' || days[i] === 'Sunday') break;

        if(i != 0) output += ", "
        output += days[i];
    }
    return output + ":\n"
}

const isAllWeekend = (days) => {
    const length = days.length;

    if(length < 2) {
        return false;
    }

    if(days[days.length - 1] === 'Sunday' && days[days.length - 2] === 'Saturday') {
        return true;
    }

    return false;
}

module.exports = formatHours