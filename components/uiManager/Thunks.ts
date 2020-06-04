import { dispatch, store } from '../../App'
import { UIReducerActions, Modal } from '../../enum'

export const onInitSession = () => {
    dispatch({ type: UIReducerActions.NEW_SESSION })
}

export const onSelectPlayer = (id:string) => {
    dispatch({ type: UIReducerActions.SELECT_PLAYER, id })
}

export const onAddResourceNode = (id:string, type:ResourceType) => {
    dispatch({ type: UIReducerActions.ADD_NODE, id, resource:type })
}

export const onUpdatePlayerControl = (id:string) => {
    dispatch({ type: UIReducerActions.UPDATE_PLAYER_CONTROL, id })
}

export const onControlNode = (nodeId:string) => {
    dispatch({ type: UIReducerActions.UPDATE_NODE_CONTROL, nodeId })
}

export const onAddResource = (category:ResourceCategory, resourceType:ResourceType, amount:number) => {
    dispatch({ type: UIReducerActions.UPDATE_RESOURCE, resourceType, amount, category })
}

export const onAddSpell = (spell:AbilityState) => {
    dispatch({ type: UIReducerActions.ADD_SPELL, spell })
}

export const onReplaceSpell = (spell:AbilityState, index:number) => {
    dispatch({ type: UIReducerActions.REPLACE_SPELL, spell, index })
}

export const onPlacedBuilding = (buildingType:BuildingType, id:string) => {
    dispatch({ type: UIReducerActions.ADD_BUILDING, buildingType, id })
}

export const onShowModal = (modal:BuildingType|Modal) => {
    dispatch({ type: UIReducerActions.SHOW_MODAL, modal })
}

export const onHideModal = () => {
    dispatch({ type: UIReducerActions.HIDE_MODAL })
}

export const onTakeJob = (job:JobType) => {
    dispatch({ type: UIReducerActions.TAKE_JOB, job })
}

export const onRemoveJob = (job:JobType) => {
    dispatch({ type: UIReducerActions.REMOVE_JOB, job })
}

export const onReplaceJob = (oldJob:JobType, newJob:JobType) => {
    dispatch({ type: UIReducerActions.REPLACE_JOB, oldJob, newJob })
}

export const onStartPlacingBuilding = (buildingType:BuildingType) => {
    dispatch({ type: UIReducerActions.START_PLACE, buildingType })
}

export const onInitEngine = (phaserInstance:Phaser.Scene) => {
    dispatch({ type: UIReducerActions.INIT_ENGINE, phaserInstance })
}

export const onUpdateJobXp = (job:JobType, xp:number) => {
    dispatch({ type: UIReducerActions.JOB_XP, job, xp })
}

export const onMatchTick = () => {
    dispatch({ type: UIReducerActions.UPDATE_TIMER })
}

export const onUpdatePlayer = (player:PlayerState) => {
    dispatch({ type: UIReducerActions.UPDATE_PLAYER, player })
}

export const onUpdateBuilding = (building:BuildingState) => {
    dispatch({ type: UIReducerActions.UPDATE_BUILDING, building })
}

export const onRemoveBuilding = (id:string) => {
    dispatch({ type: UIReducerActions.REMOVE_BUILDING, id })
}

export const onAddConsumableToPlayer = (consumable:ConsumableType) => {
    dispatch({ type: UIReducerActions.ADD_CONSUMABLE, consumable })
}

export const onAddGearToPlayer = (gear:GearType) => {
    dispatch({ type: UIReducerActions.ADD_GEAR, gear })
}

export const onAddConsumableToQueue = (consumable:ConsumableType) => {
    dispatch({ type: UIReducerActions.ADD_CONSUMABLE_ORDER, consumable: { time: 100, type: consumable} })
}

export const onAddGearToQueue = (gear:GearType) => {
    dispatch({ type: UIReducerActions.ADD_GEAR_ORDER, gear: { time: 100, type: gear} })
}

export const onCreepExited = () => {
    dispatch({ type: UIReducerActions.CREEP_EXIT })
}

export const onUnlockRecipe = (recipe:ConsumableType|GearType) => {
    dispatch({ type: UIReducerActions.UNLOCK_CRAFTABLE, recipe })
}