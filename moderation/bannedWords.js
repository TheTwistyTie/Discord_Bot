const Reports = require('../models/Reports')

const bannedWordsArray = [
    'a55',
    'a55hole',
    'aeolus',
    'ahole',
    'anal',
    'analprobe',
    'anilingus',
    'anus',
    'areola',
    'areole',
    'arian',
    'aryan',
    'ass',
    'assbang',
    'assbanged',
    'assbangs',
    'asses',
    'assfuck',
    'assfucker',
    'assh0le',
    'asshat',
    'assho1e',
    'assholes',
    'assmaster',
    'assmunch',
    'asswipe',
    'asswipes',
    'azazel',
    'azz',

    'ballsack',
    'bastard',
    'bastards',
    'bawdy',
    'beaner',
    'beardedclam',
    'beastiality',
    'beatch',
    'beater',
    'beaver',
    'beeyotch',
    'beotch',
    'biatch',
    'bigtits',
    'b1tch',
    'bitch',
    'bitched',
    'bitches',
    'bitchy',
    'blowjob',
    'blowjobs',
    'boink',
    'bollock',
    'bollocks',
    'bollok',
    'boned',
    'boner',
    'boners',
    'bong',
    'boob',
    'boobs',
    'boobies',
    'booby',
    'bookie',
    'bootee',
    'bootie',
    'booty',
    'booze',
    'boozer',
    'boozy',
    'bosom',
    'bosomy',
    'bowel',
    'bowels',
    'bugger',
    'bukkake',
    'bullshit',
    'bullshits',
    'bullshitted',
    'bullturds',
    'bung',
    'busty',
    'buttfuck',
    'buttfucker',
    'buttfucker',
    'buttplug',
    'blumpkin',
    'bellend',
    'bloodclaat',
    'battyboy',
    'battyboi',
    'batty',

    'c.0.c.k',
    'c.o.c.k.',
    'c.u.n.t',
    'c0ck',
    'c-0-c-k',
    'caca',
    'cahone',
    'cameltoe',
    'carpetmuncher',
    'cawk',
    'chinc',
    'chincs',
    'chink',
    'chink',
    'chode',
    'chodes',
    'cl1t',
    'climax',
    'clit',
    'clitoris',
    'clitorus',
    'clits',
    'clitty',
    'cocain',
    'cocaine',
    'cock',
    'cocks',
    'cocked',
    'c-o-c-k',
    'cockblock',
    'cockholster',
    'cockknocker',
    'cocks',
    'cocksmoker',
    'cocksucker',
    'coital',
    'commie',
    'condom',
    'coon',
    'coons',
    'corksucker',
    'crack',
    'crackwhore',
    'cum',
    'cummin',
    'cumming',
    'cumdump',
    'cumshot',
    'cumshots',
    'cumslut',
    'cumstain',
    'cunilingus',
    'cunnilingus',
    'cunny',
    'cunt',
    'cunt',
    'c-u-n-t',
    'cuntface',
    'cunthunter',
    'cuntlick',
    'cuntlicker',
    'cunts',
    'cunted',
    'thundercunt',

    'd0ng',
    'd0uch3',
    'd0uche',
    'd1ck',
    'd1ld0',
    'd1ldo',
    'dago',
    'dagos',
    'dawgie-style',
    'dick',
    'dickbag',
    'dickdipper',
    'dickface',
    'dickflipper',
    'dickhead',
    'dickheads',
    'dickish',
    'dick-ish',
    'dickripper',
    'dicksipper',
    'dickweed',
    'dickwhipper',
    'dickzipper',
    'diddle',
    'dike',
    'dildo',
    'dildos',
    'diligaf',
    'dillweed',
    'dimwit',
    'dingle',
    'dipship',
    'doggie-style',
    'doggy-style',
    'dong',
    'douch3',
    'douche',
    'douchebag',
    'douchebags',
    'douchey',
    'dyke',
    'dykes',
    'dicks',
    'dicked',

    'ejaculate',
    'enlargement',
    'erect',
    'erection',
    'erotic',
    'essohbee',
    'extacy',
    'extasy',

    'f.u.c.k',
    'fack',
    'fag',
    'fagg',
    'fagged',
    'faggit',
    'faggot',
    'fagot',
    'fags',
    'faig',
    'faigt',
    'fannybandit',
    'fartknocker',
    'felch',
    'felcher',
    'felching',
    'fellate',
    'fellatio',
    'feltch',
    'feltcher',
    'fisted',
    'fisting',
    'fisty',
    'floozy',
    'foad',
    'fondle',
    'fuck',
    'fucks',
    'fucked',
    'fuckbitch',
    'motherfucker',
    'motherfucking',
    'fucking',
    'fucker',
    'fucktoy',
    'skullfuck',
    'freex',
    'frigg',
    'frigga',
    'fubar',
    'fuck',
    'f-u-c-k',
    'fuckass',
    'fucked',
    'fucked',
    'fucker',
    'fuckface',
    'fuckin',
    'fucking',
    'fucknugget',
    'fucknut',
    'fuckoff',
    'fucks',
    'fucktard',
    'fuck-tard',
    'fuckup',
    'fuckwad',
    'fuckwit',
    'fudgepacker',
    'fuk',
    'fvck',
    'fxck',

    'gae',
    'gai',
    'ganja',
    'gey',
    'gfy',
    'ghay',
    'ghey',
    'gigolo',
    'glans',
    'goatse',
    'goldenshower',
    'gonad',
    'gonads',
    'gook',
    'gooks',
    'gringo',
    'gspot',
    'g-spot',
    'gtfo',
    'guido',

    'h0m0',
    'h0mo',
    'handjob',
    'he11',
    'hebe',
    'heeb',
    'hell',
    'hemp',
    'heroin',
    'herp',
    'herpes',
    'herpy',
    'hitler',
    'hiv',
    'hobag',
    'hom0',
    'homo',
    'homoey',
    'honky',
    'hooch',
    'hookah',
    'hooker',
    'hoor',
    'hootch',
    'hooter',
    'hooters',
    'horny',
    'hump',
    'humped',
    'humping',
    'hussy',
    'hymen',

    'inbred',
    'incest',
    'injun',

    'j3rk0ff',
    'jackass',
    'jackhole',
    'jackoff',
    'jap',
    'japs',
    'jerk',
    'jerk0ff',
    'jerked',
    'jerkoff',
    'jism',
    'jiz',
    'jizm',
    'jizz',
    'jizzed',
    'junkie',
    'junky',

    'kike',
    'kikes',
    'kill',
    'kinky',
    'kkk',
    'klan',
    'knobend',
    'kooch',
    'kooches',
    'kootch',
    'kraut',
    'kyke',

    'labia',
    'lech',
    'leper',
    'lesbians',
    'lesbo',
    'lesbos',
    'lez',
    'lezbian',
    'lezbians',
    'lezbo',
    'lezbos',
    'lezzie',
    'lezzies',
    'lezzy',
    'lusty',
    
    'mams',
    'massa',
    'masterbate',
    'masterbating',
    'masterbation',
    'masturbate',
    'masturbating',
    'masturbation',
    'maxi',
    'menses',
    'menstruate',
    'menstruation',
    'meth',
    'm-fucking',
    'mofo',
    'molest',
    'moolie',
    'moron',
    'motherfucka',
    'motherfucker',
    'motherfucking',
    'mtherfucker',
    'mthrfucker',
    'mthrfucking',
    'muff',
    'muffdiver',
    'murder',
    'muthafuckaz',
    'muthafucker',
    'mutherfucker',
    'mutherfucking',
    'muthrfucking',

    'nad',
    'nads',
    'naked',
    'napalm',
    'nappy',
    'nazi',
    'nazism',
    'negro',
    'nigga',
    'niggah',
    'niggas',
    'niggaz',
    'nigger',
    'nigger',
    'niggers',
    'niggle',
    'niglet',
    'nimrod',
    'ninny',
    'nipple',
    'nooky',
    'nympho',

    'opiate',
    'opium',
    'oral',
    'orally',
    'organ',
    'orgasm',
    'orgasmic',
    'orgies',
    'orgy',
    'ovary',
    'ovum',
    'ovums',

    'p.u.s.s.y.',
    'paddy',
    'paki',
    'pantie',
    'panties',
    'panty',
    'pastie',
    'pasty',
    'pato',
    'pcp',
    'pecker',
    'pedo',
    'pedophile',
    'pedophilia',
    'pedophiliac',
    'pee',
    'peepee',
    'penetrate',
    'penetration',
    'penial',
    'penile',
    'penis',
    'perversion',
    'peyote',
    'phalli',
    'phallic',
    'phuck',
    'pillowbiter',
    'pimp',
    'pinko',
    'piss',
    'pissed',
    'pissoff',
    'piss-off',
    'pms',
    'polack',
    'pollock',
    'poon',
    'poontang',
    'porn',
    'porno',
    'pornography',
    'pot',
    'potty',
    'prick',
    'prig',
    'prostitute',
    'prude',
    'pube',
    'pubic',
    'pubis',
    'punkass',
    'punky',
    'puss',
    'pussies',
    'pussy',
    'pussypounder',
    'puto',
    'prick',
    'punani',

    'queaf',
    'queef',
    'queef',
    'queero',
    'quicky',
    'quim',

    'racy',
    'rape',
    'raped',
    'raper',
    'rapist',
    'raunch',
    'rectal',
    'rectum',
    'rectus',
    'reefer',
    'reetard',
    'reich',
    'retard',
    'retarded',
    'revue',
    'rimjob',
    'ritard',
    'rtard',
    'r-tard',
    'rum',
    'rump',
    'rumprammer',
    'ruski',
    
    's.h.i.t.',
    's.o.b.',
    's0b',
    'sadism',
    'sadist',
    'scag',
    'scantily',
    'schizo',
    'schlong',
    'screw',
    'screwed',
    'scrog',
    'scrot',
    'scrote',
    'scrotum',
    'scrud',
    'scum',
    'seaman',
    'seamen',
    'seduce',
    'semen',
    'sex',
    'sexual',
    'sh1t',
    's-h-1-t',
    'shamedame',
    'shit',
    's-h-i-t',
    'shite',
    'shiteater',
    'shitface',
    'shithead',
    'shithole',
    'shithouse',
    'shits',
    'shitt',
    'shitted',
    'shitter',
    'shitty',
    'shiz',
    'sissy',
    'skag',
    'skank',
    'slave',
    'sleaze',
    'sleazy',
    'slut',
    'slutdumper',
    'slutkiss',
    'sluts',
    'smegma',
    'smut',
    'smutty',
    'snatch',
    'sniper',
    'snuff',
    's-o-b',
    'sodom',
    'souse',
    'soused',
    'sperm',
    'spic',
    'spick',
    'spik',
    'spiks',
    'spooge',
    'spunk',
    'steamy',
    'stfu',
    'stiffy',
    'stoned',
    'strip',
    'stroke',
    'sucking',
    'sumofabiatch',

    't1t',
    'tampon',
    'tard',
    'tawdry',
    'teabagging',
    'teat',
    'terd',
    'teste',
    'testee',
    'testes',
    'testicle',
    'testis',
    'thrust',
    'thug',
    'tinkle',
    'tit',
    'titfuck',
    'titi',
    'tits',
    'tittiefucker',
    'titties',
    'tities',
    'tatas',
    'titty',
    'tittyfuck',
    'tittyfucker',
    'toke',
    'toots',
    'tramp',
    'trashy',
    'tubgirl',
    'turd',
    'tush',
    'twat',
    'twats',

    'ugly',
    'undies',
    'unwed',
    'urinal',
    'urine',
    'uterus',
    'uzi',

    'vag',
    'vagina',
    'valium',
    'viagra',
    'virgin',
    'vixen',
    'vodka',
    'vomit',
    'voyeur',
    'vulgar',
    'vulva',

    'wad',
    'wang',
    'wank',
    'wanker',
    'wazoo',
    'wedgie',
    'weed',
    'weenie',
    'weewee',
    'weiner',
    'weirdo',
    'wench',
    'wetback',
    'wetbag',
    'wh0re',
    'wh0reface',
    'whitey',
    'whiz',
    'whoralicious',
    'whore',
    'whorealicious',
    'whored',
    'whoreface',
    'whorehopper',
    'whorehouse',
    'whores',
    'whoring',
    'wigger',
    'woody',
    'wop',

    'x-rated',
    'xxx',

    'yeasty',
    'yobbo',

    'zoophile',
 
    'shit',
    'shitting',
    'bastard',
    'chilf',
    'choad',
    'clunge',
    'felch',
    'minge',
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
