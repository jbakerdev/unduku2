
import { GameObjects, Tilemaps, Physics, Geom } from 'phaser';
import { compute, _getCircle } from './Fov';
import { ResourceType, JobType, Ability, AbilityType, BuildingType, GearType, GearSlot, CORPSE_DECAY } from '../../enum';
import * as v4 from 'uuid'
import AStar from './AStar';
import { Creeps } from '../../assets/data/Creeps'
import { Resources } from '../../assets/data/Resources'
import { BuildingSpriteIndexes } from '../../assets/data/Buildings';
import WorldScene from '../canvas/WorldScene';
import { Icons } from '../../assets/Assets';
import { onUpdatePlayer, onUpdateBuilding, onRemoveBuilding } from '../uiManager/Thunks';
import Creep from '../canvas/Creep';
import Portal from '../canvas/Portal';
import BuildingSprite from '../canvas/BuildingSprite';
import { store } from '../../App';
import Player from '../canvas/PersonSprite';
import Soldier from './jobs/Soldier';

export const getResourceIndexOfCollector = (tileIndex:number) => {
    switch(tileIndex){
        case BuildingSpriteIndexes[BuildingType.AmberInactive]: return Resources[ResourceType.AMBER].index
        case BuildingSpriteIndexes[BuildingType.CrystalInactive]: return Resources[ResourceType.CRYSTAL].index
        case BuildingSpriteIndexes[BuildingType.GoldInactive]: return Resources[ResourceType.GOLD].index
        case BuildingSpriteIndexes[BuildingType.OilInactive]: return Resources[ResourceType.OIL].index
        case BuildingSpriteIndexes[BuildingType.OreInactive]: return Resources[ResourceType.ORE].index
        case BuildingSpriteIndexes[BuildingType.RedCrystalInactive]: return Resources[ResourceType.RED_CRYSTAL].index
        case BuildingSpriteIndexes[BuildingType.WoodInactive]: return Resources[ResourceType.WOOD].index
    }
}

export const getCollectorResourceTypeFromIndex = (spriteIndex:number) => {
    switch(spriteIndex){
        case BuildingSpriteIndexes[BuildingType.AmberInactive]: return ResourceType.AMBER
        case BuildingSpriteIndexes[BuildingType.CrystalInactive]: return ResourceType.CRYSTAL
        case BuildingSpriteIndexes[BuildingType.GoldInactive]: return ResourceType.GOLD
        case BuildingSpriteIndexes[BuildingType.OilInactive]: return ResourceType.OIL
        case BuildingSpriteIndexes[BuildingType.OreInactive]: return ResourceType.ORE
        case BuildingSpriteIndexes[BuildingType.RedCrystalInactive]: return ResourceType.RED_CRYSTAL
        case BuildingSpriteIndexes[BuildingType.WoodInactive]: return ResourceType.WOOD
    }
}

export const getBuildingTypeFromIndex = (spriteIndex:number) => {
    return Object.keys(BuildingSpriteIndexes).find(key=>+key===spriteIndex) as BuildingType
}

export const findValue = (data:Phaser.Data.DataManager, searchKey:string) => {
    let val
    Object.keys(data.values).forEach(key=>{if(data.values[key].name===searchKey) val = data.values[key].value })
    return val
}

export const getDefaultParty = () => {
    return new Array(4).fill({}).map(slot=>{
        return {
            id: v4(),
            controlledById: '',
            jobs: {
                [JobType.LABORER]: { 
                    level: 1, 
                    xp: 0
                }
            },
            hp:6,
            maxHp:6,
            stamina:3,
            sight:3,
            damage: 1,
            range: 50,
            abilities: [],
            spells: [],
            consumables: [],
            gear: {
                [GearSlot.ARMOR]: null,
                [GearSlot.WEAPON]: null,
                [GearSlot.RELIC]: null,
                [GearSlot.RING]: null,
            }
        }
    })
}

export const checkBuildingIntersection = (building:Physics.Arcade.Sprite, collisionLayers:Array<Tilemaps.DynamicTilemapLayer>, buildingSprites:Array<GameObjects.Sprite>) => {
    let brect = new Geom.Rectangle(building.getTopLeft().x, building.getTopLeft().y, building.displayWidth, building.displayHeight)
    let collided = collisionLayers.find(layer=>layer.getTilesWithinShape(brect).find(t=>t.index !== -1))
    if(!collided){
        let result= buildingSprites.find(b=>{
            let erect = new Geom.Rectangle(b.getTopLeft().x, b.getTopLeft().y, b.displayWidth, b.displayHeight)
            return Phaser.Geom.Rectangle.Overlaps(erect, brect)
        })
        return !result
    }
    else return false
}

export const getPathableRiftTile = (minLength:number, tileData:Array<Array<TileInfo>>, map:Tilemaps.Tilemap, theRift:GameObjects.Sprite, getAllCollidingTilesAt:Function) => {
    let tile, path
    while(!path || path[0].isPartial || path.length < minLength){
        tile = getRandomExisting(map, getAllCollidingTilesAt)
        path = new AStar(tile.x, tile.y, (tileX:number, tileY:number)=>{ return tileData[tileX] && tileData[tileX][tileY] && !tileData[tileX][tileY].collides }).compute(map.worldToTileX(theRift.x), map.worldToTileY(theRift.y))
    }
    return tile
}

export const isTilePathableToRift = (minLength:number, tileData:Array<Array<TileInfo>>, map:Tilemaps.Tilemap, theRift:GameObjects.Sprite, tile:Tilemaps.Tile) => {
    let path = new AStar(tile.x, tile.y, (tileX:number, tileY:number)=>{ return tileData[tileX] && tileData[tileX][tileY] && !tileData[tileX][tileY].collides }).compute(map.worldToTileX(theRift.x), map.worldToTileY(theRift.y))
    return path && path.length >= minLength && !path[0].isPartial
}

export const getRandomExisting = (map:Tilemaps.Tilemap, getAllCollidingTilesAt:Function) => {
    let tile
    while(!tile || (tile && tile.index === -1) || (tile && getAllCollidingTilesAt(tile.x, tile.y))){
        tile = map.getLayer('land').tilemapLayer.getTileAt(Phaser.Math.Between(0,map.width), Phaser.Math.Between(0,map.height))
    }
    return tile
}

export const getActiveAbilities = (player:PlayerState) => {
    let activeJobs = Object.keys(player.jobs).filter(key=>player.jobs[key])
    let abilities = []
    activeJobs.forEach(j=>{
        abilities = abilities.concat(player.jobs[j].abilities)
    })
    return abilities as Array<Ability>
}

export const getLootedMaterialType = (creepType:CreepType, jobLevel:number) => {
    let table = Creeps[creepType].loot.filter(type=>Resources[type].requiredLevel <= jobLevel)
    return table[Phaser.Math.Between(0,table.length-1)]
}

export const hasMaterials = (formula:Craftable, resources:Resources) => {
    return true
}

export const getGearSlotFromType = (type:GearType) => {
    switch(type){
        case GearType.ARMOR_L: return GearSlot.ARMOR
    }
}

export const generateAnimations = (scene:WorldScene) => {
    scene.anims.create({
        key: AbilityType.FLAME_WAVE,
        frames: scene.anims.generateFrameNumbers('flamewave', { start: 0, end: 30 }),
        frameRate: 8,
        hideOnComplete: true
    })
    scene.anims.create({
        key: AbilityType.PROTECTION,
        frames: scene.anims.generateFrameNumbers('protection', { start: 0, end: 8 }),
        frameRate: 8,
        hideOnComplete: true
    })
    scene.anims.create({
        key: AbilityType.SEAL_RIFT,
        frames: scene.anims.generateFrameNumbers('seal', { start: 0, end: 8 }),
        frameRate: 8,
        hideOnComplete: true
    })
    scene.anims.create({
        key: AbilityType.ACTIVATE_PORTAL,
        frames: scene.anims.generateFrameNumbers('seal', { start: 0, end: 8 }),
        frameRate: 8,
        hideOnComplete: true
    })
    scene.anims.create({
        key: 'explosion',
        frames: scene.anims.generateFrameNumbers('explosion', { start: 0, end: 7 }),
        frameRate: 8,
        hideOnComplete: true
    })
    scene.anims.create({
        key: 'creature_hit',
        frames: scene.anims.generateFrameNumbers('creature_hit', { start: 0, end: 8 }),
        frameRate: 8,
        hideOnComplete: true
    })
    scene.anims.create({
        key: 'warp',
        frames: scene.anims.generateFrameNumbers('warp', { start: 0, end: 8 }),
        frameRate: 8,
        hideOnComplete: true
    })
}

export const getPortrait = (jobs:Jobs) => {
    if(jobs.Laborer){
        if(jobs.Blacksmith) return Icons.BeefSmith
        if(jobs.Engineer) return Icons.BeefEngineer
        if(jobs.Herbalist) return Icons.BeefHerbalist
        if(jobs.Mage) return Icons.BeefyMagus
        if(jobs.Scout) return Icons.BeefScout
        if(jobs.Soldier) return Icons.BeefSoldier
        return Icons.BeefSmith
    }
    if(jobs.Blacksmith){
        if(jobs.Engineer) return Icons.SmithEngineer
        if(jobs.Herbalist) return Icons.Crafter
        if(jobs.Mage) return Icons.MagicSmith
        if(jobs.Scout) return Icons.SmithScout
        if(jobs.Soldier) return Icons.SmithSoldier
        return Icons.BeefSmith
    }
    if(jobs.Engineer){
        if(jobs.Herbalist) return Icons.EngineCrafter
        if(jobs.Mage) return Icons.EngineMage
        if(jobs.Scout) return Icons.EngineScout
        if(jobs.Soldier) return Icons.EngineSoldier
        return Icons.SmithEngineer
    }
    if(jobs.Herbalist){
        if(jobs.Mage) return Icons.HerbMage
        if(jobs.Scout) return Icons.HerbScout
        if(jobs.Soldier) return Icons.HerbSoldier
        return Icons.HerbScout
    }
    if(jobs.Mage){
        if(jobs.Scout) return Icons.MagicScout
        if(jobs.Soldier) return Icons.MagicSoldier
        return Icons.HerbMage
    }
    if(jobs.Scout){
        if(jobs.Soldier) return Icons.ScoutSoldier
        return Icons.BeefSoldier
    }
}

export const startAbilityCooldown = (p:PlayerState, a:AbilityState) =>
    onUpdatePlayer({...p, abilities: p.abilities.map(ab=>ab.type === a.type ? {...a, cooldown: 100}:ab)})
      