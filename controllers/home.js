module.exports = ({ router }) => {
    const routes = router()

    routes.get('/', (req, res) => {
        res.send('home page')
    })

    return routes
}