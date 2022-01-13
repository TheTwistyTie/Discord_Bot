const Reports = require('../models/Reports')

const bannedWordsArray = [
    'bitch',
    'bitches',

    'boob',
    'boobs',
    'boobies',

    'cock',
    'cocks',
    'cocked',

    'cunt',
    'cunts',
    'cunted',
    'thundercunt',

    'cum',
    'cumming',
    'cumdump',

    'skullfuck',
    'felcher',
    'blumpkin',

    'dick',
    'dicks',
    'dicked',
    'dickhead',

    'fuck',
    'fucks',
    'fucked',
    'fuckbitch',
    'motherfucker',
    'motherfucking',
    'fucking',
    'fucker',
    'fucktoy',
    'fuk',

    'shit',
    'shitting',

    'bastard',
    'bellend',
    
    'bloodclaat',
    'battyboy',
    'battyboi',
    'batty',
    
    'chilf',
    'choad',
    'clunge',
    'felch',
    'minge',
    'prick',
    'punani',
    'pussy',
    'snatch',
    
    'tits',
    'titties',
    'tities',
    
    'twat',
    
    'nigger',
    'nigga',
    'spick',
    'wetbag',
    'spic',
    'fag',
    'faggot',
    'pato',
    'fudgepacker',
    
]

const moderationChannel = '787708029781016587';

const bannedWords = async (message, client) => {
    const {channel, author} = message;

    const text = message.content;
    const words = text.toLowerCase().split(' ');
    let wordsObj = {};
    
    for(let i = 0; i < words.length; i++) {
        if(!wordsObj[words[i]]) {
            wordsObj[words[i]] = true;
        }
    }

    let bannedWordIndex = [];
    for(let i = 0; i < bannedWordsArray.length; i++) {
        if(wordsObj[bannedWordsArray[i]]) {
            bannedWordIndex.push(i);
        }
    }

    if(bannedWordIndex.length > 0) {
        message.delete();

        wordsUsed = []
        for(let i = 0; i < bannedWordIndex.length; i++) {
            wordsUsed.push(bannedWordsArray[bannedWordIndex[i]])
        }

        client.channels.cache.get(moderationChannel).send(`In <#${channel.id}>, <@${author.id}> sent: \n${text}\n\n The following words are banned: ${wordsUsed}`)

        channel.send(`<@${author.id}> please do not use inappropriate words.`).then((msg) => setTimeout(() => {
            msg.delete()
        }, 2000))

        let previousReports = await Reports.findOne({id: author.id})
        if(!previousReports) {
            previousReports = new Reports({
                id: author.id,
                name: author.username,
            })
        }

        previousReports.automoderation.push( {
            words: wordsUsed,
            timestamp: new Date()
        })

        previousReports.save(err => {
            if(err) {
                console.log(err);
                return;
            }
        })
        
    }

    return null;
}

module.exports = bannedWords
