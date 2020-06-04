import * as React from 'react';
import AppStyles, { colors } from '../../AppStyles';
import { Icon } from '../helpers/Shared'
import { Modal, BuildingType, AbilityKeys, Ability, SpellKeys, Spells, JobType } from '../../enum';
import CanvasFrame from './CanvasFrame';
import { connect } from 'react-redux';
import Stockpile from '../views/Stockpile';
import Archery from '../views/Archery';
import Engineering from '../views/Engineering';
import Herbalist from '../views/Herbalist';
import { Consumables } from '../../assets/data/Consumables';
import Lose from '../views/Lose';
import Blacksmith from '../views/Blacksmith';
import Inventory from '../views/Inventory';
import { Icons } from '../../assets/Assets';
import { onShowModal, onSelectPlayer } from '../uiManager/Thunks';
import Sanctum from '../views/Sanctum';
import { Resources } from '../../assets/data/Resources';
import { getPortrait } from '../helpers/Util';
import Armory from '../views/Armory';

interface Props {
    resources?:Resources
    modal?:BuildingType|Modal
    party?:Array<PlayerState>
    myId?:string
    waveTimer?:number
    buildings?:Array<BuildingState>
}

@(connect((state: RState) => ({
    resources: state.resources,
    modal: state.modal,
    party: state.party,
    myId: state.myId,
    waveTimer: state.waveTimer,
    buildings: state.buildings
})) as any)
export default class CanvasFrameChrome extends React.Component<Props> {

    getHPStyle = (hp:number, player:PlayerState) => {
        if(hp<=player.hp){
            if(player.hp > player.maxHp) return AppStyles.hpPillShielded
            return AppStyles.hpPillFull
        } 
        return AppStyles.hpPillEmpty
    }

    render(){
        const player = this.props.party.find(p=>p.controlledById === this.props.myId)
        return (
            <div style={{position:'relative', padding:'17px'}}>
                {this.props.modal === Modal.INVENTORY && 
                    <Inventory controlledPlayer={player} 
                               waveTimer={this.props.waveTimer}
                               resources={this.props.resources} />}
                {this.props.modal === BuildingType.STOCKPILE && 
                    <Stockpile 
                        resources={this.props.resources} 
                        controlledPlayer={player}/>}
                {this.props.modal === BuildingType.MAGE_TOWER && 
                    <Sanctum 
                        controlledPlayer={player}/>}
                {this.props.modal === BuildingType.ARCHERY && 
                    <Archery 
                        controlledPlayer={player}/>}
                {this.props.modal === BuildingType.ARMORY && 
                    <Armory 
                        controlledPlayer={player}/>}
                {this.props.modal === BuildingType.ENGINEER_GUILD && 
                    <Engineering 
                        controlledPlayer={player}/>}
                {this.props.modal === BuildingType.ALCHEMIST && 
                    <Herbalist 
                        building={this.props.buildings.find(b=>b.type === BuildingType.ALCHEMIST)}
                        resources={this.props.resources}
                        controlledPlayer={player}/>}
                {this.props.modal === BuildingType.BLACKSMITH && 
                    <Blacksmith 
                        building={this.props.buildings.find(b=>b.type === BuildingType.BLACKSMITH)}
                        resources={this.props.resources}
                        controlledPlayer={player}/>}
                {this.props.modal === Modal.LOSE && <Lose/>}

                {player && <div style={{display:'flex', position:'absolute', color:'yellow', top:0,left:0, width:'100%', padding:'5px', justifyContent:'space-between', border:'1px inset', backgroundImage: 'url('+require('../../assets/marble.png'), height:'25px'}}>
                    <h5>Resources</h5>
                    {(player.jobs[JobType.LABORER] || player.jobs[JobType.ENGINEER] || player.jobs[JobType.BLACKSMITH]) && 
                    Object.keys(this.props.resources.mineral).map(key=>
                            <div style={{display:'flex', alignItems:'flex-end', background:'black', border:'1px solid'}}>
                                {Icon(Resources[key].base64, '', true)}
                                <h5>{this.props.resources.mineral[key]}</h5>
                            </div>
                        )}
                    {(player.jobs[JobType.HERBALIST] || player.jobs[JobType.LABORER]) && 
                    Object.keys(this.props.resources.food).map(key=>
                            <div style={{display:'flex', alignItems:'flex-end', background:'black', border:'1px solid'}}>
                                {Icon(Resources[key].base64, '', true)}
                                <h5>{this.props.resources.food[key]}</h5>
                            </div>
                        )}
                    {(player.jobs[JobType.SCOUT] || player.jobs[JobType.BLACKSMITH]) && 
                    Object.keys(this.props.resources.parts).map(key=>
                            <div style={{display:'flex', alignItems:'flex-end', background:'black', border:'1px solid'}}>
                                {Icon(Resources[key].base64, '', true)}
                                <h5>{this.props.resources.parts[key]}</h5>
                            </div>
                        )}
                </div>}
                <div style={{position:'absolute', top:36,left:0, border:'1px inset', borderTop:'none', width:'225px', height:'20px', backgroundImage: 'url('+require('../../assets/marble.png')}}/>
                <div style={{position:'absolute', top:56,left:205, border:'1px inset', borderTop:'none', width:'20px', height:'198px', backgroundImage: 'url('+require('../../assets/marble.png')}}/>
                <div style={{position:'absolute', top:234,left:0, border:'1px inset', borderTop:'none', width:'225px',borderBottom:'none', height:'20px', backgroundImage: 'url('+require('../../assets/marble.png'), zIndex:1}}/>
                <div style={{position:'absolute', top:56,left:0, border:'1px inset', borderTop:'none',  width:'20px', height:'195px', backgroundImage: 'url('+require('../../assets/marble.png')}}/>
                {player && <div style={{position:'absolute', width:'225px', top:254, left:0, border:'1px solid', borderTop:'none', backgroundImage: 'url('+require('../../assets/marble.png')}}>
                    <div style={{display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-around', paddingBottom:'1em'}}>
                        {this.props.party.map(p=>
                            <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                <div onClick={()=>onSelectPlayer(p.id)} 
                                    style={{backgroundImage:'url('+getPortrait(p.jobs)+')', margin:'10px', width:'75px', height:'75px', backgroundSize:'cover', backgroundColor:'yellow', backgroundBlendMode:'darken', border: p.id === player.id ? '2px inset' : '2px outset', cursor:'pointer'}}/>
                                <div style={{display:'flex', maxWidth:'3em'}}>
                                    {new Array(p.maxHp).fill({}).map((slot,i)=><div style={this.getHPStyle(i+1, p)}/>)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>}
                <CanvasFrame />
                {player && 
                <div style={{display:'flex', position:'absolute', color:'yellow', bottom:0,left:0, width:'100%', padding:'5px', justifyContent:'space-between', border:'1px inset', backgroundImage: 'url('+require('../../assets/marble.png')}}>
                    <div style={{display:'flex', alignItems:'center'}}>
                        <div onClick={()=>onShowModal(Modal.INVENTORY)} 
                                style={{backgroundImage:'url('+getPortrait(player.jobs)+')', width:'75px', height:'75px', backgroundSize:'cover', backgroundColor:'yellow', backgroundBlendMode:'darken', border:'2px inset', cursor:'pointer'}}/>
                        <div style={{marginLeft:'0.5em'}}>
                            <div style={{display:'flex', marginLeft:'5px', marginBottom:'5px'}}>
                                {new Array(player.maxHp).fill({}).map((slot,i)=><div style={this.getHPStyle(i+1, player)}/>)}
                            </div>
                            <div style={{display:'flex'}}>
                                {player.abilities.map((abil,i)=>
                                    <div style={AppStyles.ability}>
                                        <div style={{position:'absolute', background:'black', opacity: 0.6, bottom:0, left:0, height: abil.cooldown+'%', width:'100%', transition:'height 250ms'}}/>
                                        <h5 style={{marginRight:'5px'}}>{AbilityKeys[i]}</h5>{Icon(Ability[abil.type].base64, Ability[abil.type].description, true)}
                                    </div>
                                )}
                                {player.spells.map((abil,i)=>
                                    <div style={AppStyles.ability}>
                                        <div style={{position:'absolute', background:'black', opacity: 0.6, bottom:0, left:0, height: abil.cooldown+'%', width:'100%', transition:'height 250ms'}}/>
                                        <h5 style={{marginRight:'5px'}}>{SpellKeys[i]}</h5>{Icon(Spells[abil.type].base64, Spells[abil.type].description, true)}
                                    </div>
                                )}
                                {player.consumables.map((key,i)=>
                                    <div style={{display:'flex', alignItems:'center'}}>
                                        <h5 style={{marginRight:'5px'}}>{i+1}</h5>{Icon(Consumables.find(c=>c.type===key).base64, Consumables.find(c=>c.type===key).name, true)}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
        )
    }
}