const db = require('monk')(process.env.MONGO_STRING)

module.exports = {
    key_collection: db.get("apiKeys"),
    scammer_collection: db.get("scammer_list"),
}