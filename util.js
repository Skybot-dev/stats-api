const helper = require('./helper');
const mcData = require("minecraft-data")("1.8.9");
const { getPath, hasPath, getId } = helper;

const fetch = require('node-fetch');
const moment = require('moment');
const nbt = require('prismarine-nbt');
const util = require('util');
const { v4 } = require('uuid');
const constants = require('./constants');
const parseNbt = util.promisify(nbt.parse);


const rarity_order = ['special', 'mythic', 'legendary', 'epic', 'rare', 'uncommon', 'common'];
const petTiers = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];

const MAX_SOULS = 209;


const format_item_name = (name, { pet = false, tier='common', level = null } = {}) => {
    name = name.toLowerCase();
    if (pet) {
        if (!level) {
            const match = (name.match(/\[lvl ?(?<level>[0-9]+)]/))
            level = match ? match.groups.level <= 75 ? 1 : match.groups.level != 100 ? 2 : 3 : null;
            name = name.replace(/\[lvl ?([0-9]*)] ?/gi, `${level}:`);
            name = `${tier}:${name}`
        } else name = `${tier}:${level}:${name}`
    }
    name = name.replace(/✪/g, '').replace(/§[0-9a-k]/g, '').replace(/⚚/g, '');
    if (!pet) Object.keys(constants.reforges).forEach(reforge => name = name.replace(reforge.toLowerCase(), ''));
    return name.trim();
}

const [getPrices, setPrices] = (function () {
    let prices = {};
    return [function () { return prices }, function (newPrices) { prices = Object.assign(prices, newPrices) }]
})();


async function updatePrices() {
    console.log(`[${new Date()}] updating prices...`);
    const bazaar_items = {};
    const auction_items = {};
    let auctions = await fetch(`https://api.hypixel.net/skyblock/auctions?page=0`);
    auctions = await auctions.json();
    for (let page = 0; page < auctions.totalPages; page++) {
        auctions = await fetch(`https://api.hypixel.net/skyblock/auctions?page=${page}`);
        auctions = await auctions.json();
        for (let auction of auctions.auctions.filter(x => x.bin)) {
            let pet;
            if (auction.item_name.match(/\[lvl ?[0-9]]*/gi)) pet = true; else pet = false;
            auction.item_name = format_item_name(auction.item_name);
            if (pet) auction.item_name = format_item_name(auction.item_name, { pet: true, tier: auction.tier.toLowerCase() })
            // if (pet) auction.item_name = `${auction.item_name.match(/\[lvl ?(?<level>[0-9]+)]/).groups.level}${auction.tier.toLowerCase()}:${auction.item_name.replace(' ', '_')}`;
            Object.keys(auction_items).includes(auction.item_name) ? auction_items[auction.item_name].push(auction.starting_bid) : auction_items[auction.item_name] = [auction.starting_bid];
        }
    }
    let bazaar_data = await fetch('https://sky.shiiyu.moe/api/v2/bazaar');
    bazaar_data = await bazaar_data.json();
    const prices = Object.assign({}, getPrices())
    Object.keys(bazaar_data).forEach(item =>
        prices[item] = {
            avg: bazaar_data[item].price,
            min: Math.round(bazaar_data[item].sellPrice),
            max: Math.round(bazaar_data[item].buyPrice),
        }
    )
    Object.keys(auction_items).forEach(item => {
        prices[item] = {
            avg: auction_items[item].reduce((total, value) => total + value) / auction_items[item].length,
            min: Math.round(Math.min(...auction_items[item])),
            max: Math.round(Math.max(...auction_items[item])),
        }
    });
    setPrices(prices);
    console.log(`[${new Date()}] prices updated`);
}
updatePrices();
setInterval(updatePrices, 300000);

function getPrice(item, pet = false) {
    try {
        let name = pet ? format_item_name(item.type.toLowerCase(), { pet: true, tier: item.tier.toLowerCase(), level: item.level.level <= 75 ? 1 : item.level.level != 100? 2:3 }) : format_item_name(item.tag.display.Name);
        const prices = getPrices();
        const key = (Object.keys(prices).includes(name)) ? name : Object.keys(prices).includes(item.tag.ExtraAttributes.id) ? item.tag.ExtraAttributes.id : null;
        if (key == null) return 0;
        let val = prices[key].min
        if (!pet) {
            val += item.tag.ExtraAttributes.hot_potato_count ? prices.HOT_POTATO_BOOK.min * item.tag.ExtraAttributes.hot_potato_count : 0;
            val += item.tag.ExtraAttributes.rarity_upgrades ? prices.RECOMBOBULATOR_3000.min : 0;
        }
        return val;
    }
    catch (e) {
        return 0;
    }
}

async function getBackpackContents(arraybuf) {
    let buf = Buffer.from(arraybuf);

    let data = await parseNbt(buf);
    data = nbt.simplify(data);

    let items = data.i;

    for (const [index, item] of items.entries()) {
        item.isInactive = true;
        item.inBackpack = true;
        item.item_index = index;
        item.coin_value = getPrice(item);
    }

    return items;
}


function getPetLevel(pet) {
    const rarityOffset = constants.pet_rarity_offset[pet.rarity];
    const levels = constants.pet_levels.slice(rarityOffset, rarityOffset + 99);

    const xpMaxLevel = levels.reduce((a, b) => a + b, 0)
    let xpTotal = 0;
    let level = 1;

    let xpForNext = Infinity;

    for (let i = 0; i < 100; i++) {
        xpTotal += levels[i];

        if (xpTotal > pet.exp) {
            xpTotal -= levels[i];
            break;
        } else {
            level++;
        }
    }

    let xpCurrent = Math.floor(pet.exp - xpTotal);
    let progress;

    if (level < 100) {
        xpForNext = Math.ceil(levels[level - 1]);
        progress = Math.max(0, Math.min(xpCurrent / xpForNext, 1));
    } else {
        level = 100;
        xpCurrent = pet.exp - levels[99];
        xpForNext = 0;
        progress = 1;
    }

    return {
        level,
        xpCurrent,
        xpForNext,
        progress,
        xpMaxLevel
    };
}





function getXpByLevel(level, runecrafting) {
    const output = {
        level: Math.min(level, 50),
        xpCurrent: 0,
        xpForNext: null,
        progress: 0.05
    }

    let xp_table = runecrafting ? constants.runecrafting_xp : constants.leveling_xp;

    if (isNaN(level))
        return 0;

    let xpTotal = 0;

    let maxLevel = Object.keys(xp_table).sort((a, b) => Number(a) - Number(b)).map(a => Number(a)).pop();

    output.maxLevel = maxLevel;

    for (let x = 1; x <= level; x++)
        xpTotal += xp_table[x];

    output.xp = xpTotal;

    if (level >= maxLevel)
        output.progress = 1;
    else
        output.xpForNext = xp_table[level + 1];

    return output;
}

function getLevelByXp(xp, runecrafting) {
    let xp_table = runecrafting ? constants.runecrafting_xp : constants.leveling_xp;

    if (isNaN(xp)) {
        return {
            xp: 0,
            level: 0,
            xpCurrent: 0,
            xpForNext: xp_table[1],
            progress: 0
        };
    }

    let xpTotal = 0;
    let level = 0;

    let xpForNext = Infinity;

    let maxLevel = Object.keys(xp_table).sort((a, b) => Number(a) - Number(b)).map(a => Number(a)).pop();

    for (let x = 1; x <= maxLevel; x++) {
        xpTotal += xp_table[x];

        if (xpTotal > xp) {
            xpTotal -= xp_table[x];
            break;
        } else {
            level = x;
        }
    }

    let xpCurrent = Math.floor(xp - xpTotal);

    if (level < maxLevel)
        xpForNext = Math.ceil(xp_table[level + 1]);

    let progress = Math.max(0, Math.min(xpCurrent / xpForNext, 1));

    return {
        xp,
        level,
        maxLevel,
        xpCurrent,
        xpForNext,
        progress
    };
}


async function getItems(base64, customTextures = false, packs, cacheOnly = false) {
    // API stores data as base64 encoded gzipped Minecraft NBT data
    let buf = Buffer.from(base64, 'base64');

    let data = await parseNbt(buf);
    data = nbt.simplify(data);

    let items = data.i;

    // Check backpack contents and add them to the list of items
    for (const [index, item] of items.entries()) {
        if (helper.hasPath(item, 'tag', 'display', 'Name') && (item.tag.display.Name.endsWith('Backpack') || item.tag.display.Name.endsWith('New Year Cake Bag'))) {
            let backpackData;

            for (const key of Object.keys(item.tag.ExtraAttributes))
                if (key.endsWith('backpack_data') || key == 'new_year_cake_bag_data')
                    backpackData = item.tag.ExtraAttributes[key];

            if (!Array.isArray(backpackData))
                continue;

            let backpackContents = await getBackpackContents(backpackData);

            for (const backpackItem of backpackContents)
                backpackItem.backpackIndex = index;

            item.containsItems = [];

            items.push(...backpackContents);
        }
    }

    let index = 0;

    for (const item of items) {
        item.coin_value = getPrice(item);
        // Set custom texture for colored leather armor
        if (helper.hasPath(item, 'id') && item.id >= 298 && item.id <= 301) {
            let color = [149, 94, 59];

            if (helper.hasPath(item, 'tag', 'ExtraAttributes', 'color'))
                color = item.tag.ExtraAttributes.color.split(":");

            const type = ["leather_helmet", "leather_chestplate", "leather_leggings", "leather_boots"][item.id - 298].replace('_', '/');

            item.texture_path = `/${type}/${color.join(',')}`;
        }

        // Set raw display name without color and formatting codes
        if (helper.hasPath(item, 'tag', 'display', 'Name'))
            item.display_name = helper.getRawLore(item.tag.display.Name);
        // item.coin_value = await getPrice(item);

        if (helper.hasPath(item, 'display_name'))
            if (item.display_name == 'Water Bottle')
                item.Damage = 17;

        // Resolve skull textures to their image path
        if (helper.hasPath(item, 'tag', 'SkullOwner', 'Properties', 'textures')
            && Array.isArray(item.tag.SkullOwner.Properties.textures)
            && item.tag.SkullOwner.Properties.textures.length > 0) {
            try {
                const json = JSON.parse(Buffer.from(item.tag.SkullOwner.Properties.textures[0].Value, 'base64').toString());
                const url = json.textures.SKIN.url;
                const uuid = url.split("/").pop();

                item.texture_path = `/head/${uuid}?v6`;
            } catch (e) {

            }
        }

        if (customTextures) {
            const customTexture = await customResources.getTexture(item, false, packs);

            if (customTexture) {
                item.animated = customTexture.animated;
                item.texture_path = '/' + customTexture.path;
                item.texture_pack = customTexture.pack.config;
                item.texture_pack.base_path = '/' + path.relative(path.resolve(__dirname, '..', 'public'), customTexture.pack.basePath);
            }
        }

        let lore_raw = [];

        const enchantments = helper.getPath(item, 'tag', 'ExtraAttributes', 'enchantments') || {};
        const hasEnchantments = Object.keys(enchantments).length > 0;

        // Set HTML lore to be displayed on the website
        if (helper.hasPath(item, 'tag', 'display', 'Lore')) {
            lore_raw = item.tag.display.Lore;

            item.lore = '';

            for (const [index, line] of lore_raw.entries()) {
                if (index == 0 && line == '')
                    continue;

                item.lore += helper.renderLore(line, hasEnchantments);

                if (index + 1 < lore_raw.length)
                    item.lore += '<br>';
            }

            if (helper.hasPath(item, 'tag', 'ExtraAttributes', 'rarity_upgrades')) {
                const { rarity_upgrades } = item.tag.ExtraAttributes;

                if (rarity_upgrades > 0)
                    item.lore += "<br>" + helper.renderLore(`§8(Recombobulated)`);
            }

            let hasAnvilUses = false;

            if (helper.hasPath(item, 'tag', 'ExtraAttributes', 'anvil_uses')) {
                let { anvil_uses } = item.tag.ExtraAttributes;

                let hot_potato_count = 0;

                if ('hot_potato_count' in item.tag.ExtraAttributes)
                    ({ hot_potato_count } = item.tag.ExtraAttributes);

                anvil_uses -= hot_potato_count;

                if (anvil_uses > 0 && lore_raw) {
                    hasAnvilUses = true;

                    item.lore += "<br><br>" + helper.renderLore(`§7Anvil Uses: §c${anvil_uses}`);
                }
            }

            if (helper.hasPath(item, 'tag', 'ExtraAttributes', 'timestamp')) {
                item.lore += "<br>";

                const { timestamp } = item.tag.ExtraAttributes;

                let obtainmentDate;

                if (!isNaN(timestamp))
                    obtainmentDate = moment(parseInt(timestamp));
                else if (timestamp.includes("AM") || timestamp.includes("PM"))
                    obtainmentDate = moment(timestamp, "M/D/YY h:mm A");
                else
                    obtainmentDate = moment(timestamp, "D/M/YY HH:mm");

                if (!obtainmentDate.isValid())
                    obtainmentDate = moment(timestamp, "M/D/YY HH:mm");

                item.lore += "<br>" + helper.renderLore(`§7Obtained: §c${obtainmentDate.format("D MMM YYYY")}`);
            }

            // if(helper.hasPath(item, 'tag', 'ExtraAttributes', 'spawnedFor')){
            //     if(!helper.hasPath(item, 'tag', 'ExtraAttributes', 'timestamp'))
            //         item.lore += "<br>";

            //     const spawnedFor = item.tag.ExtraAttributes.spawnedFor.replace(/\-/g, '');
            //     const spawnedForUser = await helper.resolveUsernameOrUuid(spawnedFor, db, cacheOnly);

            //     item.lore += "<br>" + helper.renderLore(`§7By: §c<a href="/stats/${spawnedFor}">${spawnedForUser.display_name}</a>`);
            // }

            if (helper.hasPath(item, 'tag', 'ExtraAttributes', 'baseStatBoostPercentage')) {

                const boost = item.tag.ExtraAttributes.baseStatBoostPercentage;

                item.lore += "<br><br>" + helper.renderLore(`§7Dungeon Item Quality: ${boost == 50 ? '§6' : '§c'}${boost}/50%`);
            }

            if (helper.hasPath(item, 'tag', 'ExtraAttributes', 'item_tier')) {

                const floor = item.tag.ExtraAttributes.item_tier;

                item.lore += "<br>"

                item.lore += helper.renderLore(`§7Obtained From: §bFloor ${floor}`);
            }
        }

        let lore = lore_raw ? lore_raw.map(a => a = helper.getRawLore(a)) : [];

        let rarity, item_type;

        if (lore.length > 0) {
            // Get item type (like "bow") and rarity (like "legendary") from last line of lore
            let rarity_type = lore[lore.length - 1];

            let rarity_type_color = lore_raw[lore_raw.length - 1].charAt(1);

            if (rarity_type.startsWith('a '))
                rarity_type = rarity_type.substring(2).substring(0, rarity_type.length - 4);

            if (rarity_type.startsWith('VERY'))
                rarity_type = rarity_type.substring(5);

            rarity_type = splitWithTail(rarity_type, " ", 1);

            rarity = rarity_type[0];

            if (rarity_type.length > 1)
                item_type = rarity_type[1].trim();

            let loreRarity = rarity.toLowerCase();
            let colorRarity = loreRarity;

            if (rarity_type_color in constants.rarity_colors)
                colorRarity = constants.rarity_colors[rarity_type_color];

            item.rarity = colorRarity;

            if (loreRarity != colorRarity)
                item.localized = true;

            if (item_type)
                item.type = item_type.toLowerCase();

            if (item.type == 'hatccessory')
                item.type = 'accessory';

            if (item.type != null && item.type.startsWith('dungeon'))
                item.Damage = 0;

            // fix custom maps texture
            if (item.id == 358) {
                item.id = 395;
                item.Damage = 0;
            }

            item.stats = {};

            // Get item stats from lore
            lore.forEach(line => {
                let split = line.split(":");

                if (split.length < 2)
                    return;

                const statType = split[0];
                const statValue = parseFloat(split[1].trim().replace(/,/g, ''));

                switch (statType) {
                    case 'Damage':
                        item.stats.damage = statValue;
                        break;
                    case 'Health':
                        item.stats.health = statValue;
                        break;
                    case 'Defense':
                        item.stats.defense = statValue;
                        break;
                    case 'Strength':
                        item.stats.strength = statValue;
                        break;
                    case 'Speed':
                        item.stats.speed = statValue;
                        break;
                    case 'Crit Chance':
                        item.stats.crit_chance = statValue;
                        break;
                    case 'Crit Damage':
                        item.stats.crit_damage = statValue;
                        break;
                    case 'Bonus Attack Speed':
                        item.stats.bonus_attack_speed = statValue;
                        break;
                    case 'Intelligence':
                        item.stats.intelligence = statValue;
                        break;
                    case 'Sea Creature Chance':
                        item.stats.sea_creature_chance = statValue;
                        break;
                    case 'Magic Find':
                        item.stats.magic_find = statValue;
                        break;
                    case 'Pet Luck':
                        item.stats.pet_luck = statValue;
                        break;
                }
            });

            // Apply Speed Talisman speed bonuses
            if (getId(item) == 'SPEED_TALISMAN')
                item.stats.speed = 1;

            if (getId(item) == 'SPEED_RING')
                item.stats.speed = 3;

            if (getId(item) == 'SPEED_ARTIFACT')
                item.stats.speed = 5;
        }

        // Workaround for detecting item types if another language is set by the player on Hypixel
        if (getId(item) != 'ENCHANTED_BOOK'
            && !constants.item_types.includes(item.type)) {
            if ('sharpness' in enchantments
                || 'crticial' in enchantments
                || 'ender_slayer' in enchantments
                || 'execute' in enchantments
                || 'first_strike' in enchantments
                || 'giant_killer' in enchantments
                || 'lethality' in enchantments
                || 'life_steal' in enchantments
                || 'looting' in enchantments
                || 'luck' in enchantments
                || 'scavenger' in enchantments
                || 'vampirism' in enchantments
                || 'bane_of_arthropods' in enchantments
                || 'smite' in enchantments)
                item.type = 'sword';

            if ('power' in enchantments
                || 'aiming' in enchantments
                || 'infinite_quiver' in enchantments
                || 'power' in enchantments
                || 'snipe' in enchantments
                || 'punch' in enchantments
                || 'flame' in enchantments
                || 'piercing' in enchantments)
                item.type = 'bow';

            if ('angler' in enchantments
                || 'blessing' in enchantments
                || 'caster' in enchantments
                || 'frail' in enchantments
                || 'luck_of_the_sea' in enchantments
                || 'lure' in enchantments
                || 'magnet' in enchantments)
                item.type = 'fishing rod';
        }

        if (!helper.hasPath(item, 'display_name') && helper.hasPath(item, 'id')) {
            const vanillaItem = mcData.items[item.id];

            if (helper.hasPath(vanillaItem, 'displayName'))
                item.display_name = vanillaItem.displayName;
        }
    }

    for (let item of items) {
        if (item.inBackpack) {
            items[item.backpackIndex].containsItems.push(Object.assign({}, item));
        }
    }

    items = items.filter(a => !a.inBackpack);

    return items;
}





function getEffectiveHealth(health, defense) {
    if (defense <= 0)
        return health;

    return Math.round(health * (1 + defense / 100));
}




function getBonusStat(level, skill, max, incremention) {
    let skill_stats = constants.bonus_stats[skill];
    let steps = Object.keys(skill_stats).sort((a, b) => Number(a) - Number(b)).map(a => Number(a));

    let bonus = Object.assign({}, constants.stat_template);

    for (let x = steps[0]; x <= max; x += incremention) {
        if (level < x)
            break;

        let skill_step = steps.slice().reverse().find(a => a <= x);

        let skill_bonus = skill_stats[skill_step];

        for (let skill in skill_bonus)
            bonus[skill] += skill_bonus[skill];
    }

    return bonus;
}

function getSlayerLevel(slayer, slayerName) {
    let { xp, claimed_levels } = slayer;

    let currentLevel = 0;
    let progress = 0;
    let xpForNext = 0;

    const maxLevel = Math.max(...Object.keys(constants.slayer_xp[slayerName]));

    for (const level_name in claimed_levels) {
        const level = parseInt(level_name.split("_").pop());

        if (level > currentLevel)
            currentLevel = level;
    }

    if (currentLevel < maxLevel) {
        const nextLevel = constants.slayer_xp[slayerName][currentLevel + 1];

        progress = xp / nextLevel;
        xpForNext = nextLevel;
    } else {
        progress = 1;
    }

    return { currentLevel, xp, maxLevel, progress, xpForNext };
}




function getFairyBonus(fairyExchanges) {
    const bonus = Object.assign({}, constants.stat_template);

    bonus.speed = Math.floor(fairyExchanges / 10);

    for (let i = 0; i < fairyExchanges; i++) {
        bonus.strength += (i + 1) % 5 == 0 ? 2 : 1;
        bonus.defense += (i + 1) % 5 == 0 ? 2 : 1;
        bonus.health += 3 + Math.floor(i / 2);
    }

    return bonus;
}


function splitWithTail(string, delimiter, count) {
    let parts = string.split(delimiter);
    let tail = parts.slice(count).join(delimiter);
    let result = parts.slice(0, count);
    result.push(tail);

    return result;
}




async function getLevels(userProfile) {
    let output = {};

    let skillLevels;
    let totalSkillXp = 0;
    let average_level = 0;

    // Apply skill bonuses
    if (hasPath(userProfile, 'experience_skill_taming')
        || hasPath(userProfile, 'experience_skill_farming')
        || hasPath(userProfile, 'experience_skill_mining')
        || hasPath(userProfile, 'experience_skill_combat')
        || hasPath(userProfile, 'experience_skill_foraging')
        || hasPath(userProfile, 'experience_skill_fishing')
        || hasPath(userProfile, 'experience_skill_enchanting')
        || hasPath(userProfile, 'experience_skill_alchemy')
        || hasPath(userProfile, 'experience_skill_carpentry')
        || hasPath(userProfile, 'experience_skill_runecrafting')) {
        let average_level_no_progress = 0;

        skillLevels = {
            taming: getLevelByXp(userProfile.experience_skill_taming || 0),
            farming: getLevelByXp(userProfile.experience_skill_farming || 0),
            mining: getLevelByXp(userProfile.experience_skill_mining || 0),
            combat: getLevelByXp(userProfile.experience_skill_combat || 0),
            foraging: getLevelByXp(userProfile.experience_skill_foraging || 0),
            fishing: getLevelByXp(userProfile.experience_skill_fishing || 0),
            enchanting: getLevelByXp(userProfile.experience_skill_enchanting || 0),
            alchemy: getLevelByXp(userProfile.experience_skill_alchemy || 0),
            carpentry: getLevelByXp(userProfile.experience_skill_carpentry || 0),
            runecrafting: getLevelByXp(userProfile.experience_skill_runecrafting || 0, true),
        };

        for (let skill in skillLevels) {
            if (skill != 'runecrafting' && skill != 'carpentry') {
                average_level += skillLevels[skill].level + skillLevels[skill].progress;
                average_level_no_progress += skillLevels[skill].level;

                totalSkillXp += skillLevels[skill].xp;
            }
        }

        output.average_level = (average_level / (Object.keys(skillLevels).length - 2));
        output.average_level_no_progress = (average_level_no_progress / (Object.keys(skillLevels).length - 2));
        output.total_skill_xp = totalSkillXp;

        output.levels = Object.assign({}, skillLevels);
    } else {
        skillLevels = {
            farming: 0,
            mining: 0,
            combat: 0,
            foraging: 0,
            fishing: 0,
            enchanting: 0,
            alchemy: 0,
            taming: 0,
        };

        output.levels = {};

        let skillsAmount = 0;

        for (const skill in skillLevels) {
            output.levels[skill] = getXpByLevel(skillLevels[skill]);

            if (skillLevels[skill] < 0)
                continue;

            skillsAmount++;
            average_level += skillLevels[skill];

            totalSkillXp += output.levels[skill].xp;
        }

        output.average_level = (average_level / skillsAmount);
        output.average_level_no_progress = output.average_level;
        output.total_skill_xp = totalSkillXp;
    }


    const skillNames = Object.keys(output.levels);

    for (const skill of skillNames) {
        if (output.levels[skill].xp == null) {
            output.levels[skill].rank = 100000;
            continue;
        }
    }

    // for(const [index, skill] of skillNames.entries()){
    //     output.levels[skill].rank = results[index][1];
    // }


    return output;
}


async function getPets(profile) {
    let output = [];

    if (!helper.hasPath(profile, 'pets'))
        return output;

    for (const pet of profile.pets) {
        if (!('tier' in pet))
            continue;
        pet.rarity = pet.tier.toLowerCase();

        if (pet.heldItem == 'PET_ITEM_TIER_BOOST')
            pet.rarity = petTiers[Math.min(petTiers.length - 1, petTiers.indexOf(pet.rarity) + 1)];

        pet.level = getPetLevel(pet);
        pet.coin_value = getPrice(pet, true);
        pet.stats = {};

        const petData = constants.pet_data[pet.type] || {
            type: '???',
            emoji: '❓',
            head: '/head/bc8ea1f51f253ff5142ca11ae45193a4ad8c3ab5e9c6eec8ba7a4fcb7bac40'
        };

        pet.texture_path = petData.head;

        let lore = [
            `§8${helper.capitalizeFirstLetter(petData.type)} Pet`,
        ];

        lore.push('');

        if (pet.level.level < 100) {
            lore.push(
                `§7Progress to Level ${pet.level.level + 1}: §e${(pet.level.progress * 100).toFixed(1)}%`
            );

            let levelBar = '';

            for (let i = 0; i < 20; i++) {
                if (pet.level.progress > i / 20)
                    levelBar += '§2';
                else
                    levelBar += '§f';
                levelBar += '-';
            }

            levelBar += ` §e${pet.level.xpCurrent.toLocaleString()} §6/ §e${helper.formatNumber(pet.level.xpForNext, false, 10)}`;

            lore.push(levelBar);
        } else {
            lore.push(
                '§bMAX LEVEL'
            );
        }

        lore.push(
            '',
            `§7Total XP: §e${helper.formatNumber(pet.exp, true, 10)} §6/ §e${helper.formatNumber(pet.level.xpMaxLevel, true, 10)}`,
            `§7Candy Used: §e${pet.candyUsed || 0} §6/ §e10`
        );

        pet.lore = '';

        for (const [index, line] of lore.entries()) {
            pet.lore += helper.renderLore(line);

            if (index < lore.length)
                pet.lore += '<br>';
        }

        pet.display_name = helper.titleCase(pet.type.replace(/\_/g, ' '));
        pet.emoji = petData.emoji;

        output.push(pet);
    }

    output = output.sort((a, b) => {
        if (a.active === b.active)
            if (a.rarity == b.rarity) {
                if (a.type == b.type) {
                    return a.level.level > b.level.level ? -1 : 1;
                } else {
                    let maxPetA = output
                        .filter(x => x.type == a.type && x.rarity == a.rarity)
                        .sort((x, y) => y.level.level - x.level.level);

                    maxPetA = maxPetA.length > 0 ? maxPetA[0].level.level : null;

                    let maxPetB = output
                        .filter(x => x.type == b.type && x.rarity == b.rarity)
                        .sort((x, y) => y.level.level - x.level.level);

                    maxPetB = maxPetB.length > 0 ? maxPetB[0].level.level : null;

                    if (maxPetA && maxPetB && maxPetA == maxPetB)
                        return a.type < b.type ? -1 : 1;
                    else
                        return maxPetA > maxPetB ? -1 : 1;
                }
            } else {
                return rarity_order.indexOf(a.rarity) > rarity_order.indexOf(b.rarity) ? 1 : -1;
            }

        return a.active ? -1 : 1
    });

    return output;
}


module.exports = {






    getProfile: async (paramPlayer, paramProfile, hypixel_api_key, options = { cacheOnly: false }) => {
        if (paramPlayer.length != 32) {
            throw "must be uuid"

        }

        if (paramProfile)
            paramProfile = paramProfile.toLowerCase();

        const params = {
            key: hypixel_api_key,
            uuid: paramPlayer
        };

        let allSkyBlockProfiles = [];

        let response = null;

        if (!options.cacheOnly) {
            try {
                response = await fetch(`https://api.hypixel.net/skyblock/profiles?key=${params.key}&uuid=${params.uuid}`);
                // response = await retry(async () => {
                //     return await Hypixel.get('skyblock/profiles', {
                //         params
                //     });
                // }, { retries: 2 });

                const data = await response.json();

                if (!data.success)
                    throw "Request to Hypixel API failed. Please try again!";

                if (data.profiles == null)
                    throw "Player has no SkyBlock profiles.";

                allSkyBlockProfiles = data.profiles;
            } catch (e) {
                if (helper.hasPath(e, 'response', 'data', 'cause'))
                    throw `Hypixel API Error: ${e.response.data.cause}.`;

                throw e;
            }
        }

        if (allSkyBlockProfiles.length == 0)
            throw "Player has no SkyBlock profiles.";

        for (const profile of allSkyBlockProfiles) {
            for (const member in profile.members)
                if (!helper.hasPath(profile.members[member], 'last_save'))
                    delete profile.members[member];

            profile.uuid = paramPlayer;
        }

        let skyBlockProfiles = [];

        if (paramProfile) {
            if (paramProfile.length == 32) {
                const filteredProfiles = allSkyBlockProfiles.filter(a => a.profile_id.toLowerCase() == paramProfile);

                if (filteredProfiles.length > 0) {
                    skyBlockProfiles = filteredProfiles;
                } else {
                    const profileResponse = await retry(async () => {
                        const response = await Hypixel.get('skyblock/profile', {
                            params: { key: credentials.hypixel_api_key, profile: paramProfile }
                        }, { retries: 3 });

                        if (!response.data.success)
                            throw "api request failed";

                        return response.data.profile;
                    });

                    profileResponse.cute_name = 'Deleted';
                    profileResponse.uuid = paramPlayer;

                    skyBlockProfiles.push(profileResponse);
                }
            } else {
                skyBlockProfiles = allSkyBlockProfiles.filter(a => a.cute_name.toLowerCase() == paramProfile);
            }
        }

        if (skyBlockProfiles.length == 0)
            skyBlockProfiles = allSkyBlockProfiles;

        const profiles = [];

        for (const [index, profile] of skyBlockProfiles.entries()) {
            let memberCount = 0;

            for (const member in profile.members) {
                if (helper.hasPath(profile.members[member], 'last_save'))
                    memberCount++;
            }

            if (memberCount == 0) {
                if (paramProfile)
                    throw "Uh oh, this SkyBlock profile has no players.";

                continue;
            }

            profiles.push(profile);
        }

        if (profiles.length == 0)
            throw "No data returned by Hypixel API, please try again!";

        let highest = 0;
        let profileId;
        let profile;

        const storeProfiles = {};

        for (const _profile of allSkyBlockProfiles) {
            let userProfile = _profile.members[paramPlayer];

            if (!userProfile)
                continue;

            if (helper.hasPath(userProfile, 'last_save'))
                storeProfiles[_profile.profile_id] = {
                    profile_id: _profile.profile_id,
                    cute_name: _profile.cute_name,
                    last_save: userProfile.last_save
                };
        }

        for (const [index, _profile] of profiles.entries()) {
            if (_profile === undefined || _profile === null)
                return;

            let userProfile = _profile.members[paramPlayer];

            if (helper.hasPath(userProfile, 'last_save') && userProfile.last_save > highest) {
                profile = _profile;
                highest = userProfile.last_save;
                profileId = _profile.profile_id;
            }
        }

        if (!profile)
            throw "User not found in selected profile. This is probably due to a declined co-op invite.";





        return { profile: profile, allProfiles: allSkyBlockProfiles, uuid: paramPlayer };
    },




    getAllItems: async (profile, customTextures = false, packs, cacheOnly = false) => {
        const output = {};

        // Process inventories returned by API
        let armor = 'inv_armor' in profile ? await getItems(profile.inv_armor.data, customTextures, packs, cacheOnly) : [];
        let inventory = 'inv_contents' in profile ? await getItems(profile.inv_contents.data, customTextures, packs, cacheOnly) : [];
        let wardrobe_inventory = 'wardrobe_contents' in profile ? await getItems(profile.wardrobe_contents.data, customTextures, packs, cacheOnly) : [];
        let enderchest = 'ender_chest_contents' in profile ? await getItems(profile.ender_chest_contents.data, customTextures, packs, cacheOnly) : [];
        let talisman_bag = 'talisman_bag' in profile ? await getItems(profile.talisman_bag.data, customTextures, packs, cacheOnly) : [];
        let fishing_bag = 'fishing_bag' in profile ? await getItems(profile.fishing_bag.data, customTextures, packs, cacheOnly) : [];
        let quiver = 'quiver' in profile ? await getItems(profile.quiver.data, customTextures, packs, cacheOnly) : [];
        let potion_bag = 'potion_bag' in profile ? await getItems(profile.potion_bag.data, customTextures, packs, cacheOnly) : [];
        let candy_bag = 'candy_inventory_contents' in profile ? await getItems(profile.candy_inventory_contents.data, customTextures, packs, cacheOnly) : [];

        const wardrobeColumns = wardrobe_inventory.length / 4;

        let wardrobe = [];

        for (let i = 0; i < wardrobeColumns; i++) {
            let page = Math.floor(i / 9);

            let wardrobeSlot = [];

            for (let j = 0; j < 4; j++) {
                let index = (36 * page) + (i % 9) + (j * 9);

                if (getId(wardrobe_inventory[index]).length > 0)
                    wardrobeSlot.push(wardrobe_inventory[index]);
                else
                    wardrobeSlot.push(null);
            }

            if (wardrobeSlot.filter(a => a !== null).length > 0)
                wardrobe.push(wardrobeSlot);
        }

        output.armor = armor.filter(a => Object.keys(a).length != 0);
        output.wardrobe = wardrobe;
        output.wardrobe_inventory = wardrobe_inventory;
        output.inventory = inventory
        output.enderchest = enderchest;
        output.talisman_bag = talisman_bag;
        output.fishing_bag = fishing_bag;
        output.quiver = quiver;
        output.potion_bag = potion_bag;

        const all_items = armor.concat(inventory, enderchest, talisman_bag, fishing_bag, quiver, potion_bag, wardrobe_inventory);

        for (const [index, item] of all_items.entries()) {
            item.item_index = index;
            item.itemId = v4('itemId');

            if ('containsItems' in item && Array.isArray(item.containsItems))
                item.containsItems.forEach(a => { a.backpackIndex = item.item_index; a.itemId = v4('itemId'); });
        }

        // All items not in the inventory or accessory bag should be inactive so they don't contribute to the total stats
        enderchest = enderchest.map(a => Object.assign({ isInactive: true }, a));

        // Add candy bag contents as backpack contents to candy bag
        for (let item of all_items) {
            if (getId(item) == 'TRICK_OR_TREAT_BAG')
                item.containsItems = candy_bag;
        }

        const talismans = [];

        // Modify talismans on armor and add
        for (const talisman of armor.filter(a => a.type == 'accessory')) {
            const id = getId(talisman);

            if (id === "")
                continue;

            const insertTalisman = Object.assign({ isUnique: true, isInactive: false }, talisman);

            if (talismans.filter(a => !a.isInactive && getId(a) == id).length > 0)
                insertTalisman.isInactive = true;

            if (talismans.filter(a => getId(a) == id).length > 0)
                insertTalisman.isUnique = false;

            talismans.push(insertTalisman);
        }

        // Add talismans from inventory
        for (const talisman of inventory.filter(a => a.type == 'accessory')) {
            const id = getId(talisman);

            if (id === "")
                continue;

            const insertTalisman = Object.assign({ isUnique: true, isInactive: false }, talisman);

            if (talismans.filter(a => !a.isInactive && getId(a) == id).length > 0)
                insertTalisman.isInactive = true;

            if (talismans.filter(a => getId(a) == id).length > 0)
                insertTalisman.isUnique = false;

            talismans.push(insertTalisman);
        }

        // Add talismans from accessory bag if not already in inventory
        for (const talisman of talisman_bag) {
            const id = getId(talisman);

            if (id === "")
                continue;

            const insertTalisman = Object.assign({ isUnique: true, isInactive: false }, talisman);

            if (talismans.filter(a => !a.isInactive && getId(a) == id).length > 0)
                insertTalisman.isInactive = true;

            if (talismans.filter(a => getId(a) == id).length > 0)
                insertTalisman.isUnique = false;

            talismans.push(insertTalisman);
        }

        // Add inactive talismans from enderchest and backpacks
        for (const item of inventory.concat(enderchest)) {
            let items = [item];

            if (item.type != 'accessory' && 'containsItems' in item && Array.isArray(item.containsItems))
                items = item.containsItems.slice(0);

            for (const talisman of items.filter(a => a.type == 'accessory')) {
                const id = getId(talisman);

                const insertTalisman = Object.assign({ isUnique: true, isInactive: true }, talisman);

                if (talismans.filter(a => getId(a) == id).length > 0)
                    insertTalisman.isUnique = false;

                talismans.push(insertTalisman);
            }
        }

        // Don't account for lower tier versions of the same talisman
        for (const talisman of talismans.concat(armor)) {
            const id = getId(talisman);

            if (id.startsWith("CAMPFIRE_TALISMAN_")) {
                const tier = parseInt(id.split("_").pop());

                const maxTier = Math.max(...talismans.filter(a => getId(a).startsWith("CAMPFIRE_TALISMAN_")).map(a => getId(a).split("_").pop()));

                if (tier < maxTier) {
                    talisman.isUnique = false;
                    talisman.isInactive = true;
                }
            }

            if (id.startsWith("WEDDING_RING_")) {
                const tier = parseInt(id.split("_").pop());

                const maxTier = Math.max(...talismans.filter(a => getId(a).startsWith("WEDDING_RING_")).map(a => getId(a).split("_").pop()));

                if (tier < maxTier) {
                    talisman.isUnique = false;
                    talisman.isInactive = true;
                }
            }

            if (id in constants.talisman_upgrades) {
                const talismanUpgrades = constants.talisman_upgrades[id];

                if (talismans.filter(a => !a.isInactive && talismanUpgrades.includes(getId(a))).length > 0)
                    talisman.isInactive = true;

                if (talismans.filter(a => talismanUpgrades.includes(getId(a))).length > 0)
                    talisman.isUnique = false;
            }

            if (id in constants.talisman_duplicates) {
                const talismanDuplicates = constants.talisman_duplicates[id];

                if (talismans.filter(a => talismanDuplicates.includes(getId(a))).length > 0)
                    talisman.isUnique = false;
            }
        }

        // Add New Year Cake Bag health bonus (1 per unique cake)
        for (let talisman of talismans) {
            let id = getId(talisman);
            let cakes = [];

            if (id == 'NEW_YEAR_CAKE_BAG' && helper.hasPath(talisman, 'containsItems') && Array.isArray(talisman.containsItems)) {
                talisman.stats.health = 0;

                for (const item of talisman.containsItems) {
                    if (helper.hasPath(item, 'tag', 'ExtraAttributes', 'new_years_cake') && !cakes.includes(item.tag.ExtraAttributes.new_years_cake)) {
                        talisman.stats.health++;
                        cakes.push(item.tag.ExtraAttributes.new_years_cake);
                    }
                }
            }
        }

        // Add base name without reforge
        for (const talisman of talismans) {
            talisman.base_name = talisman.display_name;

            if (helper.hasPath(talisman, 'tag', 'ExtraAttributes', 'modifier')) {
                talisman.base_name = talisman.display_name.split(" ").slice(1).join(" ");
                talisman.reforge = talisman.tag.ExtraAttributes.modifier
            }
        }

        output.talismans = talismans;
        output.weapons = all_items.filter(a => a.type != null && (a.type.endsWith('sword') || a.type.endsWith('bow')));
        output.rods = all_items.filter(a => a.type != null && a.type.endsWith('fishing rod'));

        for (const item of all_items) {
            if (!Array.isArray(item.containsItems))
                continue;

            output.weapons.push(...item.containsItems.filter(a => a.type != null && (a.type.endsWith('sword') || a.type.endsWith('bow'))));
            output.rods.push(...item.containsItems.filter(a => a.type != null && a.type.endsWith('fishing rod')));
        }

        // Check if inventory access disabled by user
        if (inventory.length == 0)
            output.no_inventory = true;

        // Sort talismans, weapons and rods by rarity
        output.weapons = output.weapons.sort((a, b) => {
            if (a.rarity == b.rarity) {
                if (b.inBackpack)
                    return -1;

                return a.item_index > b.item_index ? 1 : -1;
            }

            return rarity_order.indexOf(a.rarity) - rarity_order.indexOf(b.rarity)
        });

        output.rods = output.rods.sort((a, b) => {
            if (a.rarity == b.rarity) {
                if (b.inBackpack)
                    return -1;

                return a.item_index > b.item_index ? 1 : -1;
            }

            return rarity_order.indexOf(a.rarity) - rarity_order.indexOf(b.rarity)
        });

        const countsOfId = {};

        for (const weapon of output.weapons) {
            const id = getId(weapon);

            countsOfId[id] = (countsOfId[id] || 0) + 1;

            if (countsOfId[id] > 2)
                weapon.hidden = true;
        }

        output.talismans = output.talismans.sort((a, b) => {
            const rarityOrder = rarity_order.indexOf(a.rarity) - rarity_order.indexOf(b.rarity);

            if (rarityOrder == 0)
                return (a.isInactive === b.isInactive) ? 0 : a.isInactive ? 1 : -1;

            return rarityOrder;
        });

        let swords = output.weapons.filter(a => a.type == 'sword');
        let bows = output.weapons.filter(a => a.type == 'bow');

        let swordsInventory = swords.filter(a => a.backpackIndex === undefined);
        let bowsInventory = bows.filter(a => a.backpackIndex === undefined);
        let rodsInventory = output.rods.filter(a => a.backpackIndex === undefined);

        if (swords.length > 0)
            output.highest_rarity_sword = swordsInventory.filter(a => a.rarity == swordsInventory[0].rarity).sort((a, b) => a.item_index - b.item_index)[0];

        if (bows.length > 0)
            output.highest_rarity_bow = bowsInventory.filter(a => a.rarity == bowsInventory[0].rarity).sort((a, b) => a.item_index - b.item_index)[0];

        if (output.rods.length > 0)
            output.highest_rarity_rod = rodsInventory.filter(a => a.rarity == rodsInventory[0].rarity).sort((a, b) => a.item_index - b.item_index)[0];

        if (armor.filter(a => Object.keys(a).length > 2).length == 1) {
            const armorPiece = armor.filter(a => Object.keys(a).length > 2)[0];

            output.armor_set = armorPiece.display_name;
            output.armor_set_rarity = armorPiece.rarity;
        }

        if (armor.filter(a => Object.keys(a).length > 3).length == 4) {

            let output_name = "";
            let reforgeName;

            armor.forEach(armorPiece => {
                let name = armorPiece.display_name.replace(/\✪/g, '').trim();

                if (helper.hasPath(armorPiece, 'tag', 'ExtraAttributes', 'modifier'))
                    name = name.split(" ").slice(1).join(" ");

                armorPiece.armor_name = name;
            });

            if (armor.filter(a => helper.hasPath(a, 'tag', 'ExtraAttributes', 'modifier')
                && a.tag.ExtraAttributes.modifier == armor[0].tag.ExtraAttributes.modifier).length == 4)
                reforgeName = armor[0].display_name.split(" ")[0]

            const isMonsterSet = armor
                .filter(a =>
                    ['SKELETON_HELMET', 'GUARDIAN_CHESTPLATE', 'CREEPER_LEGGINGS', 'SPIDER_BOOTS', 'TARANTULA_BOOTS'].includes(getId(a))
                ).length == 4;

            const isPerfectSet = armor
                .filter(a =>
                    getId(a).startsWith('PERFECT_')
                ).length == 4;

            const isSpongeSet = armor
                .filter(a =>
                    getId(a).startsWith('SPONGE_')
                ).length == 4;

            if (armor.filter(a => a.armor_name.split(" ")[0] == armor[0].armor_name.split(" ")[0]).length == 4
                || isMonsterSet) {
                let base_name = armor[0].armor_name.split(" ");
                base_name.pop();

                output_name += base_name.join(" ");

                if (!output_name.endsWith("Armor") && !output_name.startsWith("Armor"))
                    output_name += " Armor";

                output.armor_set = output_name;
                output.armor_set_rarity = armor[0].rarity;

                if (isMonsterSet) {
                    output.armor_set_rarity = 'rare';

                    if (getId(armor[0]) == 'SPIDER_BOOTS')
                        output.armor_set = 'Monster Hunter Armor';

                    if (getId(armor[0]) == 'TARANTULA_BOOTS')
                        output.armor_set = 'Monster Raider Armor';
                }

                if (isPerfectSet) {
                    const sameTier = armor.filter(a => getId(a).split("_").pop() == getId(armor[0]).split("_").pop()).length == 4;

                    if (sameTier)
                        output.armor_set = 'Perfect Armor - Tier ' + getId(armor[0]).split("_").pop();
                    else
                        output.armor_set = 'Perfect Armor';
                }

                if (isSpongeSet)
                    output.armor_set = 'Sponge Armor';

                if (reforgeName)
                    output.armor_set = reforgeName + " " + output.armor_set;
            }
        }

        return output;
    },

    getStats: async (profile, allProfiles, items, cacheOnly = false) => {
        let output = {};

        const userProfile = profile.members[profile.uuid];

        output.stats = Object.assign({}, constants.base_stats);

        if (isNaN(userProfile.fairy_souls_collected))
            userProfile.fairy_souls_collected = 0;

        output.fairy_bonus = {};

        if (userProfile.fairy_exchanges > 0) {
            const fairyBonus = getFairyBonus(userProfile.fairy_exchanges);

            output.fairy_bonus = Object.assign({}, fairyBonus);

            // Apply fairy soul bonus
            for (let stat in fairyBonus)
                output.stats[stat] += fairyBonus[stat];
        }

        output.fairy_souls = { collected: userProfile.fairy_souls_collected, total: MAX_SOULS, progress: Math.min(userProfile.fairy_souls_collected / MAX_SOULS, 1) };

        const { levels, average_level, average_level_no_progress, total_skill_xp, average_level_rank } = await getLevels(userProfile);

        output.levels = levels;
        output.average_level = average_level;
        output.average_level_no_progress = average_level_no_progress;
        output.total_skill_xp = total_skill_xp;
        output.average_level_rank = average_level_rank;

        output.skill_bonus = {};

        for (let skill in levels) {
            if (levels[skill].level == 0)
                continue;

            const skillBonus = getBonusStat(levels[skill].level || levels[skill], `${skill}_skill`, 50, 1);

            output.skill_bonus[skill] = Object.assign({}, skillBonus);

            for (const stat in skillBonus)
                output.stats[stat] += skillBonus[stat];
        }

        output.slayer_coins_spent = {};

        // Apply slayer bonuses
        if ('slayer_bosses' in userProfile) {
            output.slayer_bonus = {};

            let slayers = {};

            if (helper.hasPath(userProfile, 'slayer_bosses')) {
                for (const slayerName in userProfile.slayer_bosses) {
                    const slayer = userProfile.slayer_bosses[slayerName];

                    slayers[slayerName] = {};

                    if (!helper.hasPath(slayer, 'claimed_levels'))
                        continue;

                    slayers[slayerName].level = getSlayerLevel(slayer, slayerName);

                    slayers[slayerName].kills = {};

                    for (const property in slayer) {
                        slayers[slayerName][property] = slayer[property];

                        if (property.startsWith('boss_kills_tier_')) {
                            const tier = parseInt(property.replace('boss_kills_tier_', '')) + 1;

                            slayers[slayerName].kills[tier] = slayer[property];

                            output.slayer_coins_spent[slayerName] = (output.slayer_coins_spent[slayerName] || 0) + slayer[property] * constants.slayer_cost[tier];
                        }
                    }
                }

                for (const slayerName in output.slayer_coins_spent) {
                    output.slayer_coins_spent.total = (output.slayer_coins_spent.total || 0) + output.slayer_coins_spent[slayerName];
                }

                output.slayer_coins_spent.total = output.slayer_coins_spent.total || 0;
            }

            output.slayer_xp = 0;

            for (const slayer in slayers) {
                if (!helper.hasPath(slayers[slayer], 'level', 'currentLevel'))
                    continue;

                const slayerBonus = getBonusStat(slayers[slayer].level.currentLevel, `${slayer}_slayer`, 9, 1);

                output.slayer_bonus[slayer] = Object.assign({}, slayerBonus);

                output.slayer_xp += slayers[slayer].xp || 0;

                for (let stat in slayerBonus)
                    output.stats[stat] += slayerBonus[stat];
            }

            output.slayers = Object.assign({}, slayers);
        }

        output.pets = await getPets(userProfile);

        const petScoreRequired = Object.keys(constants.pet_rewards).sort((a, b) => parseInt(b) - parseInt(a));

        output.pet_bonus = {};

        for (const [index, score] of petScoreRequired.entries()) {
            if (parseInt(score) > output.petScore)
                continue;

            output.pet_score_bonus = Object.assign({}, constants.pet_rewards[score]);

            break;
        }

        for (const pet of output.pets) {
            if (!pet.active)
                continue;

            for (const stat in pet.stats)
                output.pet_bonus[stat] = (output.pet_bonus[stat] || 0) + pet.stats[stat];
        }

        // Apply all harp bonuses when Melody's Hair has been acquired
        if (items.talismans.filter(a => getId(a) == 'MELODY_HAIR').length == 1)
            output.stats.intelligence += 26;

        for (const stat in output.pet_score_bonus)
            output.stats[stat] += output.pet_score_bonus[stat];

        output.base_stats = Object.assign({}, output.stats);

        for (const stat in output.pet_bonus)
            output.stats[stat] += output.pet_bonus[stat];

        // Apply Lapis Armor full set bonus of +60 HP
        if (items.armor.filter(a => getId(a).startsWith('LAPIS_ARMOR_')).length == 4)
            items.armor[0].stats.health = (items.armor[0].stats.health || 0) + 60;

        // Apply Emerald Armor full set bonus of +1 HP and +1 Defense per 3000 emeralds in collection with a maximum of 300
        if (helper.hasPath(userProfile, 'collection', 'EMERALD')
            && !isNaN(userProfile.collection.EMERALD)
            && items.armor.filter(a => getId(a).startsWith('EMERALD_ARMOR_')).length == 4) {
            let emerald_bonus = Math.min(350, Math.floor(userProfile.collection.EMERALD / 3000));

            items.armor[0].stats.health += emerald_bonus;
            items.armor[0].stats.defense += emerald_bonus;
        }

        // Apply Fairy Armor full set bonus of +10 Speed
        if (items.armor.filter(a => getId(a).startsWith('FAIRY_')).length == 4)
            items.armor[0].stats.speed += 10;

        // Apply Speedster Armor full set bonus of +20 Speed
        if (items.armor.filter(a => getId(a).startsWith('SPEEDSTER_')).length == 4)
            items.armor[0].stats.speed += 20;

        // Apply Young Dragon Armor full set bonus of +70 Speed
        if (items.armor.filter(a => getId(a).startsWith('YOUNG_DRAGON_')).length == 4)
            items.armor[0].stats.speed += 70;

        // Apply basic armor stats
        for (const item of items.armor) {
            if (item.isInactive || item.type == 'accessory') {
                item.stats = {};

                if (getId(item) != 'PARTY_HAT_CRAB')
                    continue;

                for (const lore of item.tag.display.Lore) {
                    const line = helper.getRawLore(lore);

                    if (line.startsWith('Your bonus: ')) {
                        item.stats.intelligence = parseInt(line.split(' ')[2].substring(1));

                        break;
                    }
                }
            }

            for (let stat in item.stats)
                output.stats[stat] += item.stats[stat];
        }

        // Apply stats of active talismans
        items.talismans.filter(a => Object.keys(a).length != 0 && !a.isInactive).forEach(item => {
            for (let stat in item.stats)
                output.stats[stat] += item.stats[stat];
        });

        // Apply Mastiff Armor full set bonus of +50 HP per 1% Crit Damage
        if (items.armor.filter(a => getId(a).startsWith('MASTIFF_')).length == 4) {
            output.stats.health += 50 * output.stats.crit_damage;
            items.armor[0].stats.health += 50 * output.stats.crit_damage;
        }

        // Apply +5 Defense and +5 Strength of Day/Night Crystal only if both are owned as this is required for a permanent bonus
        if (items.talismans.filter(a => !a.isInactive && ["DAY_CRYSTAL", "NIGHT_CRYSTAL"].includes(getId(a))).length == 2) {
            output.stats.defense += 5;
            output.stats.strength += 5;

            const dayCrystal = items.talismans.filter(a => getId(a) == 'DAY_CRYSTAL')[0];

            dayCrystal.stats.defense = (dayCrystal.stats.defense || 0) + 5;
            dayCrystal.stats.strength = (dayCrystal.stats.strength || 0) + 5;
        }

        // Apply Obsidian Chestplate bonus of +1 Speed per 20 Obsidian in inventory
        if (items.armor.filter(a => getId(a) == 'OBSIDIAN_CHESTPLATE').length == 1) {
            let obsidian = 0;

            for (let item of items.inventory) {
                if (item.id == 49)
                    obsidian += item.Count;
            }

            output.stats.speed += Math.floor(obsidian / 20);
        }

        if (items.armor.filter(a => getId(a).startsWith('CHEAP_TUXEDO_')).length == 3)
            output.stats['health'] = 75;

        if (items.armor.filter(a => getId(a).startsWith('FANCY_TUXEDO_')).length == 3)
            output.stats['health'] = 150;

        if (items.armor.filter(a => getId(a).startsWith('ELEGANT_TUXEDO_')).length == 3)
            output.stats['health'] = 250;

        output.weapon_stats = {};

        for (const item of items.weapons.concat(items.rods)) {
            let stats = Object.assign({}, output.stats);

            // Apply held weapon stats
            for (let stat in item.stats) {
                stats[stat] += item.stats[stat];
            }

            // Add crit damage from held weapon to Mastiff Armor full set bonus
            if (item.stats.crit_damage > 0 && items.armor.filter(a => getId(a).startsWith('MASTIFF_')).length == 4)
                stats.health += 50 * item.stats.crit_damage;

            // Apply Superior Dragon Armor full set bonus of 5% stat increase
            if (items.armor.filter(a => getId(a).startsWith('SUPERIOR_DRAGON_')).length == 4)
                for (const stat in stats)
                    stats[stat] *= 1.05;

            for (let i = 0; i < items.armor.filter(a => helper.getPath(a, 'tag', 'ExtraAttributes', 'modifier') == 'renowned').length; i++) {
                for (const stat in stats)
                    stats[stat] *= 1.01;
            }

            if (items.armor.filter(a => getId(a).startsWith('CHEAP_TUXEDO_')).length == 3)
                stats['health'] = 75;

            if (items.armor.filter(a => getId(a).startsWith('FANCY_TUXEDO_')).length == 3)
                stats['health'] = 150;

            if (items.armor.filter(a => getId(a).startsWith('ELEGANT_TUXEDO_')).length == 3)
                stats['health'] = 250;

            output.weapon_stats[item.itemId] = stats;

            // Stats shouldn't go into negative
            for (let stat in stats)
                output.weapon_stats[item.itemId][stat] = Math.max(0, Math.round(stats[stat]));

            stats.effective_health = getEffectiveHealth(stats.health, stats.defense);
        }

        const superiorBonus = Object.assign({}, constants.stat_template);

        // Apply Superior Dragon Armor full set bonus of 5% stat increase
        if (items.armor.filter(a => getId(a).startsWith('SUPERIOR_DRAGON_')).length == 4) {
            for (const stat in output.stats)
                superiorBonus[stat] = output.stats[stat] * 0.05;

            for (const stat in superiorBonus) {
                output.stats[stat] += superiorBonus[stat];

                if (!(stat in items.armor[0].stats))
                    items.armor[0].stats[stat] = 0;

                items.armor[0].stats[stat] += superiorBonus[stat];
            }
        }

        const renownedBonus = Object.assign({}, constants.stat_template);

        for (const item of items.armor) {
            if (helper.getPath(item, 'tag', 'ExtraAttributes', 'modifier') == 'renowned') {
                for (const stat in output.stats) {
                    renownedBonus[stat] += output.stats[stat] * 0.01;

                    output.stats[stat] *= 1.01;
                }
            }
        }

        if (items.armor[0] != null && helper.hasPath(items.armor[0], 'stats')) {
            for (const stat in renownedBonus) {
                if (!(stat in items.armor[0].stats))
                    items.armor[0].stats[stat] = 0;

                items.armor[0].stats[stat] += renownedBonus[stat];
            }
        }

        // Stats shouldn't go into negative
        for (let stat in output.stats)
            output.stats[stat] = Math.max(0, Math.round(output.stats[stat]));

        output.stats.effective_health = getEffectiveHealth(output.stats.health, output.stats.defense);

        let killsDeaths = [];

        for (let stat in userProfile.stats) {
            if (stat.startsWith("kills_"))
                killsDeaths.push({ type: 'kills', entityId: stat.replace("kills_", ""), amount: userProfile.stats[stat] });

            if (stat.startsWith("deaths_"))
                killsDeaths.push({ type: 'deaths', entityId: stat.replace("deaths_", ""), amount: userProfile.stats[stat] });
        }

        for (const stat of killsDeaths) {
            let { entityId } = stat;

            if (entityId in constants.mob_names) {
                stat.entityName = constants.mob_names[entityId];
                continue;
            }

            let entityName = "";

            entityId.split("_").forEach((split, index) => {
                entityName += split.charAt(0).toUpperCase() + split.slice(1);

                if (index < entityId.split("_").length - 1)
                    entityName += " ";
            });

            stat.entityName = entityName;
        }

        if ('kills_guardian_emperor' in userProfile.stats || 'kills_skeleton_emperor' in userProfile.stats)
            killsDeaths.push({
                type: 'kills',
                entityId: 'sea_emperor',
                entityName: 'Sea Emperor',
                amount: (userProfile.stats['kills_guardian_emperor'] || 0) + (userProfile.stats['kills_skeleton_emperor'] || 0)
            });

        if ('kills_chicken_deep' in userProfile.stats || 'kills_zombie_deep' in userProfile.stats)
            killsDeaths.push({
                type: 'kills',
                entityId: 'monster_of_the_deep',
                entityName: 'Monster of the Deep',
                amount: (userProfile.stats['kills_chicken_deep'] || 0) + (userProfile.stats['kills_zombie_deep'] || 0)
            });

        killsDeaths = killsDeaths.filter(a => {
            return ![
                'guardian_emperor',
                'skeleton_emperor',
                'chicken_deep',
                'zombie_deep'
            ].includes(a.entityId);
        });

        output.kills = killsDeaths.filter(a => a.type == 'kills').sort((a, b) => b.amount - a.amount);
        output.deaths = killsDeaths.filter(a => a.type == 'deaths').sort((a, b) => b.amount - a.amount);

        // const playerObject = await helper.resolveUsernameOrUuid(profile.uuid, db, cacheOnly);

        // output.display_name = playerObject.display_name;

        if ('wardrobe_equipped_slot' in userProfile)
            output.wardrobe_equipped_slot = userProfile.wardrobe_equipped_slot;

        const members = Object.keys(profile.members);

        for (const member of members) {
            if (!helper.hasPath(profile, 'members', member.uuid, 'last_save'))
                continue;

            const last_updated = profile.members[member.uuid].last_save;

            member.last_updated = {
                unix: last_updated,
                text: (Date.now() - last_updated) < 7 * 60 * 1000 ? 'currently online' : `last played ${moment(last_updated).fromNow()}`
            };
        }

        if (helper.hasPath(profile, 'banking', 'balance'))
            output.bank = profile.banking.balance;


        output.purse = userProfile.coin_purse || 0;
        output.uuid = profile.uuid;
        // output.skin_data = playerObject.skin_data;

        output.profile = { profile_id: profile.profile_id, cute_name: profile.cute_name };
        output.profiles = {};

        for (const sbProfile of allProfiles.filter(a => a.profile_id != profile.profile_id)) {
            if (!helper.hasPath(sbProfile, 'members', profile.uuid, 'last_save'))
                continue;

            output.profiles[sbProfile.profile_id] = {
                profile_id: sbProfile.profile_id,
                cute_name: sbProfile.cute_name,
                last_updated: {
                    unix: sbProfile.members[profile.uuid].last_save,
                    text: `last played ${moment(sbProfile.members[profile.uuid].last_save).fromNow()}`
                }
            };
        }

        output.members = members.filter(a => a.uuid != profile.uuid);

        output.fishing = {
            total: userProfile.stats.items_fished || 0,
            treasure: userProfile.stats.items_fished_treasure || 0,
            treasure_large: userProfile.stats.items_fished_large_treasure || 0,
            shredder_fished: userProfile.stats.shredder_fished || 0,
            shredder_bait: userProfile.stats.shredder_bait || 0,
        };

        const misc = {};

        misc.milestones = {};
        misc.races = {};
        misc.gifts = {};
        misc.winter = {};
        misc.dragons = {};
        misc.protector = {};
        misc.damage = {};
        misc.auctions_sell = {};
        misc.auctions_buy = {};

        if ('ender_crystals_destroyed' in userProfile.stats)
            misc.dragons['ender_crystals_destroyed'] = userProfile.stats['ender_crystals_destroyed'];

        misc.dragons['last_hits'] = 0;
        misc.dragons['deaths'] = 0;

        const auctions_buy = ["auctions_bids", "auctions_highest_bid", "auctions_won", "auctions_gold_spent"];
        const auctions_sell = ["auctions_fees", "auctions_gold_earned"];

        const auctions_bought = {};
        const auctions_sold = {};

        for (const key of auctions_sell)
            if (key in userProfile.stats)
                misc.auctions_sell[key.replace("auctions_", "")] = userProfile.stats[key];

        for (const key of auctions_buy)
            if (key in userProfile.stats)
                misc.auctions_buy[key.replace("auctions_", "")] = userProfile.stats[key];

        for (const key in userProfile.stats)
            if (key.includes('_best_time'))
                misc.races[key] = userProfile.stats[key];
            else if (key.includes('gifts_'))
                misc.gifts[key] = userProfile.stats[key];
            else if (key.includes('most_winter'))
                misc.winter[key] = userProfile.stats[key];
            else if (key.includes('highest_critical_damage'))
                misc.damage[key] = userProfile.stats[key];
            else if (key.includes('auctions_sold_'))
                auctions_sold[key.replace("auctions_sold_", "")] = userProfile.stats[key];
            else if (key.includes('auctions_bought_'))
                auctions_bought[key.replace("auctions_bought_", "")] = userProfile.stats[key];
            else if (key.startsWith('kills_') && key.endsWith('_dragon'))
                misc.dragons['last_hits'] += userProfile.stats[key];
            else if (key.startsWith('deaths_') && key.endsWith('_dragon'))
                misc.dragons['deaths'] += userProfile.stats[key];
            else if (key.includes('kills_corrupted_protector'))
                misc.protector['last_hits'] = userProfile.stats[key];
            else if (key.includes('deaths_corrupted_protector'))
                misc.protector['deaths'] = userProfile.stats[key];
            else if (key.startsWith('pet_milestone_')) {
                misc.milestones[key.replace('pet_milestone_', '')] = userProfile.stats[key];
            }

        for (const key in misc.dragons)
            if (misc.dragons[key] == 0)
                delete misc.dragons[key];

        for (const key in misc)
            if (Object.keys(misc[key]).length == 0)
                delete misc[key];

        for (const key in auctions_bought)
            misc.auctions_buy['items_bought'] = (misc.auctions_buy['items_bought'] || 0) + auctions_bought[key];

        for (const key in auctions_sold)
            misc.auctions_sell['items_sold'] = (misc.auctions_sell['items_sold'] || 0) + auctions_sold[key];

        output.misc = misc;
        output.auctions_bought = auctions_bought;
        output.auctions_sold = auctions_sold;

        const last_updated = userProfile.last_save;
        const first_join = userProfile.first_join;

        const diff = (+new Date() - last_updated) / 1000;

        let last_updated_text = moment(last_updated).fromNow();
        let first_join_text = moment(first_join).fromNow();

        if ('current_area' in userProfile)
            output.current_area = userProfile.current_area;

        if ('current_area_updated' in userProfile)
            output.current_area_updated = userProfile.current_area_updated;

        if (diff < 3)
            last_updated_text = `Right now`;
        else if (diff < 60)
            last_updated_text = `${Math.floor(diff)} seconds ago`;

        output.last_updated = {
            unix: last_updated,
            text: last_updated_text
        };

        output.first_join = {
            unix: first_join,
            text: first_join_text
        };

        return output;
    }
};

