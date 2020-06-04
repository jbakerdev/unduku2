import * as React from 'react'
import AppStyles from '../../AppStyles';
import { TopBar, Button, Icon, NumericInput, LightButton, ButtonStrip } from '../helpers/Shared'

interface Props{
}

export default class Lose extends React.PureComponent<Props> {

    render(){
        return (
            <div style={{...AppStyles.modal, height:'250px', width:'400px', justifyContent:'space-between', background:'black', textAlign:'center'}}>
                end of world
                {Button(true, ()=>window.location.reload(), 'Restart')}
            </div>
        )
    }
}
