import * as React from "react";
import {Button} from "react-bootstrap";
import '../css/PatientHome.css';
import { LinkContainer } from "react-router-bootstrap";

// Socket provider
import SocketContext from '../components/socket'

function PatientHomeWithoutSocket(props) {
    const [fingerPrickActivated, setFingerPrickActivated] = React.useState(false);
    console.log(fingerPrickActivated);
    function clickRegisterDevice(){
        if(!fingerPrickActivated){
            props.socket.emit("subscribeToFingerPrick", {});
        } else {
            props.socket.emit("unSubscribeFingerPrick", {});
        }
        setFingerPrickActivated(!fingerPrickActivated);
    }

    React.useEffect(() => {
        props.socket.emit("checkIfSubscribed", {});
    }, []);

    React.useEffect(() => {
        props.socket.on("checkIfSubscribedResults", function (data){
            if(data.result != fingerPrickActivated)
                setFingerPrickActivated(data.result);
        });
        return () =>{
            props.socket.off("checkIfSubscribedResults");
        }
    }, []);

    React.useEffect(() => {
        props.socket.on("fingerPrickData", function(data){ 
            console.log(data);
        });
        return () => {
            props.socket.off("fingerPrickData");
        };
    }, []);

    let name = `${props.appProps.nAccFirstName} ${props.appProps.nAccLastName}`;
    return (
    <div className="Home">
        <div class="container">
            <div className="Title">  Welcome {name} </div>
            <div className="Paragraph">Welcome to My Health Helper. This website enables you to record and and view your health data. By doing this, doctors can track your health condition and find trends that may indicate any possible health issues or risks that they can act on accordingly.</div>
            <div className="Paragraph">Please select the module you want to use from the list below. The register doctor module allows you to select the doctors who you want to see your health records. The record diet module allows you to record the food you are eating and the record exercise module allows you to record any exercise you've done. The my details module allows you to view the data you have entered into My Health Helper. Finally, the register external device module allows you to register a compatible Bluetooth device that can automatically send data to My Health Helper </div>
            
            <div class = "row"> <div className="Modules">
                    <LinkContainer to="/Patient/Food-Intake">
                    <Button variant="primary" type="submit" className="ModuleButton" >
                       <span className="LargeText"> Record Diet </span>
                    </Button>
                    </LinkContainer>
                    <LinkContainer to="/Patient/Exercise" className="ModuleLinkContainer">
                    <Button variant="primary" type="submit" className="ModuleButton">
                    <span className="LargeText">Record Exercise</span>
                    </Button>
                    </LinkContainer>
                    <LinkContainer to="/Patient/MyDetails" className="ModuleLinkContainer">
                    <Button variant="primary" type="submit" className="ModuleButton" >
                    <span className="LargeText"> My Details</span>
                    </Button>
                    </LinkContainer>
                    </div>
                    <div className='Modules'>
                    {fingerPrickActivated ?
                        <>
                        <Button variant="primary" type="submit" className="ModuleButton" onClick={clickRegisterDevice}>
                        <span className="LargeText">Deactivate Finger Prick Device</span>
                        </Button>
                        </>
                    :
                        <>
                        <Button variant="primary" type="submit" className="ModuleButton" onClick={clickRegisterDevice}>
                        <span className="LargeText">Register Finger Prick Device</span>
                        </Button>
                        </>
                    }
                    </div>
                </div>

                <div class = "row"> 
                <div className="Paragraph"> Warnings: Lorem ipsum da </div>
                </div>
            </div>
        </div>  
    )
};

const PatientHome = props => (
    <SocketContext.Consumer>
        {socket => <PatientHomeWithoutSocket {...props} socket={socket} />}
    </SocketContext.Consumer>
)

export default PatientHome;