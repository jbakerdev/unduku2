import { Physics, Scene, Geom } from "phaser"
import WorldScene from "./WorldScene"
import { moveTowardXY, generateAnimationsForUnit } from "../helpers/Canvas"
import { CreepType, PLAYER_SPEED, CORPSE_DECAY, BuildingType } from "../../enum"
import { Creeps } from '../../assets/data/Creeps'
import * as v4 from 'uuid'
import Player from "./PersonSprite"
import { store } from "../../App"
import { onUpdatePlayer, onUpdateBuilding, onRemoveBuilding } from "../uiManager/Thunks"
import { SpriteIndexes } from "../../assets/Assets"
import Portal from "./Portal"
import BuildingSprite from "./BuildingSprite"
import { BuildingSpriteIndexes } from "../../assets/data/Buildings"


export default class Creep extends Physics.Arcade.Sprite {
    
    id:string
    creepType:CreepType
    timer:Phaser.Time.TimerEvent
    patrolTimer:Phaser.Time.TimerEvent
    startX:number
    startY:number
    range:number
    speed:number
    sight:number
    aggrod:boolean
    
    constructor(scene:Scene, x:number, y:number, frame:CreepType, patrol:boolean){
        super(scene, x, y, 'npcs', frame)
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.body.setSize(8,8).setOffset(4,8)
        this.setBounce(0.5)
        this.setDepth(1)
        this.id = v4()
        generateAnimationsForUnit(scene, frame)
        this.startX = x
        this.startY = y
        this.range = Creeps[frame].range
        this.sight = Creeps[frame].sight
        this.speed = Creeps[frame].speed
        this.creepType = frame
        if(patrol){
            this.timer = scene.time.addEvent({
                delay: 250,
                callback: ()=>{
                    this.checkPatrolRange()
                },
                repeat: -1
            })
            this.patrolTimer = scene.time.addEvent({
                delay:Phaser.Math.Between(1000, 2000),
                callback: ()=>{
                    if(!this.aggrod) this.pickNewDirection()
                },
                repeat:-1
            })
            this.pickNewDirection()
        }
        else {
            this.timer = scene.time.addEvent({
                delay: 250,
                callback: ()=>{
                    this.marchToRift()
                },
                repeat: -1
            })
        }
        
        console.log('creep was spawned at '+x+','+y)
    }

    marchToRift = () => {
        let aggroRect = new Geom.Rectangle(this.x-(this.sight/2), this.y-(this.sight/2), this.sight, this.sight)
        let visibleUnit = (this.scene as WorldScene).partySprites.find(o=>{
            return Phaser.Geom.Intersects.RectangleToRectangle(aggroRect, o.getBounds())
        })
        if(visibleUnit){
            return this.moveTowardsTarget(visibleUnit.x, visibleUnit.y, this.speed)
        }
        this.moveTowardsTarget((this.scene as WorldScene).theRift.x, (this.scene as WorldScene).theRift.y, this.speed)
    }

    checkPatrolRange = () => {
        let aggroRect = new Geom.Rectangle(this.x-(this.sight/2), this.y-(this.sight/2), this.sight, this.sight)
        let visibleUnit = (this.scene as WorldScene).partySprites.find(o=>{
            return Phaser.Geom.Intersects.RectangleToRectangle(aggroRect, o.getBounds())
        })
        let d = Phaser.Math.Distance.Between(this.x, this.y, this.startX, this.startY)
        if(visibleUnit && d < this.range*2){
            this.aggrod = true
            return this.moveTowardsTarget(visibleUnit.x, visibleUnit.y, this.speed)
        }
        else this.aggrod = false
        if(this.range <= d){
            this.moveTowardsTarget(this.startX, this.startY, this.speed)
        }
    }

    moveTowardsTarget = (targetX:number, targetY:number, speed:number) => {
        (this.scene as WorldScene).tryMoveToward({x:targetX, y:targetY}, {x:this.x, y:this.y}, speed, this)
    }

    pickNewDirection = () => {
        let targetTileCoords = {x: this.x, y: this.y}
        switch(Phaser.Math.Between(0,3)){
            case 0: targetTileCoords.y++
            break
            case 1: targetTileCoords.x--
            break
            case 2: targetTileCoords.x++
            break
            case 3: targetTileCoords.y--
        }
        moveTowardXY(this, targetTileCoords.x, targetTileCoords.y, this.speed)
    }

    preUpdate = (time, delta) =>
    {
        this.anims.update(time, delta)
    }

    destroy(){
        this.patrolTimer && this.patrolTimer.remove()
        this.timer.remove()
        super.destroy()
    }
}

export const creepHitPlayer = (scene:WorldScene, creep:Creep, player:Player) => {
    let p = store.getState().party.find(p=>p.id===player.id)
    scene.effects.get(player.x, player.y, 'creature_hit').play('creature_hit')
    if(p.hp > 0){
        onUpdatePlayer({...p, hp: p.hp-1})
        player.setTint(0xff0000)
        scene.tweens.add({
            targets: player,
            alpha: 0.6,
            duration: 500,
            onComplete: ()=>{
                player.clearTint()
                player.clearAlpha()
                let p = store.getState().party.find(p=>p.id===player.id)
                if(p.hp === 0){
                    onUpdatePlayer({...p, hp: p.hp-1, sight:1})
                    if(p.controlledById === store.getState().myId){
                        scene.input.keyboard.enabled = false
                        scene.input.keyboard.off('keyup')
                    }
                    player.anims.play(player.animationBaseIndex+'_die')
                    player.setMaxVelocity(0)
                    scene.add.sprite(player.x, player.y, 'resources', SpriteIndexes.grave).setDepth(0)
                    scene.generateFog(scene.map.worldToTileX(player.x), scene.map.worldToTileY(player.y), p.sight+1)
                    scene.time.addEvent({
                        delay: 5000,
                        callback: ()=> {
                            if(p.controlledById === store.getState().myId){
                                scene.input.keyboard.enabled = true
                                scene.input.keyboard.on('keyup', ()=>{
                                    scene.controlledSprite.anims.chain(scene.controlledSprite.animationBaseIndex+'_idle')
                                })
                            }
                            player.setPosition(scene.theRift.x, scene.theRift.y)
                            player.setMaxVelocity(PLAYER_SPEED)
                            onUpdatePlayer({...p, hp: p.maxHp, sight:3})
                        }
                    })
                } 
            }
        })
    } 
    
}

export const destroyCreep = (scene:WorldScene, creep:Creep, creeps:Array<Creep>, portal?:Portal) => {
    creep.setMaxVelocity(0)
    creep.anims.play(creep.creepType+'_die')
    creeps.splice(creeps.findIndex(c=>c.id===creep.id),1)
    let corpse = scene.creeps.splice(scene.creeps.findIndex(c=>c.id===creep.id),1)[0]
    if(corpse) scene.corpses.push(corpse)
    scene.add.tween({
        targets: creep,
        alpha: 0,
        duration:CORPSE_DECAY,
        ease: 'Stepped',
        easeParams:[3],
        onComplete: () => {
            scene.removeCorpse(creep.id)
            if(portal && creeps.length === 0) {
                portal.destroy()
                console.log('portal closed')
            }
        }
    })
}

export const creepHitBuilding = (scene:WorldScene, creep:Creep, building:BuildingSprite) => {
    if(building.typeOfBuilding === BuildingType.TOWER || 
        building.typeOfBuilding === BuildingType.TOWER_WEAPON ||
        building.typeOfBuilding === BuildingType.WALL_H ||
        building.typeOfBuilding === BuildingType.WALL_V){
            let build = store.getState().buildings.find(b=>b.id === building.id)
            build.hp--
            onUpdateBuilding(build)
            if(build.hp < 5 && +building.frame.name !== BuildingSpriteIndexes[building.typeOfBuilding]-1) {
                building.setFrame(BuildingSpriteIndexes[building.typeOfBuilding]-1)
            }
            if(build.hp <= 0){
                onRemoveBuilding(build.id)
                if(building.typeOfBuilding === BuildingType.TOWER_WEAPON){
                    scene.playerExitTower()
                }
                scene.modifyBlockingBuilding(building, false, true)
            }
        }
}