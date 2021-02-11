const express = require('express');

const { getProfile, getAllItems, getStats, getPrices, getAuctions } = require('./util');
const app = express();



app.get('/prices', (req, res) => {
    res.json(getPrices());
})

app.get('/auctions', (req, res) => {
    res.json({auctions: getAuctions()});
})

app.get('/stats/:profile', async(req, res) => {
    try {
        const { profile, allProfiles } = await getProfile(req.params.profile, null, req.query.key, { cacheOnly: req.cacheOnly });

        const output = { profiles: {} };

        for (const singleProfile of allProfiles) {
            if (singleProfile.members[profile.uuid] == undefined) allProfiles.splice(allProfiles.indexOf(singleProfile), 1);
        }

        for (const singleProfile of allProfiles) {
            const userProfile = singleProfile.members[profile.uuid];
            if (userProfile == undefined) {
                allProfiles.splice(allProfiles.indexOf(singleProfile), 1);
                continue
            };
            const items = await getAllItems(userProfile, req.query.pack);
            const data = await getStats(singleProfile, allProfiles, items);
            const networth = {}
            const NETWORTH_INVS = ["armor", "wardrobe_inventory", "inventory", "enderchest", "talisman_bag", "fishing_bag", "quiver", "potion_bag"];
            Object.keys(items).forEach(inv => {
                if (NETWORTH_INVS.includes(inv)) {
                    networth[inv] = 0;
                    for (let item of items[inv]) {
                        networth[inv] += item.coin_value?item.coin_value:0;
                    }
                }
            }); 
            networth.pets = data.pets.reduce((a, b) => a + (b.coin_value?b.coin_value:0), 0);
            networth.total = Object.values(networth).reduce((a, b) => a + b, 0);
            const stats = data.stats;
            output.success = true;
            output.profiles[singleProfile.profile_id] = {
                profile_id: singleProfile.profile_id,
                cute_name: singleProfile.cute_name,
                current: Math.max(...allProfiles.map(a => a.members[profile.uuid].last_save)) == userProfile.last_save,
                last_save: userProfile.last_save,
                // raw: userProfile,
                // items,
                networth,
                data: {
                    stats
                }
            };
        }

        res.json(output);
    } catch (e) {
        console.log(e);
        // if (e == "Request to Hypixel API failed. Please try again!") {
        //     res.json({"success": false, "message": "invalid api key/hypixel api error"})
        // }
        switch (e) {
            case "Request to Hypixel API failed. Please try again!":
                res.json({ "success": false, "message": "invalid api key/hypixel api error" })
                break;
            case "must be uuid":
                res.json({ "success": false, "message": "invalid uuid format" })
                    // case "Player has no SkyBlock profiles":
                    //     res.json({"success": false, "message": "invalid uuid"})
            default:
                break;
        }
    }
});



app.listen(3000, () => console.log('api listening on port 3000'));
