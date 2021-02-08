module.exports = ({ user }) => ({
    add: (payload) => {
        const { login, password, group } = payload
        const u = new user({
            login,
            password,
            group
        })
        return u.save()
    },

    delete: (login) => {
        return user.findOneAndDelete({ login })
    },

    update: (login, payload) => {
        return user.findOneAndUpdate({ login }, payload)
    },

    get: (login) => {
        return user.findOne({ login })
    },

    getPage: (start, size) => {
        return user.find().skip(start).limit(size)
    }
})