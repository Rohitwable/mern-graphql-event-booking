const Event = require('../../models/event')
const { transformEvent } = require('./merge')

module.exports = {
    events: async () => {
        try {
            const events = await Event.find()
            return events.map(event => {
                return transformEvent(event)
            })
        }
        catch (err) {
            throw err
        }
    },
    createEvent: async args => {
        try {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '5cc58e7dfcd66a0b446de53f'
            })
            let createdEvent
            const result = await event.save()
            createdEvent = transformEvent(result)
            const user = await User.findById('5cc58e7dfcd66a0b446de53f')
            if (!user) {
                throw new Error('User not found')
            }
            user.createdEvents.push(event)
            await user.save()
            return createdEvent
        } catch (err) {
            throw err
        }
    }
}