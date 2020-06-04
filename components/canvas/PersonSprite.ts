import { Physics, Scene, GameObjects, Geom } from "phaser"
import WorldScene from "./WorldScene"
import { moveTowardXY, floatText, generateAnimationsForUnit } from "../helpers/Canvas"
import { PLAYER_SPEED, JobType, AbilityType, BuildingType, SwingType } from "../../enum"
import { NpcIndexes } from "../../assets/Assets"
import { store } from "../../App"
import { onTakeJob } from "../uiManager/Thunks"
import BuildingSprite from "./BuildingSprite"
import Scout from "../helpers/jobs/Scout"
import Magus from "../helpers/jobs/Magus"
import Soldier from "../helpers/jobs/Soldier"


export default class PersonSprite extends Physics.Arcade.Sprite {
    
    id:string
    followTimer:Phaser.Time.TimerEvent
    timer: Phaser.Time.TimerEvent
    animationBaseIndex:number
    aggrod: boolean
    startX:number
    startY:number
    world:WorldScene
    
    constructor(scene:WorldScene, x:number, y:number, frame:JobType, id:string){
        super(scene, x, y, 'npcs', NpcIndexes[frame])
        this.id = id
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.world = scene
        this.setDrag(PLAYER_SPEED)
        this.body.setSize(8,8).setOffset(4,8)
        this.animationBaseIndex = NpcIndexes[frame]
        this.setInteractive()
        this.setBounce(0.3)
        this.setDepth(1)
        this.startX = this.x
        this.startY = this.y
        generateAnimationsForUnit(scene, this.animationBaseIndex)
        this.anims.play(this.animationBaseIndex+'_idle')
        this.on('pointerdown', ()=>{
            scene.onSetPlayerControl(id)
            scene.focusedItem = null
            scene.selectIcon.setVisible(false)
        })
        scene.physics.add.collider(this, scene.collidingLayers)
        scene.physics.add.collider(this, scene.buildingSprites, playerHitBuilding)
        this.timer = scene.time.addEvent({
            delay: 500,
            callback: ()=> {
                let p = store.getState().party.find(p=>p.id === this.id)
                if(!p.controlledById) {
                    this.startX = this.x
                    this.startY = this.y
                    this.checkPatrolRange(p)
                }
            },
            repeat:-1
        })
    }

    startFollowUnit = (unit:Player) => {
        this.followTimer = this.scene.time.addEvent({
            delay: 500,
            repeat: -1,
            callback: ()=>{
                let p = this.world.partySprites.find(p=>p.id === unit.id);
                this.world.tryMoveToward({x:p.x, y:p.y}, {x:this.x, y:this.y}, PLAYER_SPEED, this)
            }
        })
    }

    stopFollowUnit = () => {
        this.followTimer.remove()
        this.followTimer = null
    }

    checkPatrolRange = (p:PlayerState) => {
        let aggroRect = new Geom.Rectangle(this.x-(p.range), this.y-(p.range), p.range*2, p.range*2)
        let visibleUnit = this.world.creeps.find(o=>{
            return Phaser.Geom.Intersects.RectangleToRectangle(aggroRect, o.getBounds())
        })
        if(visibleUnit){
            let d = Phaser.Math.Distance.Between(this.x, this.y, visibleUnit.x, visibleUnit.y)
            if(d<p.range){
                if(p.jobs[JobType.SCOUT] || p.jobs[JobType.GUNNER]){
                    if(p.abilities.find(a=>a.type === AbilityType.SHOOT_ARROW).cooldown === 0)
                    Scout.shootArrow(this.world, this, visibleUnit)
                } 
                else if(p.jobs[JobType.MAGE]){
                    if(p.abilities.find(a=>a.type === AbilityType.FLAME_WAVE).cooldown === 0)
                    Magus.flameWave(this.world)
                } 
                else if(p.jobs[JobType.SOLDIER] && d < 10){
                    if(p.abilities.find(a=>a.type === AbilityType.AXE).cooldown === 0)
                    Soldier.swing(this.world, this, SwingType.FAST, visibleUnit)
                }
            }
            else return this.moveTowardsTarget(visibleUnit.x, visibleUnit.y, PLAYER_SPEED/2)
        }
        if(visibleUnit && !this.aggrod){
            this.aggrod = true
            this.startX = this.x
            this.startY = this.y
        }
        else this.aggrod = false
        if(!this.aggrod){
            this.moveTowardsTarget(this.startX, this.startY, PLAYER_SPEED/2)
        }
    }

    moveTowardsTarget = (targetX:number, targetY:number, speed:number) => {
        this.world.tryMoveToward({x:targetX, y:targetY}, {x:this.x, y:this.y}, speed, this)
    }

    preUpdate = (time, delta) =>
    {
        this.anims.update(time, delta)
    }

    destroy(){
        this.followTimer && this.followTimer.remove()
        this.timer.remove()
        super.destroy()
    }
}

export const playerHitBuilding = (player:Physics.Arcade.Sprite, building:BuildingSprite) => {
    if(building.typeOfBuilding === BuildingType.TOWER_WEAPON){
        player.setPosition(building.getCenter().x, building.getCenter().y)
        player.setMaxVelocity(0)
        onTakeJob(JobType.GUNNER)
    }
}

