
const constants = require('./constants');



function getKey(key){
    const intKey = new Number(key);

    if(!isNaN(intKey))
        return intKey;

    return key;
}

module.exports = {
    hasPath: (obj, ...keys) => {
        if(obj == null)
            return false;

        let loc = obj;

        for(let i = 0; i < keys.length; i++){
            loc = loc[getKey(keys[i])];

            if(loc === undefined)
                return false;
        }

        return true;
    },

    getPath: (obj, ...keys) => {
        if(obj == null)
            return undefined;

        let loc = obj;

        for(let i = 0; i < keys.length; i++){
            loc = loc[getKey(keys[i])];

            if(loc === undefined)
                return undefined;
        }

        return loc;
    },

    setPath: (obj, value, ...keys) => {
        let i;
        let loc = obj || {};

        for(i = 0; i < keys.length - 1; i++){
            if(!loc.hasOwnProperty(keys[i]))
                loc[keys[i]] = {};

            loc = loc[keys[i]];
        }

        loc[keys[i]] = value;
    },

    getId: item => {
        if(module.exports.hasPath(item, 'tag', 'ExtraAttributes', 'id'))
            return item.tag.ExtraAttributes.id;

        return "";
    },


    renderLore: (text, enchants = false) => {
        let output = "";
        let spansOpened = 0;

        const parts = text.split("§");

        if(parts.length == 1)
            return text;

        for(const part of parts){
            const code = part.substring(0, 1);
            const content = part.substring(1);

            const format = constants.minecraft_formatting[code];

            if(format === undefined)
                continue;

            if(format.type == 'color'){
                for(; spansOpened > 0; spansOpened--)
                    output += "</span>";

                output += `<span style='${format.css}'>${content}`;

                spansOpened++;
            }else if(format.type == 'format'){
                output += `<span style='${format.css}'>${content}`;

                spansOpened++;
            }else if(format.type == 'reset'){
                for(; spansOpened > 0; spansOpened--)
                    output += "</span>";

                output += content;
            }
        }

        for(; spansOpened > 0; spansOpened--)
            output += "</span>";

        if(enchants){
            const specialColor = constants.minecraft_formatting['6'];

            const matchingEnchants = constants.special_enchants.filter(a => output.includes(a));

            for(const enchantment of matchingEnchants)
                output = output.replace(enchantment, `<span style='${specialColor.css}'>${enchantment}</span>`);
        }

        return output;
    },

    // Get Minecraft lore without the color and formatting codes
    getRawLore: text => {
        let output = "";
        let parts = text.split("§");

        for(const [index, part] of parts.entries())
            output += part.substring(Math.min(index, 1));

        return output;
    },

    capitalizeFirstLetter: word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    },

    titleCase: string => {
       let split = string.toLowerCase().split(' ');

       for(let i = 0; i < split.length; i++)
            split[i] = split[i].charAt(0).toUpperCase() + split[i].substring(1);

        return split.join(' ');
    },

    aOrAn: string => {
       return ['a', 'e', 'i', 'o', 'u'].includes(string.charAt(0).toLowerCase()) ? 'an': 'a';
    },

    getPrice: orderSummary => {
        orderSummary = orderSummary.slice(0, Math.ceil(orderSummary.length / 2));

        const orders = [];

        const totalVolume = orderSummary.map(a => a.amount).reduce((a, b) => a + b, 0);
        const volumeTop2 = Math.ceil(totalVolume * 0.02);

        let volume = 0;

        for(const order of orderSummary){
            const cappedAmount = Math.min(order.amount, volumeTop2 - volume);

            orders.push([
                order.pricePerUnit,
                cappedAmount
            ]);

            volume += cappedAmount;

            if(volume >= volumeTop2)
                break;
        }

        const totalWeight = orders.reduce((sum, value) => sum + value[1], 0);

        return orders.reduce((mean, value) => mean + value[0] * value[1] / totalWeight, 0);
    },

    getPrices: product => {
        return {
            buyPrice: module.exports.getPrice(product.buy_summary),
            sellPrice: module.exports.getPrice(product.sell_summary),
        };
    },

    formatNumber: (number, floor, rounding = 10) => {
        if(number < 1000)
            return Math.floor(number);
        else if(number < 10000)
            if(floor)
                return (Math.floor(number / 1000 * rounding) / rounding).toFixed(rounding.toString().length - 1) + 'K';
            else
                return (Math.ceil(number / 1000 * rounding) / rounding).toFixed(rounding.toString().length - 1) + 'K';
        else if(number < 1000000)
            if(floor)
                return Math.floor(number / 1000) + 'K';
            else
                return Math.ceil(number / 1000) + 'K';
        else if(number < 1000000000)
            if(floor)
                return (Math.floor(number / 1000 / 1000 * rounding) / rounding).toFixed(rounding.toString().length - 1) + 'M';
            else
                return (Math.ceil(number / 1000 / 1000 * rounding) / rounding).toFixed(rounding.toString().length - 1) + 'M';
        else
        if(floor)
            return (Math.floor(number / 1000 / 1000 / 1000 * rounding * 10) / (rounding * 10)).toFixed(rounding.toString().length) + 'B';
        else
            return (Math.ceil(number / 1000 / 1000 / 1000 * rounding * 10) / (rounding * 10)).toFixed(rounding.toString().length) + 'B';
    },

    parseRank: player => {
        let rankName = 'NONE';
        let rank = null;

        let output = {
            rankText: null,
            rankColor: null,
            plusText: null,
            plusColor: null
        };

        if(module.exports.hasPath(player, 'packageRank'))
            rankName = player.packageRank;

        if(module.exports.hasPath(player, 'newPackageRank'))
            rankName = player.newPackageRank;

        if(module.exports.hasPath(player, 'monthlyPackageRank') && player.monthlyPackageRank != 'NONE')
            rankName = player.monthlyPackageRank;

        if(module.exports.hasPath(player, 'rank') && player.rank != 'NORMAL')
            rankName = player.rank;

        if(module.exports.hasPath(player, 'prefix'))
            rankName = module.exports.getRawLore(player.prefix).replace(/\[|\]/g, '');

        if(module.exports.hasPath(constants.ranks, rankName))
            rank = constants.ranks[rankName];

        if(!rank)
            return output;

        output.rankText = rank.tag;
        output.rankColor = rank.color;

        if(rankName == 'SUPERSTAR'){
            if(!module.exports.hasPath(player, 'monthlyRankColor'))
                player.monthlyRankColor = 'GOLD';

            output.rankColor = constants.color_names[player.monthlyRankColor];
        }

        if(module.exports.hasPath(rank, 'plus')){
            output.plusText = rank.plus;
            output.plusColor = output.rankColor;
        }

        if(output.plusText && module.exports.hasPath(player, 'rankPlusColor'))
            output.plusColor = constants.color_names[player.rankPlusColor];

        if(rankName == 'PIG+++')
            output.plusColor = 'b';

        return output;
    },

    renderRank: rank => {
        let { rankText, rankColor, plusText, plusColor } = rank;
        let output = "";

        if(rankText === null)
            return output;

        rankColor = constants.minecraft_formatting[rankColor].niceColor
        || constants.minecraft_formatting[rankColor].color;

        output = `<div class="rank-tag ${plusText ? 'rank-plus' : ''}"><div class="rank-name" style="background-color: ${rankColor}">${rankText}</div>`;

        if(plusText){
            plusColor = constants.minecraft_formatting[plusColor].niceColor
            || constants.minecraft_formatting[plusColor].color

            output += `<div class="rank-plus" style="background-color: ${plusColor}"><div class="rank-plus-before" style="background-color: ${plusColor};"></div><span class="rank-plus-text">${plusText}</span></div>`;
        }

        output += `</div>`;

        return output;
    },


}