import { Physics, Scene, GameObjects, Geom } from "phaser"


export default class ResourceNode extends Physics.Arcade.Sprite {
    
    resourceType:ResourceType
    
    constructor(scene:Scene, x:number, y:number, frame:ResourceType){
        super(scene, x, y, 'resources', frame)
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.resourceType = frame
        this.setImmovable()
    }
}
