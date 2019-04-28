const bcrypt = require('bcryptjs')

//models
const User = require('../../models/user')


module.exports = {
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
    }
}