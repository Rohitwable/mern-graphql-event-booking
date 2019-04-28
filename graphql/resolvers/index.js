const bcrypt = require('bcryptjs')

//models
const Event = require('../../models/event')
const User = require('../../models/user')
const Booking = require('../../models/booking')

const { dateToString } = require('../../helpers/date')

const transformEvent = event => {
    return {
        ...event._doc,
        _id: event.id,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    }
}
const transformBooking = booking => {
    return {
        ...booking._doc,
        _id: booking.id,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this,
            booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    }
}
const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId)
        return transformEvent(event)
    } catch (err) {
        throw err
    }
}
const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } })
        events.map(event => {
            return transformEvent(event)
        })
    }
    catch (err) {
        throw err
    }
}

const user = async userId => {
    try {
        const user = await User.findById(userId)
        return { ...user._doc, _id: user.id, createdEvents: events.bind(this, user._doc.createdEvents) }
    }
    catch (err) {
        throw err
    }
}
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
    bookings: async () => {
        try {
            const bookings = await Booking.find()
            return bookings.map(booking => {
                return transformBooking(booking)
            })
        } catch (err) {
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
    },
    createUser: async args => {
        try {
            const userExist = await User.findOne({ email: args.userInput.email })
            if (userExist) {
                throw new Error('User already exist')
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            })
            const result = await user.save()
            return { ...result._doc, password: null, _id: result.id }

        } catch (err) {
            throw err
        }
    },
    bookEvent: async args => {
        const fetchedEvent = await Event.findOne({ _id: args.eventId })
        const booking = new Booking({
            user: '5cc58e7dfcd66a0b446de53f',
            event: fetchedEvent
        })
        const result = await booking.save()
        return transformBooking(result)
    },
    cancelBooking: async args => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('event')
            const event = transformEvent(booking.event)
            await Booking.deleteOne({ _id: args.bookingId })
            return event
        }
        catch (err) {
            throw err
        }
    }
}