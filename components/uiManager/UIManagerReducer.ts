import { UIReducerActions, Modal, ResourceType, BuildingType, JobType, Spells } from '../../enum'
import * as v4 from 'uuid'
import { getDefaultParty, getGearSlotFromType } from '../helpers/Util';
import WorldScene from '../canvas/WorldScene';
import { Consumables } from '../../assets/data/Consumables';
import { Gear } from '../../assets/data/Gear';

const appReducer = (state = getInitialState(), action:any):RState => {
    state.engineEvent = null
    switch (action.type) {
        case UIReducerActions.NEW_SESSION:
            return getInitialState()
        case UIReducerActions.ADD_NODE:
            state.resourceNodes.push({
                id: action.id,
                type: action.resource,
                isControlled: false,
                rate: 1
            })
            return {...state, resourceNodes: Array.from(state.resourceNodes)}
        case UIReducerActions.UPDATE_PLAYER_CONTROL:
            state.party.forEach(p=>{
                if(p.controlledById === state.myId) p.controlledById = ''
                if(p.id === action.id) p.controlledById = state.myId
            })
            return {...state, party: Array.from(state.party)}
        case UIReducerActions.UPDATE_NODE_CONTROL:
            state.resourceNodes.forEach(node=>{
                if(node.id === action.nodeId) node.isControlled = true
            })
            return {...state, resourceNodes: Array.from(state.resourceNodes)}
        case UIReducerActions.UPDATE_RESOURCE:
            state.resources[action.category][action.resourceType]+=action.amount
            return {...state, resources: {...state.resources}}
        case UIReducerActions.ADD_BUILDING:
            // getBuildingCost(action.buildingType).forEach(cost=>{
            //     state.resources[cost.type]-=cost.amount
            // })
            state.buildings.push({
                id:action.id,
                type: action.buildingType,
                x:0,y:0,hp:10,
                researchType: null,
                researchProgress: 0,
                preparedConsumables: [],
                preparedGear: []
            })
            return { ...state, buildings: Array.from(state.buildings) }
        case UIReducerActions.SHOW_MODAL:
            return { ...state, modal: action.modal }
        case UIReducerActions.HIDE_MODAL:
            return { ...state, modal: null }
        case UIReducerActions.TAKE_JOB:
            state.party.forEach(p=>{
                if(p.controlledById === state.myId) 
                    p.jobs[action.job] = {
                        level: 1,
                        xp: 0
                    }
            })
            return { ...state, party: Array.from(state.party), modal:null, engineEvent: UIReducerActions.TAKE_JOB }
        case UIReducerActions.REMOVE_JOB:
            state.party.forEach(p=>{
                if(p.controlledById === state.myId) 
                    delete p.jobs[action.job]
            })
            return { ...state, party: Array.from(state.party), engineEvent:UIReducerActions.REMOVE_JOB}
        case UIReducerActions.REPLACE_JOB:
            state.party.forEach(p=>{
                if(p.controlledById === state.myId) {
                    delete p.jobs[action.oldJob]
                    p.jobs[action.newJob] = {
                        level: 1,
                        xp: 0
                    }
                }
            })
            return { ...state, party: Array.from(state.party), modal:null, engineEvent: UIReducerActions.REPLACE_JOB }
        case UIReducerActions.START_PLACE:
            (state.engine as WorldScene).startPlacingBuilding(action.buildingType, false)
            return { ...state, modal: null }
        case UIReducerActions.INIT_ENGINE:
            return { ...state, engine: action.phaserInstance}
        case UIReducerActions.JOB_XP:
            state.party.forEach(p=>{
                if(p.controlledById === state.myId) {
                    p.jobs[action.job].xp+=action.xp
                    if(p.jobs[action.job].xp >= p.jobs[action.job].level*100){
                        p.jobs[action.job].xp = 0
                        p.jobs[action.job].level++
                        switch(action.job){
                            case JobType.SCOUT: p.sight++
                            break
                            case JobType.MAGE: p.range++
                            break
                            case JobType.SOLDIER: p.damage++
                            break
                        }
                    }
                }
            })
            return { ...state, party: Array.from(state.party) }
        case UIReducerActions.UPDATE_PLAYER:
            state.party = state.party.map(p=>{
                if(p.id === action.player.id) {
                    return {...action.player}
                }
                return p
            })
            return { ... state, party: Array.from(state.party)}
        case UIReducerActions.UPDATE_TIMER:
            state.party.forEach(p=>{
                p.abilities.forEach(a=>{
                    if(a.cooldown > 0) a.cooldown-=a.cooldownRate
                    if(a.cooldown < 0) a.cooldown = 0
                })
                p.spells.forEach(a=>{
                    if(a.cooldown > 0) a.cooldown-=a.cooldownRate
                    if(a.cooldown < 0) a.cooldown = 0
                })
            })
            state.buildings = state.buildings.map(b=>{
                let finished = b.preparedConsumables.filter(c=>c.time===0)
                b.preparedConsumables = b.preparedConsumables.filter(c=>c.time!==0).map(c=>{
                    let newTime = c.time-Consumables.find(cc=>cc.type===c.type).timeIncrement
                    if(newTime > 0) return {...c, time: newTime}
                    if(newTime <= 0){
                        (state.engine as WorldScene).floatSpriteAtBuilding(b.id, Consumables.find(con=>con.type===c.type).index)
                        return {...c, time: 0}
                    } 
                    return c
                }).concat(finished)

                let finishedg = b.preparedGear.filter(c=>c.time===0)
                b.preparedGear = b.preparedGear.filter(c=>c.time!==0).map(c=>{
                    let newTime = c.time-Gear.find(cc=>cc.type===c.type).timeIncrement
                    if(newTime > 0) return {...c, time: newTime}
                    if(newTime <= 0){
                        (state.engine as WorldScene).floatSpriteAtBuilding(b.id, Gear.find(con=>con.type===c.type).index)
                        return {...c, time: 0}
                    } 
                    return c
                }).concat(finishedg)
                return {...b}
            })
            return { ...state, waveTimer: state.waveTimer+1, party: Array.from(state.party), buildings: Array.from(state.buildings) }
        case UIReducerActions.UPDATE_BUILDING:
            state.buildings.forEach(b=>{
                if(b.id === action.building.id) b = {...action.building}
            })
            return { ...state, buildings: Array.from(state.buildings)}
        case UIReducerActions.REMOVE_BUILDING:
            return { ...state, buildings: state.buildings.filter(b=>b.id !== action.id)}
        case UIReducerActions.ADD_CONSUMABLE:
            state.party.forEach(p=>{
                if(p.controlledById === state.myId) {
                    p.consumables.push(action.consumable)
                }
            })
            const bldd = state.buildings.map(p=>{
                if(p.type === BuildingType.ALCHEMIST) {
                    p.preparedConsumables.splice(p.preparedConsumables.findIndex(type=>type===action.consumable),1)
                }
                return {...p}
            })
            return { ...state, party: Array.from(state.party), buildings: bldd, engineEvent: UIReducerActions.ADD_CONSUMABLE}
        case UIReducerActions.ADD_GEAR:
            state.party.forEach(p=>{
                if(p.controlledById === state.myId) {
                    p.gear[getGearSlotFromType(action.gear)] = action.gear
                }
            })
            const blddd = state.buildings.map(p=>{
                if(p.type === BuildingType.BLACKSMITH) {
                    p.preparedGear.splice(p.preparedGear.findIndex(type=>type===action.gear),1)
                }
                return {...p}
            })
            return { ...state, party: Array.from(state.party), buildings: blddd, engineEvent: UIReducerActions.ADD_GEAR}
        case UIReducerActions.ADD_GEAR_ORDER:
            //TODO: time delay
            const bldrs = state.buildings.map(p=>{
                if(p.type === BuildingType.BLACKSMITH) {
                    p.preparedGear.push(action.gear)
                }
                return {...p}
            })
            return { ...state, buildings: bldrs}
        case UIReducerActions.ADD_CONSUMABLE_ORDER:
            //TODO: time delay
            const blds = state.buildings.map(p=>{
                if(p.type === BuildingType.ALCHEMIST) {
                    p.preparedConsumables.push(action.consumable)
                }
                return {...p}
            })
            return { ...state, buildings: blds}
        case UIReducerActions.CREEP_EXIT:
            return { ...state, creepsOut: state.creepsOut+1 }
        case UIReducerActions.UNLOCK_CRAFTABLE:
            let c = Consumables.find(c=>c.type===action.recipe)
            if(c) c.unlocked = true
            let g = Gear.find(c=>c.type===action.recipe)
            if(g) g.unlocked = true
            return { ...state }
        case UIReducerActions.ADD_SPELL:
            state.party.forEach(p=>{
                if(p.controlledById === state.myId) {
                    p.spells.push(action.spell)
                }
            })
            state.resources.parts[ResourceType.LORE]-=Spells[action.spell.type].loreCost
            return { ...state, party: Array.from(state.party), resources: {...state.resources}, engineEvent: UIReducerActions.ADD_SPELL }
        case UIReducerActions.REPLACE_SPELL:
            state.party.forEach(p=>{
                if(p.controlledById === state.myId) {
                    p.spells.splice(action.index, 1)
                    p.spells.push(action.spell)
                }
            })
            state.resources.parts[ResourceType.LORE]-=Spells[action.spell.type].loreCost
            return { ...state, party: Array.from(state.party), resources: {...state.resources}, engineEvent: UIReducerActions.REPLACE_SPELL }
        case UIReducerActions.SELECT_PLAYER:
            state.party.forEach(p=>{
                if(p.controlledById === state.myId) p.controlledById = ''
                if(p.id === action.id) p.controlledById = state.myId
            })
            return {...state, party: Array.from(state.party), engineEvent: UIReducerActions.SELECT_PLAYER}
        default:
            return state
    }
};

export default appReducer;

const getInitialState = ():RState => {
    return {
        modal: null,
        engine: null,
        engineEvent: null,
        resourceNodes: [],
        resources: {
            mineral: {
                [ResourceType.WOOD]:0,
                [ResourceType.RED_CRYSTAL]:0,
                [ResourceType.ORE]:0,
                [ResourceType.OIL]:0,
                [ResourceType.GOLD]:0,
                [ResourceType.CRYSTAL]:0,
                [ResourceType.AMBER]:0,
            },
            food: {
                [ResourceType.DESERTBLOOM]:0,
                [ResourceType.CREEPER]:0,
                [ResourceType.HOGSPINE]:0,
                [ResourceType.ICECROWN]:0,
                [ResourceType.MAIDSHAND]:0,
                [ResourceType.MARSHWORT]:0,
                [ResourceType.MAYPOLE]:0,
                [ResourceType.SANDBERRY]:0,
                [ResourceType.WATERPEA]:0,
            },
            parts: {
                [ResourceType.FIRE_ESSENCE]:0,
                [ResourceType.DEMON_HIDE]:0,
            }
        },
        buildings: [],
        myId: v4(),
        party: getDefaultParty(),
        waveTimer: 0,
        creepsOut: 0
    }
}