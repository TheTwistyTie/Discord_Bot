const { MessageActionRow, MessageButton } = require("discord.js");
const { listIndexes } = require("../../../../models/ResourceSettings");
//const ResourceObject = require("./ResourceObject");

class PageHandler {
    #items = []
    #channel;
    #userId;

    constructor(providers, channel, userId) {

        if(providers.length > 0 || typeof providers == 'undefined') {
            this.#items = providers;

            this.#channel = channel;
            this.#userId = userId;

            this.init() 
        } else {
            console.log('Provider list empty.')
        }
    }

    pageSize = 4;
    numPages;
    currentPage = 1;
    messageIndexs = [];

    init() {

        this.numPages = parseInt(this.#items.length / this.pageSize, 10);
        if(this.#items.length % this.pageSize != 0) {
            this.numPages++
        }

        if(this.numPages == 1) {
            for(i = 0; i < this.#items.length; i++) {
                this.messageIndexs.push(i)
            }
            this.show();
        } else {
            for(i = 0; i < this.pageSize; i++) {
                this.messageIndexs.push(i)
            }
            this.show();
        }

        this.pageController()
    }

    clear(indexs) {
        if(typeof indexs === 'undefined') {
            this.#items.forEach(resource => {
                resource.removeMessage()
            })
        } else {
            indexs.forEach(index => {
                this.#items[index].removeMessage()
            })
        }

        this.messageIndexs = []
        this.pageMsg.delete()
    }

    show() {
        for(i = 0; i < this.messageIndexs.length; i++) {
            this.#items[this.messageIndexs[i]].addMessage(this.#channel, this.#userId);
        }
    }

    pageMsg;
    async pageController () {
        setTimeout(async () => {
            let prevPageButton;
            if(this.currentPage > 1) {
                prevPageButton = new MessageButton()
                    .setLabel('Previous Page.')
                    .setCustomId('prev_page')
                    .setStyle('PRIMARY')
            } else {
                prevPageButton = new MessageButton()
                    .setLabel('Previous Page.')
                    .setCustomId('prev_page')
                    .setStyle('PRIMARY')
                    .setDisabled(true)
            }

            let nextPageButton 
            if(this.currentPage < this.numPages) {
                nextPageButton = new MessageButton()
                    .setLabel('Next Page.')
                    .setCustomId('next_page')
                    .setStyle('PRIMARY')
            } else {
                nextPageButton = new MessageButton()
                    .setLabel('Next Page.')
                    .setCustomId('next_page')
                    .setStyle('PRIMARY')
                    .setDisabled(true)
            }

            const row = new MessageActionRow()
                .addComponents(
                    prevPageButton,
                    nextPageButton
                )

            this.pageMsg = await this.#channel.send({
                content: `You are on page ${this.currentPage} out of ${this.numPages}`,
                components: [row],
                fetchReply: true,
            })

            const filter = (reactionInt) => {
                return this.#userId === reactionInt.user.id
            }

            const pageCollector = this.pageMsg.createMessageComponentCollector({
                filter,
                max: 1
            })

            pageCollector.on('collect', (btnInt) => {
                switch (btnInt.customId) {
                    case 'next_page':
                        this.currentPage++
                        this.clear(this.messageIndexs)
                        
                        if(this.currentPage < this.numPages) {

                            for(i = 0; i < this.pageSize; i++) {

                                this.messageIndexs.push(((this.currentPage - 1) * this.pageSize) + i)
                            }

                        } else if (this.currentPage == this.numPages) {
                        
                            let numRemaining = this.#items.length - ((this.currentPage - 1) * this.pageSize)

                            for(i = 0; i < numRemaining; i++) {
                                this.messageIndexs.push(((this.currentPage - 1) * this.pageSize) + i)
                            }

                        }

                        this.show()
                        break;

                    case 'prev_page':

                        this.currentPage--
                        this.clear(this.messageIndexs)
                        
                        for(i = 0; i < this.pageSize; i++) {
                            this.messageIndexs.push(((this.currentPage - 1) * this.pageSize) + i)
                        }
                        this.show()
                        break;
                }

                this.pageController()
            })

        }, 750)
    }
}

module.exports = PageHandler