module.exports = {
    reforges: {
        // sword and fishing_rod reforges
        legendary: {
            item_types: ['sword', 'weapon', 'fishing_rod'],
            common: { strength: 3, crit_chance: 5, crit_damage: 5, intelligence: 5, bonus_attack_speed: 2 },
            uncommon: { strength: 7, crit_chance: 7, crit_damage: 10, intelligence: 8, bonus_attack_speed: 3 },
            rare: { strength: 12, crit_chance: 9, crit_damage: 15, intelligence: 12, bonus_attack_speed: 5 },
            epic: { strength: 18, crit_chance: 12, crit_damage: 22, intelligence: 18, bonus_attack_speed: 7 },
            legendary: { strength: 25, crit_chance: 15, crit_damage: 28, intelligence: 25, bonus_attack_speed: 10 },
            mythic: { strength: 32, crit_chance: 18, crit_damage: 36, intelligence: 35, bonus_attack_speed: 15 },
        },
        spicy: {
            item_types: ['sword', 'weapon', 'weapon', 'fishing_rod'],
            common: { strength: 2, crit_chance: 1, crit_damage: 25, bonus_attack_speed: 1 },
            uncommon: { strength: 3, crit_chance: 1, crit_damage: 35, bonus_attack_speed: 2 },
            rare: { strength: 4, crit_chance: 1, crit_damage: 45, bonus_attack_speed: 4 },
            epic: { strength: 7, crit_chance: 1, crit_damage: 60, bonus_attack_speed: 7 },
            legendary: { strength: 10, crit_chance: 1, crit_damage: 80, bonus_attack_speed: 10 },
            mythic: { strength: 12, crit_chance: 1, crit_damage: 100, bonus_attack_speed: 15 },
        },
        epic: {
            item_types: ['sword', 'weapon', 'fishing_rod'],
            common: { strength: 15, crit_damage: 10, bonus_attack_speed: 1 },
            uncommon: { strength: 20, crit_damage: 15, bonus_attack_speed: 2 },
            rare: { strength: 25, crit_damage: 20, bonus_attack_speed: 4 },
            epic: { strength: 32, crit_damage: 27, bonus_attack_speed: 7 },
            legendary: { strength: 40, crit_damage: 35, bonus_attack_speed: 10 },
            mythic: { strength: 50, crit_damage: 45, bonus_attack_speed: 15 },
        },
        odd: {
            item_types: ['sword', 'weapon', 'fishing_rod'],
            common: { crit_chance: 12, crit_damage: 10, intelligence: -5 },
            uncommon: { crit_chance: 15, crit_damage: 15, intelligence: -10 },
            rare: { crit_chance: 15, crit_damage: 15, intelligence: -18 },
            epic: { crit_chance: 20, crit_damage: 22, intelligence: -32 },
            legendary: { crit_chance: 25, crit_damage: 30, intelligence: -36 },
            mythic: { crit_chance: 30, crit_damage: 40, intelligence: -50 },
        },
        gentle: {
            item_types: ['sword', 'weapon', 'fishing_rod'],
            common: { strength: 3, bonus_attack_speed: 8 },
            uncommon: { strength: 5, bonus_attack_speed: 10 },
            rare: { strength: 7, bonus_attack_speed: 15 },
            epic: { strength: 10, bonus_attack_speed: 20 },
            legendary: { strength: 15, bonus_attack_speed: 25 },
            mythic: { strength: 20, bonus_attack_speed: 30 },
        },
        fast: {
            item_types: ['sword', 'weapon', 'fishing_rod'],
            common: { bonus_attack_speed: 10 },
            uncommon: { bonus_attack_speed: 20 },
            rare: { bonus_attack_speed: 30 },
            epic: { bonus_attack_speed: 40 },
            legendary: { bonus_attack_speed: 50 },
            mythic: { bonus_attack_speed: 60 },
        },
        fair: {
            item_types: ['sword', 'weapon', 'fishing_rod'],
            common: { strength: 2, crit_chance: 2, crit_damage: 2, intelligence: 2, bonus_attack_speed: 2 },
            uncommon: { strength: 3, crit_chance: 3, crit_damage: 3, intelligence: 3, bonus_attack_speed: 3 },
            rare: { strength: 4, crit_chance: 4, crit_damage: 4, intelligence: 4, bonus_attack_speed: 4 },
            epic: { strength: 7, crit_chance: 7, crit_damage: 7, intelligence: 7, bonus_attack_speed: 7 },
            legendary: { strength: 10, crit_chance: 10, crit_damage: 10, intelligence: 10, bonus_attack_speed: 10 },
            mythic: { strength: 12, crit_chance: 12, crit_damage: 12, intelligence: 12, bonus_attack_speed: 12 },
        },
        sharp: {
            item_types: ['sword', 'weapon', 'fishing_rod'],
            common: { crit_chance: 10, crit_damage: 20 },
            uncommon: { crit_chance: 12, crit_damage: 30 },
            rare: { crit_chance: 14, crit_damage: 40 },
            epic: { crit_chance: 17, crit_damage: 55 },
            legendary: { crit_chance: 20, crit_damage: 75 },
            mythic: { crit_chance: 25, crit_damage: 90 },
        },
        heroic: {
            item_types: ['sword', 'weapon', 'fishing_rod'],
            common: { strength: 15, intelligence: 40, bonus_attack_speed: 1 },
            uncommon: { strength: 20, intelligence: 50, bonus_attack_speed: 2 },
            rare: { strength: 25, intelligence: 65, bonus_attack_speed: 2 },
            epic: { strength: 32, intelligence: 80, bonus_attack_speed: 3 },
            legendary: { strength: 40, intelligence: 100, bonus_attack_speed: 5 },
            mythic: { strength: 50, intelligence: 125, bonus_attack_speed: 7 },
        },
        fabled: {
            item_types: ['sword', 'weapon', 'fishing_rod'],
            // Your Critical hits have a chance to deal up to 20% extra damage (from 100% to 120%, randomly)
            common: { strength: 30, crit_damage: 15 },
            uncommon: { strength: 35, crit_damage: 20 },
            rare: { strength: 40, crit_damage: 25 },
            epic: { strength: 50, crit_damage: 32 },
            legendary: { strength: 60, crit_damage: 40 },
            mythic: { strength: 75, crit_damage: 60 },
        },
        suspicious: {
            item_types: ['sword', 'weapon', 'fishing_rod'],
            common: { damage: 15, crit_damage: 30, crit_chance: 1 },
            uncommon: { damage: 15, crit_damage: 40, crit_chance: 2 },
            rare: { damage: 15, crit_damage: 50, crit_chance: 3 },
            epic: { damage: 15, crit_damage: 65, crit_chance: 5 },
            legendary: { damage: 15, crit_damage: 85, crit_chance: 7 },
            mythic: { damage: 15, crit_damage: 110, crit_chance: 10 },
        },
        withered: {
            item_types: ['sword', 'weapon', 'fishing_rod'],
            common: { strength: 60 },
            epic: { strength: 110 },
            legendary: { strength: 135 },
            mythic: { strength: 170 },
        },
        dirty: {
            item_types: ['sword', 'weapon', 'fishing_rod'],
            rare: { strength: 6, bonus_attack_speed: 5, ferocity: 6 },
            epic: { strength: 10, bonus_attack_speed: 10, ferocity: 9 },
            legendary: { strength: 12, bonus_attack_speed: 15, ferocity: 12 },
            mythic: { strength: 15, bonus_attack_speed: 20, ferocity: 15 },
        },
        // sword reforges
        warped: {
            // only aote
            item_types: ['sword', 'weapon'],
            rare: { damage: 165, strength: 165 },
            epic: { damage: 165, strength: 165 },
        },
        gilded: {
            // ability: byron's compassion
            // only midas
            item_types: ['sword', 'weapon'],
            legendary: { damage: 75, strength: 75 },
            mythic: { damage: 90, strength: 90 },
        },
        // fishing_rod reforges
        salty: {
            item_types: ['fishing_rod'],
            common: { sea_creature_chance: 1 },
            uncommon: { sea_creature_chance: 2 },
            rare: { sea_creature_chance: 2 },
            epic: { sea_creature_chance: 3 },
            legendary: { sea_creature_chance: 5 },
            mythic: { sea_creature_chance: 7 },
        },
        treacherous: {
            item_types: ['fishing_rod'],
            common: { strength: 5, sea_creature_chance: 1 },
            uncommon: { strength: 10, sea_creature_chance: 2 },
            rare: { strength: 15, sea_creature_chance: 2 },
            epic: { strength: 20, sea_creature_chance: 3 },
            legendary: { strength: 25, sea_creature_chance: 5 },
            mythic: { strength: 30, sea_creature_chance: 7 },
        },
        // bow reforges
        awkward: {
            item_types: ['bow', 'weapon'],
            common: { crit_chance: 10, crit_damage: 5, intelligence: -5 },
            uncommon: { crit_chance: 12, crit_damage: 10, intelligence: -10 },
            rare: { crit_chance: 15, crit_damage: 15, intelligence: -18 },
            epic: { crit_chance: 20, crit_damage: 22, intelligence: -32 },
            legendary: { crit_chance: 25, crit_damage: 30, intelligence: -50 },
            mythic: { crit_chance: 30, crit_damage: 40, intelligence: -60 },
        },
        rich: {
            item_types: ['bow', 'weapon'],
            common: { strength: 2, crit_chance: 10, crit_damage: 1, intelligence: 20 },
            uncommon: { strength: 3, crit_chance: 12, crit_damage: 2, intelligence: 25 },
            rare: { strength: 4, crit_chance: 14, crit_damage: 4, intelligence: 30 },
            epic: { strength: 7, crit_chance: 17, crit_damage: 7, intelligence: 40 },
            legendary: { strength: 10, crit_chance: 20, crit_damage: 10, intelligence: 50 },
            mythic: { strength: 12, crit_chance: 25, crit_damage: 15, intelligence: 75 },
        },
        fine: {
            item_types: ['bow', 'weapon'],
            common: { strength: 3, crit_chance: 5, crit_damage: 2 },
            uncommon: { strength: 7, crit_chance: 7, crit_damage: 4 },
            rare: { strength: 12, crit_chance: 9, crit_damage: 7 },
            epic: { strength: 18, crit_chance: 12, crit_damage: 10 },
            legendary: { strength: 25, crit_chance: 15, crit_damage: 15 },
            mythic: { strength: 40, crit_chance: 20, crit_damage: 20 },
        },
        neat: {
            item_types: ['bow', 'weapon'],
            common: { crit_chance: 10, crit_damage: 4, intelligence: 3 },
            uncommon: { crit_chance: 12, crit_damage: 8, intelligence: 6 },
            rare: { crit_chance: 14, crit_damage: 14, intelligence: 10 },
            epic: { crit_chance: 17, crit_damage: 20, intelligence: 15 },
            legendary: { crit_chance: 20, crit_damage: 30, intelligence: 20 },
            mythic: { crit_chance: 25, crit_damage: 40, intelligence: 30 },
        },
        hasty: {
            item_types: ['bow', 'weapon'],
            common: { strength: 3, crit_chance: 20 },
            uncommon: { strength: 5, crit_chance: 25 },
            rare: { strength: 7, crit_chance: 30 },
            epic: { strength: 10, crit_chance: 40 },
            legendary: { strength: 15, crit_chance: 50 },
            mythic: { strength: 20, crit_chance: 60 },
        },
        grand: {
            item_types: ['bow', 'weapon'],
            common: { strength: 25 },
            uncommon: { strength: 32 },
            rare: { strength: 40 },
            epic: { strength: 50 },
            legendary: { strength: 60 },
            mythic: { strength: 70 },
        },
        rapid: {
            item_types: ['bow', 'weapon'],
            common: { strength: 2, crit_damage: 35 },
            uncommon: { strength: 3, crit_damage: 45 },
            rare: { strength: 4, crit_damage: 55 },
            epic: { strength: 7, crit_damage: 65 },
            legendary: { strength: 10, crit_damage: 75 },
            mythic: { strength: 12, crit_damage: 90 },
        },
        deadly: {
            item_types: ['bow', 'weapon'],
            common: { crit_chance: 10, crit_damage: 5 },
            uncommon: { crit_chance: 13, crit_damage: 10 },
            rare: { crit_chance: 16, crit_damage: 18 },
            epic: { crit_chance: 19, crit_damage: 32 },
            legendary: { crit_chance: 22, crit_damage: 50 },
            mythic: { crit_chance: 25, crit_damage: 70 },
        },
        unreal: {
            item_types: ['bow', 'weapon'],
            common: { strength: 3, crit_chance: 8, crit_damage: 5 },
            uncommon: { strength: 7, crit_chance: 9, crit_damage: 10 },
            rare: { strength: 12, crit_chance: 10, crit_damage: 18 },
            epic: { strength: 18, crit_chance: 11, crit_damage: 32 },
            legendary: { strength: 25, crit_chance: 13, crit_damage: 50 },
            mythic: { strength: 34, crit_chance: 15, crit_damage: 75 },
        },
        spiritual: {
            item_types: ['bow', 'weapon'],
            epic: { strength: 20, crit_chance: 10, crit_damage: 37 },
            legendary: { strength: 28, crit_chance: 12, crit_damage: 55 },
            mythic: { strength: 38, crit_chance: 14, crit_damage: 75 },
        },
        precise: {
            // ability: 10% when hitting the head of a mob
            item_types: ['bow', 'weapon'],
            common: { strength: 3, crit_chance: 8, crit_damage: 5 },
            uncommon: { strength: 7, crit_chance: 9, crit_damage: 10 },
            rare: { strength: 12, crit_chance: 10, crit_damage: 18 },
            epic: { strength: 18, crit_chance: 11, crit_damage: 32 },
            legendary: { strength: 25, crit_chance: 13, crit_damage: 50 },
            mythic: { strength: 34, crit_chance: 15, crit_damage: 75 },
        },
        // armor reforges
        candied: {
            // ability: increase chance to find candy by 1%
            item_types: ['helmet', 'chestplate', 'leggings', 'boots', 'armor'],
            common: { defense: 1, health: 1 },
            uncommon: { defense: 1, health: 2 },
            rare: { defense: 2, health: 4 },
            epic: { defense: 3, health: 6 },
            legendary: { defense: 4, health: 8 },
            mythic: { defense: 5, health: 10 },
        },
        warped_stone: {
            // ability: after using an ability gain +1/2/3/4/5/8 speed for 5s
            item_types: ['helmet', 'chestplate', 'leggings', 'boots', 'armor'],
            common: { strength: 2, bonus_attack_speed: 2, speed: 1 },
            uncommon: { strength: 4, bonus_attack_speed: 3, speed: 1 },
            rare: { strength: 6, bonus_attack_speed: 4, speed: 2 },
            epic: { strength: 7, bonus_attack_speed: 5, speed: 2 },
            legendary: { strength: 10, bonus_attack_speed: 6, speed: 3 },
            mythic: { strength: 12, bonus_attack_speed: 7, speed: 3 },
        },
        smart: {
            item_types: ['helmet', 'chestplate', 'leggings', 'boots', 'armor'],
            common: { defense: 4, health: 4, intelligence: 20 },
            uncommon: { defense: 6, health: 6, intelligence: 40 },
            rare: { defense: 9, health: 9, intelligence: 60 },
            epic: { defense: 12, health: 12, intelligence: 80 },
            legendary: { defense: 15, health: 15, intelligence: 100 },
            mythic: { defense: 20, health: 20, intelligence: 120 },
        },
        clean: {
            item_types: ['helmet', 'chestplate', 'leggings', 'boots', 'armor'],
            common: { defense: 5, health: 5, crit_chance: 2 },
            uncommon: { defense: 7, health: 7, crit_chance: 4 },
            rare: { defense: 10, health: 10, crit_chance: 6 },
            epic: { defense: 15, health: 15, crit_chance: 8 },
            legendary: { defense: 20, health: 20, crit_chance: 10 },
            mythic: { defense: 25, health: 25, crit_chance: 12 },
        },
        fierce: {
            item_types: ['helmet', 'chestplate', 'leggings', 'boots', 'armor'],
            common: { strength: 2, crit_chance: 2, crit_damage: 4 },
            uncommon: { strength: 4, crit_chance: 3, crit_damage: 7 },
            rare: { strength: 6, crit_chance: 4, crit_damage: 10 },
            epic: { strength: 8, crit_chance: 5, crit_damage: 14 },
            legendary: { strength: 10, crit_chance: 6, crit_damage: 18 },
            mythic: { strength: 12, crit_chance: 8, crit_damage: 24 },
        },
        heavy: {
            item_types: ['helmet', 'chestplate', 'leggings', 'boots', 'armor'],
            common: { defense: 25, speed: -1, crit_damage: -1 },
            uncommon: { defense: 35, speed: -1, crit_damage: -2 },
            rare: { defense: 50, speed: -1, crit_damage: -2 },
            epic: { defense: 65, speed: -1, crit_damage: -3 },
            legendary: { defense: 80, speed: -1, crit_damage: -5 },
            mythic: { defense: 110, speed: -1, crit_damage: -7 },
        },
        light: {
            item_types: ['helmet', 'chestplate', 'leggings', 'boots', 'armor'],
            common: { defense: 1, speed: 1, health: 5, crit_chance: 1, bonus_attack_speed: 1, crit_damage: 1 },
            uncommon: { defense: 2, speed: 2, health: 7, crit_chance: 1, bonus_attack_speed: 2, crit_damage: 2 },
            rare: { defense: 3, speed: 3, health: 10, crit_chance: 2, bonus_attack_speed: 3, crit_damage: 3 },
            epic: { defense: 4, speed: 4, health: 15, crit_chance: 2, bonus_attack_speed: 4, crit_damage: 4 },
            legendary: { defense: 5, speed: 5, health: 20, crit_chance: 2, bonus_attack_speed: 5, crit_damage: 5 },
            mythic: { defense: 6, speed: 6, health: 25, crit_chance: 3, bonus_attack_speed: 6, crit_damage: 6 },
        },
        mythic: {
            item_types: ['helmet', 'chestplate', 'leggings', 'boots', 'armor'],
            common: { strength: 2, defense: 2, speed: 2, health: 2, crit_chance: 1, intelligence: 20 },
            uncommon: { strength: 4, defense: 4, speed: 2, health: 4, crit_chance: 2, intelligence: 25 },
            rare: { strength: 6, defense: 6, speed: 2, health: 6, crit_chance: 3, intelligence: 30 },
            epic: { strength: 8, defense: 8, speed: 2, health: 8, crit_chance: 4, intelligence: 40 },
            legendary: { strength: 10, defense: 10, speed: 2, health: 10, crit_chance: 5, intelligence: 50 },
            mythic: { strength: 12, defense: 12, speed: 2, health: 12, crit_chance: 6, intelligence: 60 },
        },
        titanic: {
            item_types: ['helmet', 'chestplate', 'leggings', 'boots', 'armor'],
            common: { defense: 10, health: 10 },
            uncommon: { defense: 15, health: 15 },
            rare: { defense: 20, health: 20 },
            epic: { defense: 25, health: 25 },
            legendary: { defense: 35, health: 35 },
            mythic: { defense: 50, health: 50 },
        },
        wise: {
            item_types: ['helmet', 'chestplate', 'leggings', 'boots', 'armor'],
            common: { speed: 1, health: 6, intelligence: 25 },
            uncommon: { speed: 1, health: 8, intelligence: 50 },
            rare: { speed: 1, health: 10, intelligence: 75 },
            epic: { speed: 2, health: 12, intelligence: 100 },
            legendary: { speed: 2, health: 15, intelligence: 125 },
            mythic: { speed: 3, health: 20, intelligence: 150 },
        },
        pure: {
            item_types: ['helmet', 'chestplate', 'leggings', 'boots', 'armor'],
            common: {
                strength: 2,
                defense: 2,
                speed: 1,
                health: 2,
                crit_chance: 2,
                crit_damage: 2,
                intelligence: 2,
                bonus_attack_speed: 1,
            },
            uncommon: {
                strength: 3,
                defense: 3,
                speed: 1,
                health: 3,
                crit_chance: 4,
                crit_damage: 3,
                intelligence: 3,
                bonus_attack_speed: 1,
            },
            rare: {
                strength: 4,
                defense: 4,
                speed: 1,
                health: 4,
                crit_chance: 6,
                crit_damage: 4,
                intelligence: 4,
                bonus_attack_speed: 2,
            },
            epic: {
                strength: 6,
                defense: 6,
                speed: 1,
                health: 6,
                crit_chance: 8,
                crit_damage: 6,
                intelligence: 6,
                bonus_attack_speed: 3,
            },
            legendary: {
                strength: 8,
                defense: 8,
                speed: 1,
                health: 8,
                crit_chance: 10,
                crit_damage: 8,
                intelligence: 8,
                bonus_attack_speed: 4,
            },
            mythic: {
                strength: 10,
                defense: 10,
                speed: 1,
                health: 10,
                crit_chance: 12,
                crit_damage: 10,
                intelligence: 10,
                bonus_attack_speed: 5,
            },
        },
        spiked: {
            item_types: ['helmet', 'chestplate', 'leggings', 'boots', 'armor'],
            epic: {
                strength: 8,
                defense: 6,
                speed: 1,
                health: 6,
                crit_chance: 8,
                crit_damage: 8,
                intelligence: 8,
                bonus_attack_speed: 3,
            },
            legendary: {
                strength: 10,
                defense: 8,
                speed: 1,
                health: 8,
                crit_chance: 10,
                crit_damage: 10,
                intelligence: 10,
                bonus_attack_speed: 4,
            },
            mythic: {
                strength: 12,
                defense: 10,
                speed: 1,
                health: 10,
                crit_chance: 12,
                crit_damage: 12,
                intelligence: 12,
                bonus_attack_speed: 5,
            },
        },
        renowned: {
            // ability: +1% player stats
            item_types: ['helmet', 'chestplate', 'leggings', 'boots', 'armor'],
            epic: {
                strength: 8,
                defense: 6,
                speed: 1,
                health: 6,
                crit_chance: 8,
                crit_damage: 8,
                intelligence: 8,
                bonus_attack_speed: 3,
            },
            legendary: {
                strength: 10,
                defense: 8,
                speed: 1,
                health: 8,
                crit_chance: 10,
                crit_damage: 10,
                intelligence: 10,
                bonus_attack_speed: 4,
            },
            mythic: {
                strength: 12,
                defense: 10,
                speed: 1,
                health: 10,
                crit_chance: 12,
                crit_damage: 12,
                intelligence: 12,
                bonus_attack_speed: 5,
            },
        },
        cubic: {
            // ability: decrease damage take from nether mobs by 2%
            item_types: ['helmet', 'chestplate', 'leggings', 'boots', 'armor'],
            common: { strength: 3, health: 5 },
            uncommon: { strength: 5, health: 7 },
            rare: { strength: 7, health: 10 },
            epic: { strength: 10, health: 15 },
            legendary: { strength: 12, health: 20 },
            mythic: { strength: 15, health: 30 },
        },
        reinforced: {
            item_types: ['helmet', 'chestplate', 'leggings', 'boots', 'armor'],
            common: { defense: 25 },
            uncommon: { defense: 35 },
            rare: { defense: 50 },
            epic: { defense: 65 },
            legendary: { defense: 80 },
            mythic: { defense: 100 },
        },
        ancient: {
            // ability: +1 crit_damage per catacombs level
            item_types: ['helmet', 'chestplate', 'leggings', 'boots', 'armor'],
            common: { strength: 4, crit_chance: 3, health: 7, defense: 7, intelligence: 6 },
            uncommon: { strength: 8, crit_chance: 5, health: 7, defense: 7, intelligence: 9 },
            rare: { strength: 12, crit_chance: 7, health: 7, defense: 7, intelligence: 12 },
            epic: { strength: 18, crit_chance: 9, health: 7, defense: 7, intelligence: 16 },
            legendary: { strength: 25, crit_chance: 12, health: 7, defense: 7, intelligence: 20 },
            mythic: { strength: 35, crit_chance: 15, health: 7, defense: 7, intelligence: 25 },
        },
        perfect: {
            // ability: player defense +2%
            item_types: ['helmet', 'chestplate', 'leggings', 'boots', 'armor'],
            common: { defense: 25 },
            uncommon: { defense: 35 },
            rare: { defense: 50 },
            epic: { defense: 65 },
            legendary: { defense: 80 },
            mythic: { defense: 110 },
        },
        giant: {
            item_types: ['helmet', 'chestplate', 'leggings', 'boots', 'armor'],
            common: { health: 50 },
            uncommon: { health: 60 },
            rare: { health: 80 },
            epic: { health: 120 },
            legendary: { health: 180 },
            mythic: { health: 240 },
        },
        submerged: {
            item_types: ['helmet', 'chestplate', 'leggings', 'boots', 'armor'],
            rare: { crit_chance: 6, sea_creature_chance: 0.7 },
            legendary: { crit_chance: 10, sea_creature_chance: 0.9 },
            mythic: { crit_chance: 12, sea_creature_chance: 1 },
        },
        ridiculous: {
            item_types: ['helmet'],
            common: { health: 10, defense: 10, crit_chance: 1 },
            uncommon: { health: 15, defense: 15, crit_chance: 2 },
            rare: { health: 20, defense: 20, crit_chance: 3 },
            epic: { health: 25, defense: 25, crit_chance: 4 },
            legendary: { health: 35, defense: 35, crit_chance: 5 },
        },
        loving: {
            // ability: 5% more ability damage
            item_types: ['chestplate'],
            common: { health: 4, defense: 4, intelligence: 20 },
            uncommon: { health: 5, defense: 5, intelligence: 40 },
            rare: { health: 6, defense: 6, intelligence: 60 },
            epic: { health: 8, defense: 8, intelligence: 80 },
            legendary: { health: 10, defense: 10, intelligence: 100 },
            mythic: { health: 14, defense: 14, intelligence: 120 },
        },
        necrotic: {
            item_types: ['helmet', 'chestplate', 'leggings', 'boots', 'armor'],
            common: { intelligence: 30 },
            uncommon: { intelligence: 60 },
            rare: { intelligence: 90 },
            epic: { intelligence: 120 },
            legendary: { intelligence: 150 },
            mythic: { intelligence: 200 },
        },
        // accessory reforges
        sweet: {
            item_types: ['accessory'],
            common: { defense: 1, health: 3, speed: 1 },
            uncommon: { defense: 2, health: 4, speed: 1 },
            rare: { defense: 2, health: 6, speed: 2 },
            epic: { defense: 2, health: 8, speed: 2 },
            legendary: { defense: 4, health: 12, speed: 3 },
            mythic: { defense: 4, health: 16, speed: 4 },
        },
        bizarre: {
            item_types: ['accessory'],
            common: { strength: 1, crit_damage: -1, health: 1, intelligence: 6 },
            uncommon: { strength: 2, crit_damage: -2, health: 1, intelligence: 8 },
            rare: { strength: 2, crit_damage: -2, health: 1, intelligence: 10 },
            epic: { strength: 3, crit_damage: -3, health: 1, intelligence: 14 },
            legendary: { strength: 5, crit_damage: -5, health: 1, intelligence: 20 },
            mythic: { strength: 7, crit_damage: -7, health: 2, intelligence: 30 },
        },
        itchy: {
            item_types: ['accessory'],
            common: { strength: 1, crit_damage: 3 },
            uncommon: { strength: 1, crit_damage: 4 },
            rare: { strength: 1, crit_damage: 5, bonus_attack_speed: 1 },
            epic: { strength: 2, crit_damage: 7, bonus_attack_speed: 1 },
            legendary: { strength: 3, crit_damage: 10, bonus_attack_speed: 1 },
            mythic: { strength: 4, crit_damage: 15, bonus_attack_speed: 1 },
        },
        unpleasant: {
            item_types: ['accessory'],
            common: { crit_chance: 1 },
            uncommon: { crit_chance: 1 },
            rare: { crit_chance: 1 },
            epic: { crit_chance: 2 },
            legendary: { crit_chance: 2 },
            mythic: { crit_chance: 3 },
        },
        superior: {
            item_types: ['accessory'],
            common: { strength: 2, crit_damage: 2 },
            uncommon: { strength: 3, crit_damage: 2 },
            rare: { strength: 4, crit_damage: 2 },
            epic: { strength: 5, crit_damage: 3 },
            legendary: { strength: 7, crit_damage: 3 },
            mythic: { strength: 10, crit_damage: 5 },
        },
        forceful: {
            item_types: ['accessory'],
            common: { strength: 4 },
            uncommon: { strength: 5 },
            rare: { strength: 7 },
            epic: { strength: 10 },
            legendary: { strength: 15 },
            mythic: { strength: 20 },
        },
        hurtful: {
            item_types: ['accessory'],
            common: { crit_damage: 4 },
            uncommon: { crit_damage: 5 },
            rare: { crit_damage: 7 },
            epic: { crit_damage: 10 },
            legendary: { crit_damage: 15 },
            mythic: { crit_damage: 20 },
        },
        strong: {
            item_types: ['accessory'],
            common: { strength: 1, crit_damage: 1 },
            uncommon: { strength: 2, crit_damage: 2 },
            rare: { strength: 3, crit_damage: 3, defense: 1 },
            epic: { strength: 5, crit_damage: 5, defense: 2 },
            legendary: { strength: 8, crit_damage: 8, defense: 3 },
            mythic: { strength: 12, crit_damage: 12, defense: 4 },
        },
        godly: {
            item_types: ['accessory'],
            common: { strength: 1, crit_damage: 2, intelligence: 1 },
            uncommon: { strength: 2, crit_damage: 2, intelligence: 1 },
            rare: { strength: 3, crit_damage: 3, intelligence: 1 },
            epic: { strength: 5, crit_damage: 4, intelligence: 2 },
            legendary: { strength: 7, crit_damage: 6, intelligence: 4 },
            mythic: { strength: 10, crit_damage: 8, intelligence: 6 },
        },
        demonic: {
            item_types: ['accessory'],
            common: { strength: 1, intelligence: 5 },
            uncommon: { strength: 2, intelligence: 7 },
            rare: { strength: 2, intelligence: 9 },
            epic: { strength: 3, intelligence: 12 },
            legendary: { strength: 5, intelligence: 17 },
            mythic: { strength: 7, intelligence: 24 },
        },
        zealous: {
            item_types: ['accessory'],
            common: { strength: 1, crit_damage: 1, intelligence: 1 },
            uncommon: { strength: 2, crit_damage: 2, intelligence: 2 },
            rare: { strength: 2, speed: 1, crit_damage: 2, intelligence: 3 },
            epic: { strength: 3, speed: 1, crit_damage: 3, intelligence: 5 },
            legendary: { strength: 5, speed: 1, crit_damage: 5, intelligence: 7 },
            mythic: { strength: 7, speed: 2, crit_damage: 7, intelligence: 10 },
        },
        strange: {
            item_types: ['accessory'],
            common: { crit_damage: 1, strength: 2, speed: 1, intelligence: 1, bonus_attack_speed: -1 },
            uncommon: { crit_damage: 2, strength: 1, defense: 3, health: 2, intelligence: -1, bonus_attack_speed: 2 },
            rare: { strength: -1, defense: 2, speed: 1, health: 1, intelligence: 2 },
            epic: { crit_damage: 1, strength: 3, defense: -1, health: 7, bonus_attack_speed: 4 },
            legendary: { crit_damage: 7, defense: 1, speed: 3, health: -1, intelligence: 8 },
            mythic: { crit_damage: 9, strength: 4, defense: 1, speed: 3, intelligence: 11, bonus_attack_speed: 5 },
        },
        silky: {
            item_types: ['accessory'],
            common: { crit_damage: 5 },
            uncommon: { crit_damage: 6 },
            rare: { crit_damage: 8 },
            epic: { crit_damage: 10 },
            legendary: { crit_damage: 15 },
            mythic: { crit_damage: 20 },
        },
        bloody: {
            item_types: ['accessory'],
            common: { strength: 1, crit_damage: 3, bonus_attack_speed: 1, speed: 1 },
            uncommon: { strength: 1, crit_damage: 4, bonus_attack_speed: 1, speed: 1 },
            rare: { strength: 1, crit_damage: 5, bonus_attack_speed: 1, speed: 1 },
            epic: { strength: 2, crit_damage: 6, bonus_attack_speed: 2, speed: 1 },
            legendary: { strength: 3, crit_damage: 9, bonus_attack_speed: 2, speed: 1 },
            mythic: { strength: 4, crit_damage: 14, bonus_attack_speed: 2, speed: 1 },
        },
        shaded: {
            item_types: ['accessory'],
            common: { strength: 2, crit_damage: 3 },
            uncommon: { strength: 3, crit_damage: 4 },
            rare: { strength: 4, crit_damage: 5 },
            epic: { strength: 5, crit_damage: 6 },
            legendary: { strength: 6, crit_damage: 9, crit_chance: 1 },
            mythic: { strength: 8, crit_damage: 14, crit_chance: 1 },
        },
    },
    reforge_stones: {
        Candled: {
            item_name: "Candy Corn"
        },
        Submerged: {
            item_name: "Deep Sea Orb"
        },
        Reinforced: {
            item_name: "Rare Diamond"
        },
        Dirty: {
            item_name: "Dirt Bottle"
        },
        Cubic: {
            item_name: "Molten Cube"
        },
        Warped: {
            item_name: "Warped Stone"
        },
        Undead: {
            item_name: "Premium Flesh"
        },
        Rediculous: {
            item_name: "Red Nose"
        },
        Necrotic: {
            item_name: "Necromancer's Brooch"
        },
        Spiked: {
            item_name: "Dragon Scale"
        },
        Loving: {
            item_name: "Red Scarf"
        },
        Perfect: {
            item_name: "Diamond Atom"
        },
        Fabled: {
            item_name: "Dragon Claw"
        },
        Suspicious: {
            item_name: "Suspicious Vial"
        },
        Renowned: {
            item_name: "Dragon Horn"
        },
        Gilded: {
            item_name: "Midas Jewel"
        },
        Giant: {
            item_name: "Giant Tooth"
        },
        Enpowered: {
            item_name: "Sadan's Brooch"
        },
        Ancient: {
            item_name: "Precursor Gear"
        },
        Withered: {
            item_name: "Wither Blood"
        },
        Moil: {
            item_name: "Moil Log"
        },
        Blessed: {
            item_name: "Blessed Fruit"
        },
        Toil: {
            item_name: "Toil Log"
        },
        Precise: {
            item_name: "Optical Lens"
        },
        Spiritual: {
            item_name: "Spirit Stone"
        },
        Headstrong: {
            item_name: "Salmon Opal"
        },
        Fruitful: {
            item_name: "Onyx"
        },
        Magnetic: {
            item_name: "Lapis Crystal"
        },
        Fleet: {
            item_name: "Diamonite"
        },
        Mithraic: {
            item_name: "Pure Mithril"
        },
        Auspicious: {
            item_name: "Rock Gemstone"
        },
        Refined: {
            item_name: "Refined Amber"
        },
        Stellar: {
            item_name: "Petrified Starfall"
        }
    }
}