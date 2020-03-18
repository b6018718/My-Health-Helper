import * as React from "react";
import SocketContext from './socket'
import {FormCheck,Button} from 'react-bootstrap'


export default function AltFunctionButton(props)
{
    React.useEffect(() => {
        console.log(props.appProps)
    },[]);
    // console.log( props.appProps)
    return(
        <>
        { props.appProps.toggleConditon ?
            <>
                <Button variant="primary" type="submit" className="ModuleButton" onClick={() => {handleMainAction()}}>
                    <span className="LargeText">{props.appProps.nameMain}</span>
                </Button>
            </>
            :
            <>
                <Button variant="primary" type="submit" className="ModuleButton" onClick={() => {handAltAction()}}>
                    <span className="LargeText">{props.appProps.nameAlt}</span>
                </Button>
            </>
        }
        </>
    )

    function handleMainAction()
    {
        console.log(props.appProps.toggleConditon)
        props.appProps.functionMain()
    }
    function handAltAction()
    {
        console.log(props.appProps.toggleConditon)
        props.appProps.functionAlt()
    }

}

