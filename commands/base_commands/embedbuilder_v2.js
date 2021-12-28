const { MessageEmbed } = require("discord.js");

module.exports = {
    //@param {Client} client
    name: 'embedbuilder_v2',
    description: "This is a rebuilt version of the embed building command that should hopefully make it easier to use.",
    async execute(message, args, Discord, client){
        //Enter Command Here
        if(message.member.roles.cache.has('787699492061052948')){
            //#region Inital Setup
            const prefix = "$";
            const channel = message.channel;

            const guild = channel.guild;
            //#endregion
            
            //#region Webhook Setup
            const webhooks = await channel.fetchWebhooks();
            let webhook = webhooks.first();

            if(!webhook){
                webhook = await channel.createWebhook('Embed Building Bot', {
                    avatar: 'https://img.icons8.com/external-wanicon-flat-wanicon/64/000000/external-bot-customer-services-wanicon-flat-wanicon.png',
            })}
            //#endregion

            //#region Thread Setup
            let thread;
            if(guild.premium_tier >= 2){
                thread = await channel.threads.create({
                    name: 'Custom Embed Builder',
                    autoArchiveDuration: 60,
                    type: 'GUILD_PRIVATE_THREAD',
                    reason: 'To aid in creating your Embed.'
                })
            } else {
                thread = await channel.threads.create({
                    name: 'Custom Embed Builder',
                    autoArchiveDuration: 60,
                    reason: 'To aid in creating your Embed.'
                })
            }

            await thread.members.add(message.author.id);
            //#endregion

            //#region Base Command Text
            let commandText = "\t\t\t**Custom Embed Builder**\n"
                + "\t*Use these commands to help build your embed.*\n"
                + "```"
                + `\t${prefix}title <text> | Lets you set the title.\n`
                + `\t\tUsage: ${prefix}title This is my title.\n`
                + "```"
                + "```"
                + `\t${prefix}description <text> | Lets you set the description\n`
                + `\t\tUsage: ${prefix}description This is an embed!\n`
                + "```"
                + "```"
                + `\t${prefix}color <text> | Lets you set the color of your embed.\n`
                + `\t\tUsage: ${prefix}color #ab0b00\n`
                + "```"
                + "\t\* *This is using hex colors. Use this link for help:* https://bit.ly/3FqFzVE\n"
                + "```"
                + `\t${prefix}add | Add various compenents to your embed. A sub-menu will open with component commands.\n`
                + `\t\tUsage: ${prefix}add\n`
                + "```"
                + "```"
                + `\t${prefix}finish | Finalizes embed.\n`
                + `\t\tUsage: ${prefix}finish\n`
                + "```"
                + "```"
                + `\t${prefix}cancel | Discard Embed.\n`
                + `\t\tUsage: ${prefix}cancel\n`
                + "```\n"
                + "**This is a preview of your Embed**\n"
            //#endregion

            //#region Embed Info Setup
            let embedInfo = {
                previewText: commandText,
                title: "Empty Embed",
                description: "This is an empty embed"
            }
            //#endregion

            this.previewEmbed(embedInfo, thread, webhook);
            
            //#region Collector Setup
            const filter = m => m.author.id == message.author.id;
            
            const collector = await thread.createMessageCollector({filter});
            let waitingForResponse = false;
            let waitingToFillField = false;
            let waitingToFillInlineField = false;
            //#endregion
            
            collector.on('collect', m => {
                if (!waitingForResponse) {
                    //#region Base Commands

                    if(!m.content.startsWith(prefix) || m.author.bot) {
                        return thread.send(`Command not detected. Please start your command with \'${prefix}\'`)
                    }

                    const args = m.content.slice(prefix.length).split(/ +/);
                    const command = args.shift().toLowerCase();

                    switch(command){
                        case "title":
                            embedInfo.title = m.content.slice(prefix.length + command.length);

                            this.previewEmbed(embedInfo, thread, webhook);
                            break;
                        case "description":
                            embedInfo.description = m.content.slice(prefix.length + command.length);

                            this.previewEmbed(embedInfo, thread, webhook);
                            break;
                        case "color":
                            let formatCheck = /^#[0-9A-F]{6}$/i;
                            let colorText = m.content.slice(prefix.length + command.length + 1);
                            if(!formatCheck.test(colorText)) {
                                if(formatCheck.test(`#${colorText}`))
                                {
                                    colorText = `#${colorText}`;
                                } else {
                                    console.log(`${colorText} was entered instead of a hex color. Embed Builder`)
                                    m.reply("This is not a hex color code. Format: \'#0f0f0f\'")
                                    break;
                                }
                            }

                            embedInfo.color = colorText;
                            this.previewEmbed(embedInfo, thread, webhook);
                            break;
                        case "add":
                            waitingForResponse = true;

                            //#region Add Component Text
                            thread.send("**What would you like to add?**\n"
                                + "```"
                                + `\t${prefix}cancel | Stop trying to add something.\n`
                                + `\t\tUsage: ${prefix}cancel\n`
                                + "```"
                                + "```"
                                + `\t${prefix}url <text> | Add a URL to your embed.\n`
                                + `\t\tUsage: ${prefix}url https://yoururl.here/\n`
                                + "```"
                                + "```"
                                + `\t${prefix}image <text> | Add an image to your embed.\n`
                                + `\t\tUsage: ${prefix}image https://yoururl.here/image.png\n`
                                + "```"
                                + "```"
                                + `\t${prefix}subsection <text> | Add a subsection!\n`
                                + `\t\tUsage: ${prefix}subsection Subsection Title\n\n`
                                + `\t${prefix}inline_subsection <text> | Add an inline subsection!\n *Note: Must have two or more.*\n`
                                + `\t\tUsage: ${prefix}inline_subsection Subsection Title\n\n`
                                + `\t${prefix}blank_subsection | Adds a blank line inbetween two subsections.`
                                + "```"
                                + `*Titles and bodies of subsections support <@${'&922524723341033593'}>, <#${'922523965388374066'}> calls, and emoji :grin: support.*\n`
                            );
                            //#endregion

                            break;
                        case "finish":
                            message.channel.messages.fetch({limit: 2}).then(messages =>{
                                message.channel.bulkDelete(messages);
                            });
                            
                            /*
                            let sent = message.channel.send({embeds: [this.buildEmbed(embedInfo, message, Discord)]});
                            if(typeof embedInfo.reactions !== 'undefined'){
                                for(i = 0; i < embedInfo.reactions.length; i++)
                                {
                                    sent.react(embedInfo.reactions[i])
                                }
                            }
                            */

                            collector.stop();
                            break;
                        case "cancel":
                            message.channel.messages.fetch({limit: 2}).then(messages =>{
                                message.channel.bulkDelete(messages);
                            });
                            collector.stop();
                            break;
                        default:
                            thread.send("Unknown Command.").then(() => {
                                setTimeout(() => {
                                    thread.messages.fetch({limit: 2}).then(messages =>{
                                        thread.bulkDelete(messages);
                                    });
                                }, 1500);
                            })
                            break;
                    }
                    //#endregion
                } else {
                    if (!waitingToFillField && !waitingToFillInlineField) {
                        //#region Add Component Commands
                        if(!m.content.startsWith(prefix) || m.author.bot){
                            return thread.send(`Command not detected. Please start your command with \'${prefix}\'`)
                        };
                    
                        const args = m.content.slice(prefix.length).split(/ +/);
                        const command = args.shift().toLowerCase();
                        
                        switch(command)
                        {
                            case 'cancel':
                                waitingForResponse = false;
                                this.previewEmbed(embedInfo, thread, webhook);
                                break;
                            case 'url':
                                embedInfo.url = this.mergeArgs(args);
                                waitingForResponse = false;
                                this.previewEmbed(embedInfo, thread, webhook);
                                break;
                            case 'subsection':
                                waitingToFillField = true;
                                fieldName = this.mergeArgs(args);
                                thread.send(`What would you like to add to ${fieldName}?`);
                                break;
                            case 'inline_subsection':
                                waitingToFillInlineField = true;
                                fieldName = this.mergeArgs(args);
                                thread.send(`What would you like to add to ${fieldName}?`);
                                break;
                            case 'blank_subsection':
                                field = [{name: '\u200B', value: '\u200B'}]
                                if(typeof embedInfo.fields !== 'undefined'){
                                    embedInfo.fields.push(field[0]);
                                } else {
                                    embedInfo.fields = field;
                                }
                                waitingForResponse = false;
                                this.previewEmbed(embedInfo, thread, webhook);
                                break;
                            case 'image':
                                embedInfo.image = this.mergeArgs(args);
                                waitingForResponse = false;
                                this.previewEmbed(embedInfo, thread, webhook);
                                break;
                            case 'reaction':
                                let formatCheck = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
                                let emoji = this.mergeArgs(args);
                                if(!formatCheck.test(emoji)){
                                    console.log(`${emoji} was entered as an emoji.`)
                                    return thread.send('This is not an accepted emoji. Please try again.')
                                } else {
                                    console.log(`${emoji} was collected for an emoji.`)
                                }

                                reaction = [emoji];

                                if(typeof embedInfo.reactions !== 'undefined'){
                                    embedInfo.reactions.push(reaction[0]);
                                } else {
                                    embedInfo.reactions = reaction;
                                }

                                waitingForResponse = false;
                                this.previewEmbed(embedInfo, thread, webhook)
                                break;
                            default:
                                thread.send("I dont know what youre trying to add.");
                                waitingForResponse = false;
                                break;
                        }
                        //#endregion
                    } else if (waitingToFillField){
                        //#region Adding Subsection
                        fieldText = m.content;
                        field = [{name: fieldName, value: fieldText}];

                        if(typeof embedInfo.fields !== 'undefined'){
                            embedInfo.fields.push(field[0]);
                        } else {
                            embedInfo.fields = field;
                        }

                        waitingToFillField = false;
                        waitingForResponse = false;
                        this.previewEmbed(embedInfo, thread, webhook);
                        //#endregion
                    } else if (waitingToFillInlineField){
                        //#region Adding Inline Subsection
                        fieldText = m.content;
                        field = [{name: fieldName, value: fieldText, inline: true}];

                        if(typeof embedInfo.fields !== 'undefined'){
                            embedInfo.fields.push(field[0]);
                        } else {
                            embedInfo.fields = field;
                        }

                        waitingToFillInlineField = false;
                        waitingForResponse = false;
                        this.previewEmbed(embedInfo, thread, webhook);
                        //#endregion
                    } 
                }
            })

            collector.on('end', collected => {
                thread.delete();
                webhook.delete();
            })
            
        } else {
            return message.reply('Incorrect Permissions.');
        }
    },

    async previewEmbed(embedInfo, thread, webhook){

        let newEmbed = new MessageEmbed();

        if(typeof embedInfo.color !== 'undefined'){
            newEmbed.setColor(embedInfo.color);
        }
        else{
            newEmbed.setColor('#ab0b00');
        }

        if(typeof embedInfo.title !== 'undefined'){
            newEmbed.setTitle(embedInfo.title);
        }
        if(typeof embedInfo.title !== 'undefined'){
            newEmbed.setDescription(embedInfo.description);
        }
        if(typeof embedInfo.url !== 'undefined'){
            newEmbed.setURL(embedInfo.url);
        }
        if(typeof embedInfo.fields !== 'undefined'){
            newEmbed.setFields(embedInfo.fields);
        }
        if(typeof embedInfo.image !== 'undefined'){
            newEmbed.setImage(embedInfo.image);
        }
        
        let sent = await webhook.send({
            content: embedInfo.previewText, 
            embeds: [newEmbed],
            threadId: thread.id
        });

        /*
        if(typeof embedInfo.reactions !== 'undefined')
        {
            for(i = 0; i < embedInfo.reactions.length; i++)
            {
                console.log(`Trying to add ${embedInfo.reactions[i]} as a reaction.`)
                await sent.react(`${embedInfo.reactions[i]}`)
            }
        }
        */
    },

    buildEmbed(embedInfo){
        let newEmbed = new MessageEmbed();

        newEmbed.setTitle(embedInfo.title)
        newEmbed.setDescription(embedInfo.description)

        if(typeof embedInfo.color !== 'undefined'){
            newEmbed.setColor(embedInfo.color);
        } else{
            newEmbed.setColor('#ab0b00');
        }
        
        if(typeof embedInfo.url !== 'undefined'){
            newEmbed.setURL(embedInfo.url);
        }
        if(typeof embedInfo.fields !== 'undefined'){
            newEmbed.setFields(embedInfo.fields);
        }
        if(typeof embedInfo.image !== 'undefined'){
            newEmbed.setImage(embedInfo.image);
            newEmbed.setThumbnail(embedInfo.image);
        }

        newEmbed.setTimestamp();

        return newEmbed
    },

    mergeArgs(args)
    {
        let concat = "";
        args.forEach(arg => {
            concat += " " + arg;
        });
        return concat;
    }
}