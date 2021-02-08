const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { session } = require('passport');
const passport = require('passport');
const User = require('../models/user');



const isValidPassword = function(user, password) {
    return bcrypt.compareSync(password, user.password);
}

module.exports = ({ router, actions, models }) => {
    const routes = router()
    const user = actions.user(models)

    routes.get('/', passport.authenticate('jwt', { session: false }), async(req, res) => {
        var users = await user.getPage(0, 10)
        res.send(users)
    })

    routes.post('/login', async(req, res) => {
        console.log(req.body)
        const login = req.body.login
        const password = req.body.password
        try {
            const User = await user.get(login)
            if (isValidPassword(User, password)) {
                const token = jwt.sign({
                    sub: User._id,
                    login: User.login
                }, 'secret', { expiresIn: 3600 * 2 })
                res.cookie('jwt', token, { maxAge: 900000, httpOnly: true })
                res.send({
                    token: `JWT: ${token}`,
                    user: {
                        id: User._id,
                        login: User.login
                    }
                })
            } else {
                res.send({ error: 'Не верный пароль' })
            }
        } catch (e) {
            console.log(e)
            res.send({ error: 'Пользователь не найден' })
        }
    })

    routes.put('/adduser', async(req, res, next) => {
        try {
            if (req.body.login.length >= 5 && req.body.password.length >= 8) {
                var group = req.body.group || 'user'
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(req.body.password, salt);
                var User = await user.add({
                    login: req.body.login,
                    password: hash,
                    froup: group
                })

                res.send(User.login + " added")
            } else {
                const err = new Error('не коректные данные');
                err.status = 400;
                next(err)
            }
        } catch (e) {
            next(e);
        }
    })
    routes.delete('/:login', async(req, res) => {
        var target = await user.delete(req.params.login)
        res.send(target)
    })

    return routes
}