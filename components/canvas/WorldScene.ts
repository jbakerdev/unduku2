import { Scene, Tilemaps, Physics, GameObjects, Geom, Tweens } from "phaser";
import { store } from "../../App";
import { defaults, NpcIndexes, InactiveTileIndexes, BiomePlants, BiomeDens, SpriteIndexes, PortalSpriteIndexes, Icons } from '../../assets/Assets'
import { PLAYER_SPEED, JobType, BuildingType, UIReducerActions, PortalCreepLists, AbilityKeys, AbilityType, ResourceCategory, ConsumableKeys, ConsumableType, ResourceType, SpellKeys, ProjectileType, Ability, SwingType } from "../../enum";
import { getResourceIndexOfCollector, findValue, getCollectorResourceTypeFromIndex, checkBuildingIntersection, getPathableRiftTile, isTilePathableToRift, getLootedMaterialType, getBuildingTypeFromIndex, generateAnimations, startAbilityCooldown } from "../helpers/Util";
import { onAddResourceNode, onUpdatePlayerControl, onControlNode, onAddResource, onPlacedBuilding, onShowModal, onInitEngine, onUpdateJobXp, onMatchTick, onUpdatePlayer, onTakeJob, onRemoveJob, onUpdateBuilding, onRemoveBuilding, onUnlockRecipe } from "../uiManager/Thunks";
import { _getCircle } from "../helpers/Fov";
import { floatText, floatSprite, generateAnimationsForUnit, moveTowardXY, getWallIndexForNeighbors } from "../helpers/Canvas";
import PlantNode from "./PlantNode";
import ResourceNode from "./ResourceNode";
import AStar from "../helpers/AStar";
import MonsterDen from "./MonsterDen";
import BuildingSprite from './BuildingSprite'
import Portal from "./Portal"
import Creep, { creepHitPlayer, creepHitBuilding, destroyCreep } from "./Creep";
import MiniMap from "./MiniMap";
import Player from "./PersonSprite";
import Engineer from "../helpers/jobs/Engineer";
import Magus from "../helpers/jobs/Magus";
import Scout from "../helpers/jobs/Scout";
import Soldier from "../helpers/jobs/Soldier";
import PersonSprite from "./PersonSprite";

export default class WorldScene extends Scene {

    unsubscribeRedux: Function
    map:Tilemaps.Tilemap
    focusedItem: Physics.Arcade.Sprite
    buildingSprites: Array<BuildingSprite>
    peopleSprites: Array<PersonSprite>
    selectIcon: GameObjects.Image
    collidingLayers: Array<Tilemaps.DynamicTilemapLayer>
    tileData: Array<Array<TileInfo>>
    projectiles: GameObjects.Group
    creepProjectiles: GameObjects.Group
    effects: GameObjects.Group
    creeps: Array<Creep>
    corpses: Array<Creep>
    miniMap: MiniMap
    townCenter: BuildingSprite
    keys:object

    constructor(config){
        super(config)
        this.unsubscribeRedux = store.subscribe(this.onReduxUpdate)
        this.collidingLayers = []
        this.buildingSprites = []
        this.tileData = [[]]
        this.creeps = []
        this.corpses = []
    }

    preload = () =>
    {
        defaults.forEach(asset=>{
            (this.load[asset.type] as any)(asset.key, asset.resource, asset.data)
        })
        console.log('assets were loaded.')
    }
    
    onReduxUpdate = () => {
        const uiState = store.getState()
        let engineEvent = uiState.engineEvent
        let player = uiState.party.find(p=>p.controlledById === uiState.myId)
        if(engineEvent)
            switch(engineEvent){
                case UIReducerActions.TAKE_JOB:
                case UIReducerActions.REPLACE_JOB:
                case UIReducerActions.REMOVE_JOB:
                    player = uiState.party.find(p=>p.controlledById === uiState.myId)
                    this.updateUIForPlayer(player)
                    break
                case UIReducerActions.ADD_CONSUMABLE:
                    ConsumableKeys.forEach(key=>this.input.keyboard.off('keydown-'+key))
                    player.consumables.forEach((type:ConsumableType,i)=>{
                        this.input.keyboard.on('keydown-'+ConsumableKeys[i], this.getDelegateForConsumable(type))
                    })
                    break
                case UIReducerActions.ADD_SPELL:
                case UIReducerActions.REPLACE_SPELL:
                    this.updateUIForPlayer(uiState.party.find(p=>p.controlledById === uiState.myId))
                    break
                
            }
    }

    create = () =>
    {
        generateAnimations(this)

        this.effects = this.add.group()
        this.projectiles = this.physics.add.group()
        this.creepProjectiles = this.physics.add.group()
        this.physics.add.overlap(this.creepProjectiles, this.peopleSprites, (creep:Creep,player:Player)=>creepHitPlayer(this, creep, player))
        this.physics.add.collider(this.creeps, this.peopleSprites, (creep:Creep,player:Player)=>creepHitPlayer(this, creep, player))
        this.physics.add.collider(this.creeps, this.buildingSprites, (creep:Creep, building:BuildingSprite)=>creepHitBuilding(this, creep, building))
        this.physics.add.collider(this.creeps, this.creeps)
        this.physics.add.collider(this.creeps, this.collidingLayers)
        
        //Render base terrain
        this.prepareMap()
        this.miniMap = new MiniMap(this)
        this.placeDens()
        
        this.cameras.main.setZoom(2)

        //this.spawnPlayerCharacter(this.theRift.x+(i+1*16), this.theRift.y+(i*16), player.id)
        //this.onSetPlayerControl(state.party[0].id)

        this.keys = this.input.keyboard.addKeys('W,S,A,D,SPACE')

        this.input.on('pointerover', (event, gameObjects) => {
            if(gameObjects[0]){
                this.focusedItem = gameObjects[0]
            } 
        })

        this.input.on('pointerout', (event, gameObjects) => {
            this.focusedItem = null
            this.selectIcon && this.selectIcon.setVisible(false)
        })

        onInitEngine(this)
    }

    placeDens = () => {
        this.map.createFromObjects('objects', 'lair', { key: 'structures' }).forEach(sprite=>{
            let dens = BiomeDens[findValue(sprite.data, 'biome')]
            let index = dens[Phaser.Math.Between(0, dens.length-1)]
            this.modifyBlockingBuilding(new MonsterDen(this, sprite.x, sprite.y, index), true, false)
            sprite.destroy()
        })
    }

    modifyBlockingBuilding = (sprite:BuildingSprite, large:boolean, destroy:boolean) => {
        if(!destroy){
            this.buildingSprites.push(sprite)
        } 
        let origin = {x:this.map.worldToTileX(sprite.x)-1, y:this.map.worldToTileY(sprite.y)-1}
        let tileCoords = [origin]
        if(large){
            tileCoords.push({x: origin.x+1, y:origin.y})
            tileCoords.push({x: origin.x+1, y:origin.y-1})
            tileCoords.push({x: origin.x, y:origin.y-1})
        }
        tileCoords.forEach(coord=>{
            if(this.tileData[coord.x] && this.tileData[coord.x][coord.y]) 
                this.tileData[coord.x][coord.y].collides = !destroy
        })
        if(destroy){
            let i = this.buildingSprites.findIndex(b=>b.id === sprite.id)
            this.buildingSprites.splice(i,1)
            sprite.destroy()
            onRemoveBuilding(sprite.id)
        }
    }

    prepareMap = () => {
        this.map = this.make.tilemap({ key: 'map'})
        let terrain = this.map.addTilesetImage('terrain', 'terrain', 16,16,1,2)
        let features = this.map.addTilesetImage('obstacles', 'obstacles',16,16,1,2)
        let roads = this.map.addTilesetImage('roads')
        
        let water = this.map.createDynamicLayer('water', [terrain]).setCollisionByExclusion([-1])
        this.collidingLayers.push(water)
        this.map.createDynamicLayer('land', [terrain])
        let rivers = this.map.createDynamicLayer('rivers', [terrain]).setCollisionByExclusion([-1])
        this.collidingLayers.push(rivers)
        this.collidingLayers.push(this.map.createDynamicLayer('features2', [features]).setCollisionByExclusion([-1]))
        
        this.collidingLayers.push(this.map.createDynamicLayer('features', [features]).setCollisionByExclusion([-1]))
        
        this.tileData = [[]]
        this.collidingLayers.forEach(layer=>{
            layer.forEachTile(tile=>{
                if(!this.tileData[tile.x]) this.tileData[tile.x] = []
                if(this.tileData[tile.x][tile.y] && this.tileData[tile.x][tile.y].collides) return
                else {
                    this.tileData[tile.x][tile.y]={
                        x:tile.x, y:tile.y,
                        collides: tile.collides,
                        transparent: true
                    }
                }
            })
        })

        this.townCenter = this.map.createFromObjects('object', 'town', { key: 'buildings', frame: SpriteIndexes.townCenter })[0]
        this.add.existing(this.townCenter);
        // let stocks = new BuildingSprite(this, this.theRift.x+48,this.theRift.y+16, BuildingType.STOCKPILE, false)
        // this.modifyBlockingBuilding(stocks, true, false)
        // stocks.on('pointerdown', ()=>onShowModal(stocks.typeOfBuilding))
        
    }

    onActivateAvatar = () => {
        this.cameras.main.startFollow(this.controlledSprite)
        this.input.keyboard.off('keyup')
        this.input.keyboard.on('keyup', ()=>{
            this.controlledSprite.anims.chain(this.controlledSprite.animationBaseIndex+'_idle')
        })
        onUpdatePlayerControl(playerId)
        let state = store.getState()
        let player = state.party.find(p=>p.controlledById === state.myId)
        this.updateUIForPlayer(player)
    }

    updateUIForPlayer = (player:PlayerState) => {
        AbilityKeys.forEach(key=>this.input.keyboard.off('keydown-'+key))
        SpellKeys.forEach(key=>this.input.keyboard.off('keydown-'+key))
        this.input.keyboard.off('keydown-SHIFT')
        player.abilities = []
        //TODO how to choose job appearance?
        //celebratory particles TODO
        player.maxHp = 3
        Object.keys(player.jobs).forEach(j=>{
            switch(j){
                case JobType.LABORER:
                    player.abilities.push({type: AbilityType.HARVEST_RESOURCE, ...Ability[AbilityType.HARVEST_RESOURCE].defaultState})
                    player.maxHp = 6
                    break
                case JobType.HERBALIST:
                    player.abilities.push({type: AbilityType.HARVEST_PLANT, ...Ability[AbilityType.HARVEST_PLANT].defaultState})
                    break
                case JobType.SCOUT:
                    this.controlledSprite.setFrame(NpcIndexes[JobType.SCOUT])
                    generateAnimationsForUnit(this, NpcIndexes[JobType.SCOUT])
                     this.controlledSprite.animationBaseIndex = NpcIndexes[JobType.SCOUT]
                    player.abilities.push({type: AbilityType.SHOOT_ARROW, ...Ability[AbilityType.SHOOT_ARROW].defaultState})
                    player.abilities.push({type: AbilityType.HARVEST_CORPSE, ...Ability[AbilityType.HARVEST_CORPSE].defaultState})
                    this.controlledSprite.anims.play(NpcIndexes[JobType.SCOUT]+'_idle')
                    break
                case JobType.ENGINEER:
                    this.controlledSprite.setFrame(NpcIndexes[JobType.ENGINEER])
                    generateAnimationsForUnit(this, NpcIndexes[JobType.ENGINEER])
                    this.controlledSprite.anims.play(NpcIndexes[JobType.ENGINEER]+'_idle')
                    this.controlledSprite.animationBaseIndex = NpcIndexes[JobType.ENGINEER]
                    this.input.keyboard.on('keydown-SHIFT', ()=>this.startPlacingBuilding(this.placingBuilding.typeOfBuilding === BuildingType.WALL_V ? BuildingType.WALL_H : BuildingType.WALL_V, true))
                    player.abilities.push({type: AbilityType.MINE, ...Ability[AbilityType.MINE].defaultState})
                    player.abilities.push({type: AbilityType.REPAIR, ...Ability[AbilityType.REPAIR].defaultState})
                    player.abilities.push({type: AbilityType.BUILD_WALL, ...Ability[AbilityType.BUILD_WALL].defaultState})
                    player.abilities.push({type: AbilityType.BUILD_TOWER, ...Ability[AbilityType.BUILD_TOWER].defaultState})
                    player.abilities.push({type: AbilityType.REMOVE_DEFENSE, ...Ability[AbilityType.REMOVE_DEFENSE].defaultState})
                    break
                case JobType.GUNNER:
                    player.abilities.push({type: AbilityType.EXIT_TOWER, ...Ability[AbilityType.EXIT_TOWER].defaultState})
                    player.abilities.push({type: AbilityType.SHOOT_ARROW, ...Ability[AbilityType.SHOOT_ARROW].defaultState})
                    break
                case JobType.MAGE:
                    player.abilities.push({type: AbilityType.DISSECT_CORPSE, ...Ability[AbilityType.DISSECT_CORPSE].defaultState})
                    player.maxHp = 2
                    break
                case JobType.SOLDIER:
                    player.abilities.push({type: AbilityType.CHARGE, ...Ability[AbilityType.CHARGE].defaultState})
                    player.abilities.push({type: AbilityType.MELEE, ...Ability[AbilityType.MELEE].defaultState})
                    break
            }
        })
        player.spells.forEach((j,i)=>{
            this.input.keyboard.on('keydown-'+SpellKeys[i], this.getDelegateForAbility(j))
        })
        player.abilities.forEach((ability,i)=>{
            this.input.keyboard.on('keydown-'+AbilityKeys[i], this.getDelegateForAbility(ability))
        })
        if(player.hp > player.maxHp) player.hp = player.maxHp
        onUpdatePlayer(player)
    }

    getDelegateForAbility = (ability:AbilityState) => {
        return () => {
            let p = store.getState().party.find(p=>p.id===this.controlledSprite.id)
            let a = p.abilities.find(abil=>abil.type===ability.type)
            let s = p.spells.find(a=>a.type===ability.type)
            if(a && a.cooldown === 0){
                switch(ability.type){
                    case AbilityType.HARVEST_RESOURCE:this.tryPickup()
                    break
                    case AbilityType.HARVEST_CORPSE: this.tryPickupCorpse()
                    break
                    case AbilityType.DISSECT_CORPSE: Magus.playerDissectCorpse(this)
                    break
                    case AbilityType.HARVEST_PLANT: this.tryPickup()
                    break
                    case AbilityType.SHOOT_ARROW: 
                    startAbilityCooldown(p,a)
                    Scout.shootArrow(this, this.controlledSprite)
                    break
                    case AbilityType.REPAIR: 
                    startAbilityCooldown(p,a)
                    Engineer.repairHammerSwing(this, this.controlledSprite)
                    break
                    case AbilityType.BUILD_WALL: this.startPlacingBuilding(BuildingType.WALL_H, true)
                    break
                    case AbilityType.BUILD_TOWER: this.startPlacingBuilding(BuildingType.TOWER_WEAPON, true)
                    break
                    case AbilityType.REMOVE_DEFENSE: this.startRemovingBuildings()
                    break
                    case AbilityType.EXIT_TOWER: 
                    startAbilityCooldown(p,a)
                    this.playerExitTower()
                    break
                    case AbilityType.MINE:
                    startAbilityCooldown(p,a)
                    Engineer.layMine(this, this.controlledSprite)
                    break
                    case AbilityType.CHARGE:
                    startAbilityCooldown(p,a)
                    Soldier.charge(this, this.controlledSprite)
                    break
                    case AbilityType.MELEE:
                    if(this.swingTimer){
                        this.swingSprite.destroy()
                        if(this.swingTimer.progress>=0.6 && this.swingTimer.progress <0.8){
                            Soldier.swing(this, this.controlledSprite, SwingType.HEAVY)
                        }
                        else Soldier.swing(this, this.controlledSprite, SwingType.FAST)
                        
                        this.swingTimer.remove()
                        this.swingTimer = null
                        return
                    }
                    this.swingSprite = Soldier.swing(this, this.controlledSprite, SwingType.WINDUP)
                    this.swingTimer = this.tweens.addCounter({
                        duration: 1000,
                        onComplete: () => {
                            this.swingSprite.destroy()
                            Soldier.swing(this, this.controlledSprite, SwingType.WIDE)
                        },
                        onUpdate: () => {
                            if(this.swingTimer &&
                                this.swingTimer.progress>=0.6 && 
                                this.swingTimer.progress <0.8){
                                    this.swingSprite.setTint(0xff0000)
                                }
                        }
                    })
                    break
                }
            }
            else if(s && s.cooldown === 0){
                onUpdatePlayer({...p, spells: p.spells.map(ab=>ab.type === s.type ? {...s, cooldown: 100}:ab)})
                switch(ability.type){
                    // case AbilityType.SEAL_RIFT: this.trySealRift()
                    // break
                    case AbilityType.ACTIVATE_PORTAL: Magus.activatePortal(this)
                    break
                    // case AbilityType.DRAW_OUT: this.tryDrawOut()
                    // break
                    case AbilityType.FLAME_WAVE: Magus.flameWave(this)
                    break
                    case AbilityType.PROTECTION: Magus.castProtection(this)
                    break
                }
            }
            else floatText(this, this.controlledSprite.x, this.controlledSprite.y, 'Not ready!')
        }
    }

    getDelegateForConsumable = (type:ConsumableType) => {
        switch(type){
            case ConsumableType.S_HEALING: return ()=>{
                let player = store.getState().party.find(p=>p.id === this.controlledSprite.id)
                player.consumables.splice(player.consumables.findIndex(c=>c===type),1)
                onUpdatePlayer({...player, hp:player.hp+1})
            }
            case ConsumableType.M_HEALING: return ()=>{
                let player = store.getState().party.find(p=>p.id === this.controlledSprite.id)
                player.consumables.splice(player.consumables.findIndex(c=>c===type),1)
                onUpdatePlayer({...player, hp:player.hp+3})
            }
        }
    }

    resourceTick = () => {
        store.getState().resourceNodes.forEach(node=>{
            if(node.isControlled){
                let spr = this.buildingSprites.find(spr=>spr.id===node.id)
                floatSprite(this, spr.x, spr.y, 'resources', getResourceIndexOfCollector(+spr.typeOfBuilding), node.rate)
                onAddResource(ResourceCategory.mineral, node.type, node.rate)
            } 
        })
    }

    spawnPlayerCharacter = (x:number,y:number, id:string) => {
        this.personSprites.push(new Player(this, x,y,JobType.LABORER, id))
    }

    playerExitTower = () => {
        this.controlledSprite.setMaxVelocity(PLAYER_SPEED)
        this.controlledSprite.setPosition(this.controlledSprite.x, this.controlledSprite.y-32) //TODO, find a clear square nearby
        onRemoveJob(JobType.GUNNER)
    }

    playerTouchedCollector = (tile:BuildingSprite) => {
        let index = +tile.typeOfBuilding
        let player = store.getState().party.find(p=>p.id === this.controlledSprite.id)
        if(InactiveTileIndexes.find(i=>i===index)){
            if(player.jobs[JobType.ENGINEER]){
                floatSprite(this, this.controlledSprite.x, this.controlledSprite.y, 'resources', getResourceIndexOfCollector(index))
                tile.setFrame(index-1)
                onControlNode(tile.id)
            }
            else floatText(this, this.controlledSprite.x, this.controlledSprite.y, 'Only Engineers can repair...')
        }
    }

    playerTouchedCollectable = (player:Player, node:Physics.Arcade.Sprite) => {
        let playerObj = store.getState().party.find(p=>p.id === player.id)
    }

    removeCorpse = (id:string) => {
        let i = this.corpses.findIndex(c=>c.id===id)
        if(i!==-1){
            let creep = this.corpses.splice(i,1)[0]
            creep.destroy()
        }
    }

    setSelectIconPosition(tile:Tuple){
        if(!this.selectIcon){
            this.selectIcon = this.add.image(tile.x, tile.y, 'selected').setDepth(2).setScale(0.5)
            this.add.tween({
                targets: this.selectIcon,
                scale: 1,
                duration: 1000,
                repeat: -1,
                yoyo: true
            })
        }
        else if(this.selectIcon.x !== tile.x || this.selectIcon.y !== tile.y) 
            this.selectIcon.setPosition(tile.x, tile.y)
        
        this.selectIcon.setVisible(true)
    }

    tryPickup = () => {
        this.controlledSprite.anims.stop()
        this.controlledSprite.play(this.controlledSprite.animationBaseIndex+'_action')
        if(!this.physics.overlap(this.controlledSprite, this.collectableSprites, this.playerTouchedCollectable)){
            floatText(this, this.controlledSprite.x, this.controlledSprite.y, 'Nothing to harvest...')
        }
    }

    tryPickupCorpse = () => {
        this.controlledSprite.anims.stop()
        this.controlledSprite.play(this.controlledSprite.animationBaseIndex+'_action')
        if(!this.physics.overlap(this.controlledSprite, this.corpses, (player:Player, corpse:Creep)=>Scout.playerHarvestCorpse(this, player, corpse))){
            floatText(this, this.controlledSprite.x, this.controlledSprite.y, 'No corpse to harvest...')
        }
    }

    generateFog = (x:number, y:number, radius:number) => {
        for(var r=radius; r>0; r--){
            _getCircle(x, y, r).forEach(tile=>{
                let x = tile[0], y=tile[1]
                let coordTile = this.fogLayer.getTileAt(x, y)
                if(coordTile){
                    coordTile.setAlpha(0.8)
                }
            })
        }
    }

    getAllCollidingTilesAt = (tileX:number, tileY:number) => 
        this.collidingLayers.find(l=>{
            let tile = l.getTileAt(tileX,tileY)
            return tile && tile.collides
        })

    tryMoveToward = (targetWorldTuple:Tuple, currentWorldTuple:Tuple, speed:number, sprite:Physics.Arcade.Sprite) => {
        let targetTileTuple = this.map.worldToTileXY(targetWorldTuple.x, targetWorldTuple.y)
        let currentTileTuple = this.map.worldToTileXY(currentWorldTuple.x, currentWorldTuple.y)
        let path = new AStar(targetTileTuple.x, targetTileTuple.y, (tileX:number, tileY:number)=>{ return this.tileData[tileX] && this.tileData[tileX][tileY] && !this.tileData[tileX][tileY].collides }).compute(currentTileTuple.x, currentTileTuple.y)
        if(path && path[0]){
            const targetTile = this.map.getTileAt(path[0].x, path[0].y, true, 'land')
            moveTowardXY(sprite, targetTile.getCenterX(),targetTile.getCenterY(), speed)
        }
    }

    floatSpriteAtBuilding = (buildingId:string, spriteIndex:number) => {
        let b = this.buildingSprites.find(b=>b.id === buildingId)
        floatSprite(this, b.x, b.y, 'materials', spriteIndex)
    }

    update(){
        if(this.keys['A'].isDown){
            this.controlledSprite.setVelocityX(-PLAYER_SPEED/2)
            this.controlledSprite.flipX = true
            this.controlledSprite.play(this.controlledSprite.animationBaseIndex+'_walk', true)
        }
        if(this.keys['D'].isDown){
            this.controlledSprite.setVelocityX(PLAYER_SPEED/2)
            this.controlledSprite.flipX = false
            this.controlledSprite.play(this.controlledSprite.animationBaseIndex+'_walk', true)
        }
        if(this.keys['W'].isDown){
            this.controlledSprite.setVelocityY(-PLAYER_SPEED/2)
            this.controlledSprite.play(this.controlledSprite.animationBaseIndex+'_walk', true)
        }
        if(this.keys['S'].isDown){
            this.controlledSprite.setVelocityY(PLAYER_SPEED/2)
            this.controlledSprite.play(this.controlledSprite.animationBaseIndex+'_walk', true)
        }
        if(this.focusedItem) this.setSelectIconPosition(this.focusedItem.getCenter())
        if(this.followText) this.followText.setPosition(this.controlledSprite.x, this.controlledSprite.y)
    }
}