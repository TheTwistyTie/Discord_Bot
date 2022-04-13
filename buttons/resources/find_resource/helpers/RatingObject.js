class RatingObject {
    #embed
    constructor(embed) {
        this.#embed = embed
    }

    message;
    async addMessage(channel) {
        this.message = await channel.send({
            embeds: [this.#embed],
            fetchReply: true
        })
    }

    removeMessage () {
        if(typeof this.message !== 'undefined') {
            this.message.delete()
        }
    }
}

module.exports = RatingObject