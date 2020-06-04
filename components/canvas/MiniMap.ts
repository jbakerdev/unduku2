import { Physics, Scene, GameObjects, Geom } from "phaser"
import WorldScene from "./WorldScene"
import { LandTileColors, FeatureTileColors, TileColors } from "../../assets/Assets"

const DIM = 50
export default class MiniMap {
    
    scene:WorldScene
    g:GameObjects.Graphics
    ratioX:number
    ratioY:number
    colorMap:Array<Array<number>>
    
    constructor(scene:WorldScene){
        this.scene = scene
        this.g = scene.add.graphics()
        let background = scene.add.graphics()
        let top = scene.game.canvas.getBoundingClientRect().top+85
        background.setPosition(255,top)
        background.fillStyle(0x000000, 1)
        background.fillRect(0,0,DIM*2,DIM*2)
        background.setScrollFactor(0)
        background.setDepth(5)
        this.g.setPosition(255,top)
        this.g.fillStyle(0x000000, 1)
        this.g.fillRect(0,0,DIM*2,DIM*2)
        this.g.setScrollFactor(0)
        this.g.setDepth(6)
        this.ratioX = Math.round(scene.map.width/DIM)
        this.ratioY = Math.round(scene.map.height/DIM)
        scene.time.addEvent({
            delay:500,
            callback:()=>this.update(),
            repeat:-1
        })
        this.init()
    }

    getColorOfTile = (x:number,y:number, collideIndexes) => {
        let tile = this.scene.map.getTileAt(x*this.ratioX,y*this.ratioY, true, 'features2')
        if(collideIndexes.findIndex(i=>i===tile.index)!==-1){
            if(tile.index > 1275) return 0x796755
            return 0x14a02e
        } 
        tile = this.scene.map.getTileAt(x*this.ratioX,y*this.ratioY, true, 'features')
        if(collideIndexes.findIndex(i=>i===tile.index)!==-1){
            if(tile.index > 1275) return 0x796755
            return 0x14a02e
        } 
        else tile = this.scene.map.getTileAt(x*this.ratioX,y*this.ratioY, true, 'land')
        
        if(tile.index !== -1) return 0x00ff00

        return 0
    }

    checkLayer(x,y,name){
        let tile = this.scene.map.getTileAt(x*this.ratioX,y*this.ratioY, true, name)
        return TileColors[tile.index]
    }

    getAlpha(x,y){
        let fog = this.scene.fogLayer.getTileAt(x*this.ratioX,y*this.ratioY, true)
        if(!fog) return 1
        if(fog.alpha === 1) return 0
        else if(fog.alpha === 0) {
            return 1
        }
        else if(fog.alpha === 0.8){
            return 0.5
        }
    }

    init(){
        this.g.clear()
        this.colorMap = []
        let collideIndexes = this.scene.map.getLayer('features').collideIndexes
        for(var i=0;i<DIM;i++){
            for(var j=0;j<DIM;j++){
                if(!this.colorMap[i]) this.colorMap[i] = []
                this.colorMap[i][j] = this.getColorOfTile(i,j, collideIndexes)
            }
        }
    }

    update(){
        this.g.clear()
        for(var i=0;i<DIM;i++){
            for(var j=0;j<DIM;j++){
                this.g.fillStyle(this.colorMap[i][j], this.getAlpha(i,j))
                this.g.fillRect(i*2,j*2,2,2)
            }
        }
        for(var i=0;i<this.scene.partySprites.length;i++){
            let sprCtr = this.scene.partySprites[i].getCenter()
            this.g.fillStyle(0xffffff, 1)
            this.g.fillRect(this.scene.map.worldToTileX(sprCtr.x)*this.ratioX*2,this.scene.map.worldToTileX(sprCtr.y)*this.ratioY*2,2,2)
        }
        for(var i=0;i<this.scene.creeps.length;i++){
            let sprCtr = this.scene.creeps[i].getCenter()
            let tileX = this.scene.map.worldToTileX(sprCtr.x)*this.ratioX
            let tileY = this.scene.map.worldToTileX(sprCtr.y)*this.ratioY
            if(this.getAlpha(tileX,tileY) === 1){
                this.g.fillStyle(0xff0000, 1)
                this.g.fillRect(tileX*2,tileY*2,2,2)
            }
        }
    }
}
