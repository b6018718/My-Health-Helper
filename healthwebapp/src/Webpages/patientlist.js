import * as React from "react";
//interface Props{}
import {Button, Form, Col, Row} from "react-bootstrap";
import '../css/PatientList.css';
import '../css/Register.css';
import SocketContext from '../components/socket'

//interface Props{}

function SelectPatientDetailsWithoutSocket(props){
    const [patientList, setPatientList] = React.useState("");
    const [idSelected, setSelectedId] = React.useState("");
    React.useEffect(() => {
        props.socket.emit("getAllDoctors", {});
        
        props.socket.on("getAllDoctorsResults", function (data){
            console.log(data)
            setPatientList(addPatientList(data));
        });

        return () => {
            props.socket.off("getAllDoctorsResults");
        };
    }, []);

    function addPatientList(data)
    {
        var i = 0;
        var buttonArray =[];
        for(let patient of data){
            buttonArray.push(addButtonToList(patient, i));
            i++;
        }
        return buttonArray;
    }

    function addButtonToList(patient, inc)
    {
        var button = (<button type="button" key={inc} //onClick={doctorClicked} 
        value={patient._id} className="list-group-item list-group-item-action">{`${patient.forename} ${patient.surname}`}</button>)
        return button;
        //document.getElementById("doctorList").appendChild(button);
    }

    return (
        <div className = "selectPatient">
        <br></br>
        <div className="patientContain">
        <div className="Title">Please select your patient from the list below to see their patient record:</div>

            <div className = "list-group">
                {patientList}
            </div>
    
            <br></br>
        </div>
    </div>
    )

}
/*
export const PatientList = () => {
    return (
        <div className = "selectPatient">
        <br></br>
        <div className="patientContain">
        <div className="Title">Please select your patient from the list below to see their patient record:</div>

            <div className = "list-group">
                {patientList}
            </div>
    
            <br></br>
        </div>
    </div>
    )
};*/

const PatientList = props => (
    <SocketContext.Consumer>
        {socket => <SelectPatientDetailsWithoutSocket {...props} socket={socket} />}
    </SocketContext.Consumer>
)
export default PatientList;
