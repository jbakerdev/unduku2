import * as React from 'react'
import AppStyles from '../../AppStyles';
import { Button, Icon } from '../helpers/Shared'
import { JobType, Spells, ResourceType, Ability } from '../../enum';
import { onHideModal, onAddSpell, onReplaceSpell } from '../uiManager/Thunks';
import JobChooser from './JobChooser';
import { Resources } from '../../assets/data/Resources';

interface Props{
    controlledPlayer: PlayerState
}

export default class Sanctum extends React.PureComponent<Props> {

    state = { showReplace: null }

    tryAddAbility = (ability:Ability) => {
        if(this.props.controlledPlayer.spells.length === 2){
            this.setState({ showReplace: ability })
        }
        else onAddSpell({type: ability.type, ...Spells[ability.type].defaultState})
    }

    render(){
        return (
            <div style={{...AppStyles.modal, height:'250px', width:'400px', justifyContent:'space-between', background:'black'}}>
                {this.props.controlledPlayer.jobs[JobType.MAGE] ?
                <div style={{height:'100%', overflow:"auto", position:'relative'}}>
                    <h5>Welcome back, Magus</h5>
                    {Object.keys(Spells).map(key=>
                        <div style={{display:'flex', alignItems:'center'}} 
                             onClick={()=>this.tryAddAbility(Spells[key])}>
                            {Icon(Resources[ResourceType.LORE].base64, '', true)} 
                            <h6>:{Spells[key].loreCost}</h6>
                            <h6 style={{marginRight:'1em', marginLeft:'1em'}}>{Icon(Spells[key].base64, '', true)}</h6> 
                            <h6>{Spells[key].description}</h6>
                        </div>
                    )}
                    {this.state.showReplace && 
                        <div style={{position:'absolute', background:'black', top:0, left:0}}>
                            <h5>Replace which spell?</h5>
                            {this.props.controlledPlayer.spells.map((s,i)=>
                                <div onClick={()=>{onReplaceSpell(this.state.showReplace,i);this.setState({showReplace:false})}}>
                                    {Icon(Spells[s.type].base64, '', true)} : {Spells[s.type].description}
                                </div>
                            )}
                            {Button(true, ()=>this.setState({showReplace: null}), 'Cancel')}
                        </div>
                    }
                </div> : <JobChooser type={JobType.MAGE} player={this.props.controlledPlayer}/>
                }
                {Button(true, onHideModal, 'Close')}
            </div>
        )
    }
}     