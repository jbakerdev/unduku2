import { Scene, Physics } from "phaser";
import { FONT_DEFAULT, BuildingType } from "../../enum";
import BuildingSprite from "../canvas/BuildingSprite";
import { BuildingSpriteIndexes } from "../../assets/data/Buildings"

export const floatSprite = (scene:Scene, x:number, y:number, texture:string, frame:number, amount?:number) => {
    let font = scene.add.text(x-30, y-10, amount ? '+'+amount : '+', FONT_DEFAULT)
    font.setStroke('#000000', 4);
    font.setWordWrapWidth(200)
    font.setDepth(4)
    let img = scene.add.image(x,y,texture,frame)
    img.setDepth(4)
    scene.add.tween({
        targets: [font, img],
        duration: 1500,
        y: y+30,
        alpha: 0,
        onComplete: ()=>{
            font.destroy()
            img.destroy()
        }
    })
}

export const floatText = (scene:Scene, x:number, y:number, text:string) => {
    let font = scene.add.text(x-30, y, text, FONT_DEFAULT)
    font.setStroke('#000000', 4);
    font.setWordWrapWidth(200)
    font.setDepth(4)
    scene.add.tween({
        targets: font,
        duration: 1500,
        y: y+30,
        alpha: 0,
        onComplete: ()=>{
            font.destroy()
        }
    })
}

export const moveTowardXY = (currentSprite:Physics.Arcade.Sprite, x:number, y:number, speed:number) => {
    let dir = {x: x-currentSprite.x, y:y-currentSprite.y}
    let mag = Math.sqrt(dir.x*dir.x + dir.y*dir.y);
    dir.x = dir.x/mag; dir.y = dir.y/mag;
    currentSprite.setVelocity(dir.x*speed, dir.y*speed)
}

export const generateAnimationsForUnit = (scene:Scene, spriteIndex:number) => {
    scene.anims.create({
        key: spriteIndex+'_idle',
        frames: scene.anims.generateFrameNumbers('npcs', { start: spriteIndex, end: spriteIndex+3 }),
        frameRate: 6,
        repeat:-1
    })
    scene.anims.create({
        key: spriteIndex+'_walk',
        frames: scene.anims.generateFrameNumbers('npcs', { start: spriteIndex+24, end: spriteIndex+24+3 }),
        frameRate: 6
    })
    scene.anims.create({
        key: spriteIndex+'_attack',
        frames: scene.anims.generateFrameNumbers('npcs', { start: spriteIndex+48, end: spriteIndex+48+3 }),
        frameRate: 6
    })
    scene.anims.create({
        key: spriteIndex+'_action',
        frames: scene.anims.generateFrameNumbers('npcs', { start: spriteIndex+(24*3), end: spriteIndex+(24*3)+3 }),
        frameRate: 6
    })
    scene.anims.create({
        key: spriteIndex+'_die',
        frames: scene.anims.generateFrameNumbers('npcs', { start: spriteIndex+(24*4), end: spriteIndex+(24*4)+3 }),
        frameRate: 6
    })
}

export const getWallIndexForNeighbors = (building:BuildingSprite, buildingSprites:Array<BuildingSprite>) => {
    let dirs = [{dir: 'E', x:16,y:0},{dir: 'W', x:-16,y:0},{dir: 'S', x:0,y:16},{dir:'N', x:0,y:-16}]
    let neighbors = {}
    dirs.forEach(tup=>{
        let neighbor = buildingSprites.find(spr=>spr.getBounds().contains(building.x+tup.x, building.y+tup.y))
        neighbors[tup.dir] = neighbor
    })
    let index
    if(building.typeOfBuilding === BuildingType.WALL_H){
        index = BuildingSpriteIndexes[BuildingType.WALL_H]
        if(neighbors['N'] && neighbors['N'].typeOfBuilding === BuildingType.WALL_V) {
            index = BuildingSpriteIndexes[BuildingType.TOWER]
        }
        if(neighbors['S'] && neighbors['S'].typeOfBuilding === BuildingType.WALL_V){
            index = BuildingSpriteIndexes[BuildingType.TOWER]
        }
        //If you have an e/w neighbor that is a vertical wall, change it to an e/w tower
        if(neighbors['E'] && neighbors['E'].typeOfBuilding === BuildingType.WALL_V){
            neighbors['E'].setFrame(BuildingSpriteIndexes[BuildingType.TOWER])
        }
        if(neighbors['W'] && neighbors['W'].typeOfBuilding === BuildingType.WALL_V){
            neighbors['W'].setFrame(BuildingSpriteIndexes[BuildingType.TOWER])
        }
        return index
    }
    if(building.typeOfBuilding === BuildingType.WALL_V){
        index = BuildingSpriteIndexes[BuildingType.WALL_V]
        if(neighbors['W'] && neighbors['W'].typeOfBuilding === BuildingType.WALL_H) {
            index = BuildingSpriteIndexes[BuildingType.TOWER]
        }
        if(neighbors['E'] && neighbors['E'].typeOfBuilding === BuildingType.WALL_H) {
            index = BuildingSpriteIndexes[BuildingType.TOWER]
        }
        //if you have a n/s neighbor that is a horiz wall, turn it into a n/s tower
        if(neighbors['N'] && neighbors['N'].typeOfBuilding === BuildingType.WALL_H){
            neighbors['N'].setFrame(BuildingSpriteIndexes[BuildingType.TOWER])
        }
        if(neighbors['S'] && neighbors['S'].typeOfBuilding === BuildingType.WALL_H){
            neighbors['S'].setFrame(BuildingSpriteIndexes[BuildingType.TOWER])
        }
        return index
    }
    if(building.typeOfBuilding === BuildingType.TOWER_WEAPON){
        return BuildingSpriteIndexes[BuildingType.TOWER_WEAPON]
    }
}