import * as React from "react";
import {Link} from "react-router-dom"
//interface Props{}
import {Button, Form, Col, Row} from "react-bootstrap";
//import '../css/Login.css';
import '../css/PatientDetails.css';
//import '../css/Login.css';
//import '../css/Register.css';
import SocketContext from '../components/socket'

//interface Props{}
function DisplayPatientDetailsWithoutSocket(props)
{
    const [patientRecord, setPatientRecord] = React.useState("");

    React.useEffect(() => {
        if(props.appProps.isDoctor)
        {
        
        }
        else
        {
            props.socket.emit("getMyPatientRecord", {});
            props.socket.on("getMyPatientRecordResults", function (data){
                console.log(data)
                setPatientRecord(data);
            });
    
            return () => {
                props.socket.off("getMyPatientRecordResults");
            };
        }
            
    }, []);

    React.useEffect(() => {
        if(props.appProps.isDoctor)
        {
        
        }
        else
        {
            props.socket.on("getMyPatientRecordResults", function (data){
                console.log(data)
                setPatientRecord(data);
            });
    
            return () => {
                props.socket.off("getMyPatientRecordResults");
            };
        }
            
    }, []);

    if(props.appProps.isDoctor)
    {
    return (<div className = "PatientDetails">   
    test doctor page
    
    </div>)
    }
    else
    {

            return (<div className = "PatientDetails">   
            <div className="Title">My patient record</div>
                <div className = "Paragraph"> 
                    <div>Name: {props.appProps.nAccFirstName} {props.appProps.nAccLastName}</div>
                    <div>Email: {props.appProps.nAccEmail}</div>
                    <div>Registered doctor: {patientRecord.forename} {patientRecord.surname} </div>
                </div>
            </div>)
    }

}


const PatientDetails = props => (
    <SocketContext.Consumer>
        {socket => <DisplayPatientDetailsWithoutSocket {...props} socket={socket} />}
    </SocketContext.Consumer>
)
export default PatientDetails;