const { key_collection: coll } = require('./database');


const permissions = {
    "/scammer": "query_scammer"
}


module.exports = {
    async apiKey(req, res, next) {
        const key = req.query.key;

        if (!key) {
            res.status(401);
            res.json({ error: "unauthorized", cause: "missing API key" });
            return;
        }
        const key_doc = await coll.findOne({ key: key });
        if (key_doc == null) {
            res.status(401);
            res.json({ error: "unauthorized", cause: "invalid API key" });
            return;
        }
        if (!(key_doc.permissions.includes("all") || key_doc.permissions.includes(permissions[req.path]))) {
            res.status(403);
            res.json({ error: "forbidden", cause: "missing permissions" });
            return;
        }
        if (key_doc.uses_minute >= key_doc.limit && Math.floor(Date.now() / 1000 / 60) == key_doc.last_req) {
            res.header("Retry-After", (((Math.floor(Date.now() / 1000 / 60)) + 1) * 60) - Math.floor(Date.now() / 1000));
            res.status(429);
            res.json({ error: "too many requests", cause: "ratelimit exceeded" })
            return;
        }
        const new_uses_minute = key_doc.last_req == Math.floor(Date.now() / 1000 / 60) ? key_doc.uses_minute + 1 : 0;
        await coll.findOneAndUpdate(key_doc, { $set: { last_req: Math.floor(Date.now() / 1000 / 60), uses_minute: new_uses_minute }, $inc: { total_requests: 1 } })
        req.key = await coll.findOne({ key: key })

        next();
    }
}