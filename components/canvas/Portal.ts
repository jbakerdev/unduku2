import { Physics, Scene, GameObjects } from "phaser"
import Creep, { destroyCreep } from "./Creep"
import { Modal, ProjectileType } from "../../enum"
import WorldScene from "./WorldScene"
import { SpriteIndexes } from "../../assets/Assets"
import { onCreepExited, onShowModal } from "../uiManager/Thunks"
import { store } from "../../App"

export default class Portal extends GameObjects.Sprite {
    
    timer:Phaser.Time.TimerEvent
    creeps: Array<Creep>
    creepList: Array<CreepType>
    world: WorldScene
    
    constructor(scene:Scene, x:number, y:number, creepList:Array<CreepType>, waveSize:number){
        super(scene, x, y, 'resources', SpriteIndexes.portal)
        scene.add.existing(this)
        this.world = scene as WorldScene
        this.timer = scene.time.addEvent({
            delay: 1000,
            callback: ()=>{
                this.spawnUnit()
            },
            repeat: waveSize
        })
        this.creeps = []
        this.creepList = creepList
        scene.physics.add.overlap(this.creeps, this.world.detonations, this.creepExplosionHit)
        scene.physics.add.overlap(this.creeps, this.world.projectiles, this.playerShotCreep)
        scene.physics.add.overlap(this.creeps, this.world.meleeWeapons, this.playerShotCreep)
        scene.physics.add.collider(this.creeps, this.world.theRift, this.creepTouchedRift)
    }
    
    creepExplosionHit = (creep:Creep, explosion:Physics.Arcade.Sprite) => {
        destroyCreep(this.world, creep, this.creeps, this)
    }

    creepTouchedRift = (creep:Creep, rift:GameObjects.Sprite) => {
        //TODO particles
        this.world.cameras.main.shake(250,0.005)
        this.world.effects.get(creep.x, creep.y, 'warp').setScale(0.1).play('warp')
        this.creeps.splice(this.creeps.findIndex(c=>c.id===creep.id),1)
        this.world.creeps.splice(this.world.creeps.findIndex(c=>c.id===creep.id),1)
        creep.destroy()
        if(store.getState().creepsOut > 9) {
            this.world.time.removeAllEvents()
            return onShowModal(Modal.LOSE)
        }
        onCreepExited()
        if(this.creeps.length === 0) {
            this.destroy()
            console.log('portal closed')
        }
    }

    playerShotCreep = (creep:Creep, projectile:Physics.Arcade.Sprite) => {
        if(projectile.type === ProjectileType.ARROW as any) projectile.destroy()
        destroyCreep(this.world, creep, this.creeps, this)
    }

    spawnUnit = () => {
        let creep = new Creep(this.scene, this.x, this.y, this.creepList[Phaser.Math.Between(0,this.creepList.length-1)], false)
        this.creeps.push(creep)
        this.world.creeps.push(creep)
    }
}
