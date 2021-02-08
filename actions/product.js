module.exports = ({ product }) => ({
    add: async(payload) => {

        var id = await product.find().sort({ articule: -1 }).limit(1)
        id = id[0] == undefined ?
            1 :
            Number(id[0].articule) + 1

        var scale = 5
        var articule = ""
        for (var i = 0; i < scale - id.toString().length; i++) {
            articule += "0"
        }
        articule += id

        const { name, description, type, color, image, price } = payload
        const p = new product({
            name,
            description,
            articule,
            createDate: new Date(),
            type,
            color,
            image,
            price
        })
        return p.save()
    },

    delete: (articule) => {
        return product.findOneAndDelete({ articule })
    },

    update: (articule, payload) => {
        return product.findOneAndUpdate({ articule }, payload)
    },

    get: (articule) => {
        return product.findOne({ articule })
    },

    getPage: (start, size, search, orderBy, priceStart, priceEnd) => {
        let orders = [
            { name: 1 },
            { price: 1 },
            { price: -1 },
            { createDate: 1 },
            { createDate: -1 }
        ]
        orderBy = orderBy <= orders.length - 1 ? orderBy : 1
        priceStart = priceStart >= 0 && priceStart <= priceEnd ? priceStart : 0
        priceEnd = priceEnd <= 99999 && priceEnd >= priceStart ? priceEnd : 99999

        return product.find({ name: { $regex: search, $options: 'gmi' }, price: { $gte: priceStart, $lte: priceEnd } }).sort(orders[orderBy]).skip(Number(start)).limit(Number(size))
    }
})