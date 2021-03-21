const db = require('monk')(process.env.MONGO_STRING, { collectionOptions: { castIds: false }, authSource: 'admin' })

module.exports = {
    key_collection: db.get("apiKeys"),
    scammer_collection: db.get("scammer_list"),
}