import { ResourceType, BuildingType, JobType } from "../enum";

export const defaults = [
    // { key: 'destroyed', resource: require('./audio/destroyed.mp3'), type: 'audio' },
    { key: 'warp', resource: require('./warp.png'), type: 'spritesheet', data: { frameWidth: 320, frameHeight: 320 }},
    { key: 'target', resource: require('./icon/target.png'), type: 'image'},
    { key: 'selected', resource: require('./selected.png'), type: 'image'},
    { key: 'arrow', resource: require('./arrow.png'), type: 'image'},
    { key: 'repair', resource: require('./icon/repair.png'), type: 'image'},
    { key: 'melee', resource: require('./icon/melee.png'), type: 'image'},
    { key: 'roads', resource: require('./terrain/roads.png'), type: 'image'},
    { key: 'features', resource: require('./terrain/terrain-features-extruded.png'), type: 'image'},
    { key: 'terrain', resource: require('./terrain/terrain-extruded.png'), type: 'image'},
    { key: 'map', resource: require('./maps/level1.json'), type: 'tilemapTiledJSON', data: {}},
    { key: 'resources', resource: require('./structures/16x16.png'), type: 'spritesheet', data: { frameWidth: 16, frameHeight: 16 }},
    { key: 'creature_hit', resource: require('./creature_hit.png'), type: 'spritesheet', data: { frameWidth: 100, frameHeight: 100 }},
    { key: 'explosion', resource: require('./explosion-2.png'), type: 'spritesheet', data: { frameWidth: 64, frameHeight: 64 }},
    { key: 'seal', resource: require('./spells/seal.png'), type: 'spritesheet', data: { frameWidth: 100, frameHeight: 100 }},
    { key: 'protection', resource: require('./spells/protection.png'), type: 'spritesheet', data: { frameWidth: 100, frameHeight: 100 }},
    { key: 'flamewave', resource: require('./spells/flamewave.png'), type: 'spritesheet', data: { frameWidth: 100, frameHeight: 100 }},
    { key: 'walls', resource: require('./structures/walls-extruded.png'), type: 'spritesheet', data: { frameWidth: 16, frameHeight: 16, margin:1, spacing:2 }},
    { key: 'plants', resource: require('./plants.png'), type: 'spritesheet', data: { frameWidth: 16, frameHeight: 16 }},
    { key: 'materials', resource: require('./materials.png'), type: 'spritesheet', data: { frameWidth: 16, frameHeight: 16 }},
    { key: 'structures', resource: require('./structures/32x32-extruded.png'), type: 'spritesheet', data: { frameWidth: 32, frameHeight: 32, margin:1, spacing:2 }},
    { key: 'npcs', resource: require('./npcs-extruded.png'), type: 'spritesheet', data: { frameWidth: 16, frameHeight: 16, margin:1, spacing:2 }},
]

export const Icons = {
    inventory: require('./inventory.png'),
    BeefSmith: require('./portraits/beefsmith.png'),
    BeefEngineer: require('./portraits/beefengine.png'),
    BeefHerbalist: require('./portraits/beefherb.png'),
    BeefyMagus: require('./portraits/beefmagus.png'),
    BeefScout: require('./portraits/beefscout.png'),
    BeefSoldier: require('./portraits/beefsoldier.png'),
    SmithEngineer: require('./portraits/smithengine.png'),
    Crafter: require('./portraits/smithherb.png'),
    MagicSmith: require('./portraits/smithmage.png'),
    SmithScout: require('./portraits/smithscout.png'),
    SmithSoldier: require('./portraits/smithsoldier.png'),
    EngineCrafter: require('./portraits/herbengine.png'),
    EngineMage: require('./portraits/mageengine.png'),
    EngineScout: require('./portraits/scoutengine.png'),
    EngineSoldier: require('./portraits/enginesoldier.png'),
    HerbMage: require('./portraits/herbmage.png'),
    HerbScout: require('./portraits/herbscout.png'),
    HerbSoldier: require('./portraits/herbsoldier.png'),
    MagicScout: require('./portraits/magicscout.png'),
    MagicSoldier: require('./portraits/magicsoldier.png'),
    ScoutSoldier: require('./portraits/scoutsoldier.png')
}

export const BiomePlants = {
    grassland: [
        ResourceType.HOGSPINE,
        ResourceType.MAYPOLE,
        ResourceType.MARSHWORT,
        ResourceType.MAIDSHAND,
        ResourceType.ICECROWN,
        ResourceType.DESERTBLOOM,
        ResourceType.WATERPEA,
        ResourceType.SANDBERRY,
        ResourceType.CREEPER
    ]
}

export const BiomeResources = {
    grassland: [
        ResourceType.CRYSTAL,
        ResourceType.RED_CRYSTAL,
        ResourceType.GOLD,
        ResourceType.AMBER,
        ResourceType.OIL,
        ResourceType.WOOD,
        ResourceType.ORE,
    ]
}

export const BiomeDens = {
    grassland: [
        BuildingType.CAVE,
        // DenType.MERCENARY,
        // DenType.SNAKE_CULT,
        // DenType.EYE_CULT,
        // DenType.JADE,
        // DenType.SPHYNX,
        // DenType.CRYSTAL_CULT,
        // DenType.TREEHOUSE,
        // DenType.GRAVEYARD,
        // DenType.TRIBAL,
    ],
    dirt: [BuildingType.CAVE],
    lava: [],
    ice: [],
    desert: []
}

//Fun fact these are not zero indexed
export const PassableIndexes = []

//Idle is +24*1, walk1 is +24*2, attack is +24*3, walk2 is +24*4, die is 24*5
export const NpcIndexes = {
    [JobType.SCOUT]: 5*24,
    [JobType.LABORER]: 20*24,
    [JobType.SOLDIER]: 15*24,
    [JobType.ENGINEER]: 0
}

export const LandTileColors = {
    0x00ff00: {start: 0, width: 8, height: 18},
    0xbb7547: {start: 16, width: 8, height: 18}
}
export const FeatureTileColors = {
    0x14a02e: {start: 0, width: 7, height: 9},
    0xffffff: {start: 8, width: 7, height: 9},
    0x796755: {start: 480, width: 8, height: 5},
}

export const TileColors = {
    
}

export const InactiveTileIndexes = [19,22,27,30,35,38,43]

export const SpriteIndexes = {
    chest: 47,
    campfire: 48,
    mine: 49,
    grave: 50,
    portal: 37,
    masterPortal: 38,
    recipe: 12+16*63,
}

export const PortalSpriteIndexes = [53,54,55,56]