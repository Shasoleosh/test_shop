const passport = require('passport');
let auth = passport.authenticate('jwt', {
    session: false
});

module.exports = ({ router, actions, models }) => {

    const routes = router()
    const product = actions.product(models)

    routes.get('/', async(req, res) => {
        var page = req.query.page || 1
        var pageSize = req.query.pageSize || 5
        var search = req.query.search || ".*"
        var order = req.query.order || 0
        var price = (req.query.price || "0-99999").split('-')
        var priceStart = Number(price[0])
        var priceEnd = Number(price[1])

        var data = await product.getPage((pageSize * page) - pageSize, pageSize, search, order, priceStart, priceEnd)
        res.send(data)
    })

    routes.get('/:id', async(req, res) => {
        var target = await product.get(req.params.id)
        res.send(target)
    })

    routes.delete('/', auth, async(req, res) => {
        await models.product.deleteMany()
        res.send('full clear')
    })

    routes.delete('/:id', auth, async(req, res) => {
        var target = await product.delete(req.params.id)
        res.send(target)
    })

    routes.put('/', auth, async(req, res) => {
        console.log(req.body)
        var target = await product.add(req.body.payload)
        res.send(target)
    })

    return routes
}