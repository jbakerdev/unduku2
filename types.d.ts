declare enum UIReducerActions { 
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

declare enum CreepType {
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

declare enum JobType {
    ENGINEER='Engineer',
    SCOUT='Scout',
    HERBALIST='Herbalist',
    LABORER='Laborer',
    BLACKSMITH='Blacksmith',
    SOLDIER='Soldier',
    MAGE='Mage',
    GUNNER='gunnr'
}

declare enum ProjectileType {
    ARROW,
    FIRE
}

declare enum ResourceType {
    CRYSTAL=40,
    RED_CRYSTAL=41,
    GOLD=42,
    AMBER=43,
    OIL=44,
    WOOD=45,
    ORE=46,
    HOGSPINE=0,
    MAYPOLE=1,
    MARSHWORT=2,
    MAIDSHAND=3,
    ICECROWN=4,
    DESERTBLOOM=5,
    WATERPEA=6,
    SANDBERRY=7,
    CREEPER=8,
    DEMON_HIDE=12+16*13,
    FIRE_ESSENCE=12+16*73,
    LORE=11+62*16
}

declare enum BuildingType {
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

declare enum ConsumableType {
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

declare enum GearType {
    ARMOR_L='larm',
    ARMOR_M='marm',
    ARMOR_H='harm'
}

declare enum GearSlot {
    ARMOR='arm',
    WEAPON='wep',
    RING='rion',
    RELIC='reli'
}

declare enum AbilityType {
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

declare enum Modal {
    HELP='halp',
    LOSE='loose',
    INVENTORY='inv'
}

interface Asset {
    key: string
    type: string
    resource: any
    data?: any
}

interface Tuple {
    x: number
    y: number
}

interface TileInfo {
    x:number
    y:number
    collides: boolean
    transparent: boolean
}

interface Craftable {
    type: ConsumableType|GearType,
    name: string,
    base64: string,
    requiredLevel: number,
    unlocked: boolean
    resources: Array<{type: ResourceType, amount:number}>
}

interface PlayerState {
    id:string
    controlledById:string
    jobs: Jobs
    hp:number
    maxHp:number
    stamina:number
    sight:number
    damage: number
    range: number
    abilities: Array<AbilityState>
    consumables: Array<ConsumableType>
    spells: Array<AbilityState>
    gear: Gear
}

interface AbilityState {
    type: AbilityType
    cooldown: number
    cooldownRate:number
    channel:number
    channelRate:number
} 

interface JobState {
    level: number
    xp:number
}

interface Ability {
    description: string
    base64:string
    type: AbilityType
    defaultState: {
        cooldown?:number
        cooldownRate?:number
        channel?:number
        channelRate?:number
    }
}

interface ResourceNode {
    id:string
    type: ResourceType
    isControlled: boolean
    rate: number
}

declare enum ResourceCategory {
    mineral='mineral',
    food='food',
    parts='parts'
}

interface Resources {
    [ResourceCategory.mineral]: {
        [ResourceType.WOOD]:number
        [ResourceType.RED_CRYSTAL]:number
        [ResourceType.ORE]:number
        [ResourceType.OIL]:number
        [ResourceType.GOLD]:number
        [ResourceType.CRYSTAL]:number
        [ResourceType.AMBER]:number
    }
    [ResourceCategory.food]: {
        [ResourceType.DESERTBLOOM]:number
        [ResourceType.CREEPER]:number
        [ResourceType.HOGSPINE]:number
        [ResourceType.ICECROWN]:number
        [ResourceType.MAIDSHAND]:number
        [ResourceType.MARSHWORT]:number
        [ResourceType.MAYPOLE]:number
        [ResourceType.SANDBERRY]:number
        [ResourceType.WATERPEA]:number
    }
    [ResourceCategory.parts]: {
        [ResourceType.FIRE_ESSENCE]:number
        [ResourceType.DEMON_HIDE]:number
        [ResourceType.LORE]:number
    }
}

interface Jobs {
    [JobType.BLACKSMITH]?: JobState
    [JobType.ENGINEER]?: JobState
    [JobType.HERBALIST]?: JobState
    [JobType.LABORER]?: JobState
    [JobType.MAGE]?: JobState
    [JobType.SCOUT]?: JobState
    [JobType.SOLDIER]?: JobState
}

interface Gear {
    [GearSlot.ARMOR]: GearType
    [GearSlot.WEAPON]: GearType
    [GearSlot.RELIC]: GearType
    [GearSlot.RING]: GearType
}

interface BuildingState { 
    id:string
    type: BuildingType
    x: number,
    y: number,
    hp: number,
    researchType: string,
    researchProgress: number,
    preparedConsumables: Array<{time: number, type: ConsumableType}>,
    preparedGear: Array<{time: number, type: GearType}>
}

interface RState {
    modal: BuildingType
    engine: Phaser.Scene
    engineEvent: UIReducerActions
    resourceNodes: Array<ResourceNode>
    party: Array<PlayerState>
    buildings: Array<BuildingState>
    myId: string
    resources: Resources
    waveTimer: number
    creepsOut: number
}