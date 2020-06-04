import * as React from 'react'
import AppStyles from '../../AppStyles';
import { TopBar, Button, Icon, NumericInput, LightButton, ButtonStrip } from '../helpers/Shared'
import { Buildings } from '../../assets/data/Buildings'
import { JobType } from '../../enum';
import { onStartPlacingBuilding, onHideModal } from '../uiManager/Thunks';
import JobChooser from './JobChooser';
import { Resources } from '../../assets/data/Resources';

interface Props{
    resources: Resources
    controlledPlayer: PlayerState
}

export default class Stockpile extends React.PureComponent<Props> {

    render(){
        const jobs = this.props.controlledPlayer.jobs
        return (
            <div style={{...AppStyles.modal, height:'250px', width:'400px', justifyContent:'space-between', background:'black'}}>
                {jobs[JobType.LABORER] ?
                <div style={{height:'100%', overflow:"auto"}}>
                    {Buildings.filter(b=>b.requiredLevel < 3).map(b=>
                        <div onClick={()=>onStartPlacingBuilding(b.type)} style={{display:'flex', cursor:'pointer', opacity: b.requiredLevel <= jobs[JobType.LABORER].level ? 1 : 0.5, pointerEvents: b.requiredLevel <= jobs[JobType.LABORER].level ? 'all' : 'none'}}>
                            <div style={{backgroundImage:'url('+b.base64+')', backgroundSize:'cover', height:'64px', width:'64px'}}/>
                            <div>
                                {b.requiredLevel > jobs[JobType.LABORER].level && <h6 style={{color:'red'}}>Requires LAB lvl {b.requiredLevel}</h6>}
                                <h5>{b.name}</h5>
                                <div style={{display:'flex'}}>
                                    {b.resources.map(r=>
                                        <div style={{display:'flex'}}>
                                            <h5>{r.amount}</h5>
                                            {Icon(Resources[r.type].base64, '', true)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div> : <JobChooser type={JobType.LABORER} player={this.props.controlledPlayer}/>
                }
                {Button(true, onHideModal, 'Close')}
            </div>
        )
    }
}     