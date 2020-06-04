import { Physics, Scene } from "phaser"
 import * as v4 from 'uuid'
import { onShowModal, onPlacedBuilding } from "../uiManager/Thunks"
import WorldScene from "./WorldScene"
import { BuildingType } from "../../enum"
import { BuildingSpriteIndexes } from "../../assets/data/Buildings"

export default class BuildingSprite extends Physics.Arcade.Sprite {
    
    id:string
    typeOfBuilding: BuildingType
    world:WorldScene
    
    constructor(scene:Scene, x:number, y:number, buildingType:BuildingType){
        super(scene, x, y, 'structures', BuildingSpriteIndexes[buildingType])
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.world = scene as WorldScene
        this.setInteractive()
        this.typeOfBuilding = buildingType
        this.setImmovable(true)
        this.setCollideWorldBounds()
        this.world.modifyBlockingBuilding(this, true, false)
        this.id = v4()
    }
}
