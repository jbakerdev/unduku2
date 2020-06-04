import * as React from 'react'
import AppStyles from '../../AppStyles';
import { TopBar, Button, Icon, NumericInput, LightButton, ButtonStrip } from '../helpers/Shared'
import { Consumables } from '../../assets/data/Consumables' 
import { JobType } from '../../enum';
import { onHideModal, onAddConsumableToPlayer, onAddConsumableToQueue } from '../uiManager/Thunks';
import JobChooser from './JobChooser';
import { hasMaterials } from '../helpers/Util';
import { Resources } from '../../assets/data/Resources';

interface Props{
    controlledPlayer: PlayerState
    resources: Resources
    building: BuildingState
}

export default class Herbalist extends React.PureComponent<Props> {

    render(){
        const jobs = this.props.controlledPlayer.jobs
        const items = this.props.building.preparedConsumables
        return (
            <div style={{...AppStyles.modal, height:'250px', width:'400px', justifyContent:'space-between', background:'black'}}>
                {this.props.controlledPlayer.jobs[JobType.HERBALIST] ?
                <div style={{height:'100%', overflow:"auto"}}>
                    <h5>Welcome back, Herbalist</h5>
                    <h5>Recipes</h5>
                    {Consumables.filter(f=>f.unlocked).map(recipe=>
                        <div onClick={()=>onAddConsumableToQueue(recipe.type)} 
                             style={{display:'flex', cursor:'pointer', opacity: hasMaterials(recipe, this.props.resources) ? 1 : 0.5, pointerEvents: hasMaterials(recipe, this.props.resources) ? 'all' : 'none'}}>
                            <div style={{backgroundImage:'url('+recipe.base64+')', backgroundSize:'cover', height:'32px', width:'32px'}}/>
                            <div>
                                {recipe.requiredLevel > jobs[JobType.HERBALIST].level && <h6 style={{color:'red'}}>Requires HER lvl {recipe.requiredLevel}</h6>}
                                <h5>{recipe.name}</h5>
                                <div style={{display:'flex'}}>
                                    {recipe.resources.map(r=>
                                        <div style={{display:'flex'}}>
                                            <h5>{r.amount}</h5>
                                            {Icon(Resources[r.type].base64, '', true)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    <h5>Ready for Pickup</h5>
                    {items.map(b=>
                        <div onClick={b.time === 0 ? ()=>onAddConsumableToPlayer(b.type) : null} 
                             style={{display:'flex', cursor:'pointer', position:'relative'}}>
                            <div style={{position:'absolute', background:'black', opacity: 0.6, bottom:0, left:0, height: b.time+'%', width:'100%', transition:'height 250ms'}}/>
                            <div style={{backgroundImage:'url('+Consumables.find(c=>c.type === b.type).base64+')', backgroundSize:'cover', height:'32px', width:'32px'}}/>
                        </div>
                    )}
                </div> : <JobChooser type={JobType.HERBALIST} player={this.props.controlledPlayer}/>
                }
                {Button(true, onHideModal, 'Close')}
            </div>
        )
    }
}     