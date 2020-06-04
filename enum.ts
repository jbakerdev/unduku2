export const PLAYER_SPEED=100
export const CORPSE_DECAY=20000
export const FONT_DEFAULT = {
    fontFamily: 'Body', 
    fontSize: '8px',
    color:'white'
}
export enum UIReducerActions { 
    NEW_SESSION='newsesh',
    ADD_NODE='addn',
    UPDATE_PLAYER_CONTROL='uplc',
    UPDATE_NODE_CONTROL='uncl',
    UPDATE_RESOURCE='urcs',
    ADD_BUILDING='addb',
    SHOW_MODAL='show',
    HIDE_MODAL='hmdl',
    TAKE_JOB='tkjb',
    REPLACE_JOB='rplj',
    START_PLACE='srtpl',
    INIT_ENGINE='init_e',
    JOB_XP='jp',
    UPDATE_TIMER='utim',
    UPDATE_PLAYER='upl',
    REMOVE_JOB='rmvjob',
    UPDATE_BUILDING='udb',
    REMOVE_BUILDING='rmbld',
    ADD_CONSUMABLE='addcun',
    ADD_CONSUMABLE_ORDER='addord',
    CREEP_EXIT='creepout',
    UNLOCK_CRAFTABLE='unlock',
    ADD_GEAR='addge',
    ADD_GEAR_ORDER='addgearor',
    ADD_SPELL='aspell',
    REPLACE_SPELL='rspell',
    SELECT_PLAYER='splay'
}

export enum Modal {
    HELP='halp',
    LOSE='loose',
    INVENTORY='inv'
}

export enum GearType {
    ARMOR_L='larm',
    ARMOR_M='marm',
    ARMOR_H='harm'
}

export enum GearSlot {
    ARMOR='arm',
    WEAPON='wep',
    RING='rion',
    RELIC='reli'
}

export enum AbilityType {
    SHOOT_ARROW='arrow',
    HARVEST_CORPSE='corpse',
    HARVEST_RESOURCE='resource',
    HARVEST_PLANT='plant',
    REPAIR='repair',
    BUILD_WALL='wall',
    BUILD_TOWER='tower',
    REMOVE_DEFENSE='remdsvir',
    EXIT_TOWER='exeunt',
    DISSECT_CORPSE='dissect',
    ACTIVATE_PORTAL='aport',
    SEAL_RIFT='seal',
    DRAW_OUT='drawout',
    FLAME_WAVE='fire',
    PROTECTION='prot',
    AXE='axe',
    MINE='mine',
    CHARGE='charg',
    MELEE='melee'
}

export enum JobType {
    ENGINEER='Engineer',
    SCOUT='Scout',
    HERBALIST='Herbalist',
    LABORER='Laborer',
    BLACKSMITH='Blacksmith',
    SOLDIER='Soldier',
    MAGE='Mage',
    GUNNER='gunnr'
}

export enum ProjectileType {
    ARROW,
    FIRE
}

export enum SwingType {
    HEAVY,
    FAST,
    WINDUP,
    WIDE
}

export enum BuildingType {
    STOCKPILE='stonks',
    ARCHERY='archer',
    ARMORY='armo',
    ALCHEMIST='alch',
    BLACKSMITH='bsmith',
    FARM='farm',
    INN='inn',
    MAGE_TOWER='mages',
    WALL_H='wall',
    TOWER='towlr',
    ENGINEER_GUILD='engie',
    WALL_V='wallv',
    TOWER_WEAPON='twrwep',
    TOWER_WEAPON_DAMAGED='twrdesc',
    TOWER_DAMAGED='twordmged',
    WALL_V_DAMAGED='gunruinfjnbfg',
    WALL_H_DAMAGED='vntiuwejlk',
    GRAVEYARD=51,
    TRIBAL=7,
    CAVE=63,
    MERCENARY=55,
    SNAKE_CULT=65,
    EYE_CULT=61,
    JADE=67,
    SPHYNX=6,
    CRYSTAL_CULT=54,
    TREEHOUSE=15,
    Barracks= 12,
    Oasis= 17,
    OilActive= 18,
    OilInactive= 19,
    OilDeposit=20,
    RedCrystalActive= 21,
    RedCrystalInactive= 22,
    RedCrystalDeposit=23,
    CrystalActive= 26,
    CrystalInactive= 27,
    CrystalDeposit=28,
    AmberActive= 29,
    AmberInactive= 30,
    AmberDeposit=31,
    Windmill=32,
    Stables= 33,
    OreActive= 34,
    OreInactive= 35,
    OreDeposit=36,
    WoodActive= 37,
    WoodInactive= 38,
    WoodDeposit=39,
    GoldActive= 42,
    GoldInactive= 43,
    GoldDeposit=44,
    MysticForge= 60,
}

export enum ConsumableType {
    S_HEALING='sealing',
    M_HEALING='mealing',
    SWIFTNESS='jeeling',
    ARMOR='reeling',
    SWIMMING='peeling',
    FLIGHT='meeling',
    BERSERK='beeling',
    SIGHT='steeling',
    S_MAX_HEALTH='smaxin',
    M_MAX_HEALTH='relaxin',
    S_MAX_STAMINA='stamaxin',
    M_MAX_STAMINA='manaxin'
}

export enum ResourceCategory {
    mineral='mineral',
    food='food',
    parts='parts'
}

export enum CreepType {
    SPEARMAN=0,
    CROSSBOW=24,
    GRYPHON=48,
    SWORDMAN=3*24,
    PREIST=4*24,
    HORSEMAN=5*24,
    KNIGHT=6*24,
    DEVIL=4,
    FIREDEVIL=24+4,
    HOUND=48+4,
    MINOTAUR=3*24+4,
    BULLWHIP=4*24+4,
    FIREJINN=5*24+4,
    BULLDEMON=6*24+4,
    SKELETON=8,
    ZOMBIE=24+8,
    SPIDER=24*2+8,
    GHOST=24*3+8,
    VAMPIRE=24*4+8,
    SORCERESS=24*5+8,
    WISP=12,
    DWARF=24+12,
    SATYR=48+12,
    WOODARCHER=24*3+12,
    UNICORN=24*4+12,
    ELFWIZARD=24*5+12,
    GOBLIN=16,
    HARPY=24+16,
    WOLFRIDER=48+16,
    CENTAUR=24*3+16,
    DRUID=24*4+16,
    GOBLIN2=20,
    GARGOYLE=24+20,
    GOLEM=48+20,
    WATERSPRITE=24*3+20,
    DJINN=24*4+20,
    SIREN=24*5+20,
    JADEGOLEM=24*6+20
}

export enum ResourceType {
    WOOD=40,
    GOLD=41,
    ORE=42,
    OIL=43,
    AMBER=44,
    CRYSTAL=45,
    RED_CRYSTAL=46,
    HOGSPINE=0,
    MAYPOLE=2,
    MARSHWORT=4,
    MAIDSHAND=6,
    ICECROWN=8,
    DESERTBLOOM=10,
    WATERPEA=12,
    SANDBERRY=14,
    CREEPER=16,
    DEMON_HIDE=12+16*13,
    FIRE_ESSENCE=12+16*73,
    LORE=11+62*16
}

export const AbilityKeys = ['E','Q','R','F','Z','X','T','G']
export const ConsumableKeys = ['ONE','TWO','THREE','FOUR','FIVE','SIX']
export const SpellKeys = ['C','V']

export const Ability = {
    [AbilityType.HARVEST_RESOURCE]:{
        description: 'Collect resources',
        base64: require('./assets/icon/harvest.png'),
        type: AbilityType.HARVEST_RESOURCE,
        defaultState: {
            cooldown: 0,
            cooldownRate: 40,
            channel: 0,
            channelRate: 25
        }
    },
    [AbilityType.DISSECT_CORPSE]:{
        description: 'Dissect corpse',
        base64: require('./assets/icon/corpse.png'),
        type: AbilityType.DISSECT_CORPSE,
        defaultState: {
            cooldown: 0,
            cooldownRate: 40,
            channel: 0,
            channelRate: 25
        }
    },
    [AbilityType.REPAIR]:{
        description: 'Repair a collector or structure',
        base64: require('./assets/icon/repair.png'),
        type: AbilityType.REPAIR,
        defaultState: {
            cooldown: 0,
            cooldownRate: 40,
            channel: 0,
            channelRate: 25
        }
    },
    [AbilityType.HARVEST_CORPSE]:{
        description: 'Harvest materials from a corpse',
        base64: require('./assets/icon/corpse.png'),
        type: AbilityType.HARVEST_CORPSE,
        defaultState: {
            cooldown: 0,
            cooldownRate: 40,
            channel: 0,
            channelRate: 25
        }
    },
    [AbilityType.HARVEST_PLANT]:{
        description: 'Harvest plants',
        base64: require('./assets/icon/plant.png'),
        type: AbilityType.HARVEST_PLANT,
        defaultState: {
            cooldown: 0,
            cooldownRate: 40,
            channel: 0,
            channelRate: 25
        }
    },
    [AbilityType.SHOOT_ARROW]:{
        description: 'Shoot',
        base64: require('./assets/icon/arrow.png'),
        type: AbilityType.SHOOT_ARROW,
        defaultState: {
            cooldown: 0,
            cooldownRate: 40,
            channel: 0,
            channelRate: 25
        }
    },
    [AbilityType.BUILD_TOWER]:{
        description: 'Build Tower',
        base64: require('./assets/icon/tower.png'),
        type: AbilityType.BUILD_TOWER,
        defaultState: {
            cooldown: 0,
            cooldownRate: 40,
            channel: 0,
            channelRate: 25
        }
    },
    [AbilityType.BUILD_WALL]:{
        description: 'Build Wall',
        base64: require('./assets/icon/wall.png'),
        type: AbilityType.BUILD_WALL,
        defaultState: {
            cooldown: 0,
            cooldownRate: 40,
            channel: 0,
            channelRate: 25
        }
    },
    [AbilityType.REMOVE_DEFENSE]:{
        description: 'Remove Defenses',
        base64: require('./assets/icon/no-wall.png'),
        type: AbilityType.REMOVE_DEFENSE,
        defaultState: {
            cooldown: 0,
            cooldownRate: 40,
            channel: 0,
            channelRate: 25
        }
    },
    [AbilityType.EXIT_TOWER]:{
        description: 'Leave Tower',
        base64: require('./assets/icon/no-wall.png'),
        type: AbilityType.EXIT_TOWER,
        defaultState: {
            cooldown: 0,
            cooldownRate: 40,
            channel: 0,
            channelRate: 25
        }
    },
    [AbilityType.MINE]: {
        description: 'Lay Mine',
        base64: require('./assets/icon/mine.png'),
        type: AbilityType.MINE,
        defaultState: {
            cooldown: 0,
            cooldownRate: 40,
            channel: 0,
            channelRate: 25
        }
    },
    [AbilityType.CHARGE]: {
        description: 'Charge and Taunt enemies',
        base64: require('./assets/icon/charge.png'),
        type: AbilityType.CHARGE,
        defaultState: {
            cooldown: 0,
            cooldownRate: 40,
            channel: 0,
            channelRate: 25
        }
    },
    [AbilityType.MELEE]: {
        description: 'Melee Attack',
        base64: require('./assets/icon/melee.png'),
        type: AbilityType.MELEE,
        defaultState: {
            cooldown: 0,
            cooldownRate: 40,
            channel: 0,
            channelRate: 25
        }
    }
}

export const Spells = {
    [AbilityType.ACTIVATE_PORTAL]:{
        description: 'Activate portal',
        base64: require('./assets/icon/portal.png'),
        type: AbilityType.ACTIVATE_PORTAL,
        loreCost: 2,
        defaultState: {
            cooldown: 0,
            cooldownRate: 40,
            channel: 0,
            channelRate: 25
        }
    },
    [AbilityType.DRAW_OUT]:{
        description: 'Draw out',
        base64: require('./assets/icon/draw.png'),
        type: AbilityType.DRAW_OUT,
        loreCost: 3,
        defaultState: {
            cooldown: 0,
            cooldownRate: 40,
            channel: 0,
            channelRate: 25
        }
    },
    [AbilityType.FLAME_WAVE]:{
        description: 'Flame wave',
        base64: require('./assets/icon/flame.png'),
        type: AbilityType.FLAME_WAVE,
        loreCost: 1,
        defaultState: {
            cooldown: 0,
            cooldownRate: 40,
            channel: 0,
            channelRate: 25
        }
    },
    [AbilityType.PROTECTION]:{
        description: 'Protection',
        base64: require('./assets/icon/protec.png'),
        type: AbilityType.PROTECTION,
        loreCost: 2,
        defaultState: {
            cooldown: 0,
            cooldownRate: 40,
            channel: 0,
            channelRate: 25
        }
    },
    [AbilityType.SEAL_RIFT]:{
        description: 'Seal',
        base64: require('./assets/icon/seal.png'),
        type: AbilityType.SEAL_RIFT,
        loreCost: 1,
        defaultState: {
            cooldown: 0,
            cooldownRate: 40,
            channel: 0,
            channelRate: 25
        }
    }
}

export const Dens = {
    [BuildingType.CAVE]: {
        creepRange: 100,
        creepLimit: 3,
        creepTypes: [CreepType.GOBLIN, CreepType.GOBLIN2],
        regenerateInterval: 2000
    }
}

export const PortalCreepLists = [
    [CreepType.BULLDEMON, CreepType.BULLWHIP, CreepType.DEVIL, CreepType.FIREDEVIL, CreepType.FIREJINN],
    [CreepType.GARGOYLE, CreepType.GOLEM, CreepType.JADEGOLEM, CreepType.DWARF],
    [CreepType.DRUID, CreepType.SIREN, CreepType.WATERSPRITE, CreepType.UNICORN, CreepType.WISP],
    [CreepType.SKELETON, CreepType.ZOMBIE, CreepType.GHOST, CreepType.SORCERESS]
]