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
        props.socket.emit("getMyPatients", {});
        props.socket.on("getMyPatientsResults", function (data){
            console.log(data)
            setPatientList(addPatientList(data));
        });

        return () => {
            props.socket.off("getMyPatientsResults");
        };
    }, []);

    React.useEffect(() => {
        props.socket.on("getMyPatientsResults", function (data){
            setPatientList(addPatientList(data));
        });
        return () => {
            props.socket.off("getMyPatientsResults");
        };
    }, []);

    function addPatientList(data)
    {
        var i = 0;
        var buttonArray =[];
        var patients = data.myPatients;
        console.log(patients.length);
        console.log(patients.length == 0);
        if (patients.length == 0)
        {
            console.log("Went into no patients message");
            buttonArray.push(<p className="Paragraph">No patients have selected you as their registered doctor. If you believe any of your patients are using this app, and that they should be sharing their data with you, please tell your patient to select you as their registered doctor for their account.</p>)
        }else
        {
            for(let patient of patients){
                buttonArray.push(addButtonToList(patient, i));
                i++;
            }
        }
        return buttonArray;
    }

    function addButtonToList(patient, inc)
    {
        var button = (<button type="button" key={inc} onClick={patientClicked} 
        value={patient._id} className="list-group-item list-group-item-action">{`${patient.forename} ${patient.surname}`}</button>)
        return button;
        //document.getElementById("doctorList").appendChild(button);
    }

    function patientClicked(event){
        var button = event.target;
        //setSelectedId(button.value);
        console.log(button.value);//TODO pass to patient details/record page
        props.appProps.setCurrentSelectedPatient(button.value);
        props.history.push('/HealthCareProfessional/Patient-Details');
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
