const express = require('express'),
    bodyParser = require('body-parser'),
    inject = require('require-all'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    passportConfig = require('./pasport-config'),
    cookieParser = require('cookie-parser')

const app = express(),
    router = express.Router,
    port = 3000;


app.use(passport.initialize())
app.use(passport.session())
passportConfig(passport)

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/product/image', express.static('./public/product'));

try {
    const controllers = inject(__dirname + '/controllers')
    const actions = inject(__dirname + '/actions')
    const models = inject(__dirname + '/models')
    console.log(models)
    mongoose.connect('mongodb://localhost/MongoDB', { useNewUrlParser: true })

    mongoose.connection
        .on('error', console.error.bind(console, '[mongodb] connection error:'))
        .once('open', console.log.bind(console, '[mongodb]: Database connected'))

    for (const name in controllers) {
        app.use(`/${name == 'home' ? '' : name}`, controllers[name]({ router, actions, models }))
    }
} catch (e) {
    console.error(e)
}


app.listen(port, () => console.log(`[express]: Start on port ${port}`))