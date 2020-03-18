import * as React from "react";
import SocketContext from '../components/socket'
import {FormCheck} from 'react-bootstrap'


export default function PatientModuleToggle(props)
{
    const   [enabledToggle,setEnabledToggle] = React.useState(JSON.parse(props.appProps.myValue).moduleData.enabled)
    const   [labelText,setLabelText] = React.useState(getEnabledDisabledText(enabledToggle))
    React.useEffect(() => {

    },[]);
    // console.log( props.appProps)
    return(
        <FormCheck 
        type="switch"
        id={props.appProps.inc}
        label={labelText}
        value = {props.appProps.myValue}
        checked={enabledToggle}
        onChange = {patientModuleChanged}
        key = {props.appProps.inc} />
    )
    
    function patientModuleChanged(event) { //handles patient selection button being pressed
        var toggleSwitch = event.target; //gets patient id of button pressed
        let newState = !enabledToggle
        setEnabledToggle(newState)
        //console.log(enabledToggle)
        setLabelText(getEnabledDisabledText(newState))
        //toggleSwitchPos(toggleSwitchPos.checkboxChecked)
        var myValue = JSON.parse(toggleSwitch.value)
        myValue.moduleData.enabled = newState
        console.log(myValue)
    }
    
    function getEnabledDisabledText(enabled)
    {
        if(enabled)
        {
            return "Enabled"
        }
        else
        {
            return "Disabled"
        }
    }
}

