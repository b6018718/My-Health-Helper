import * as React from "react";
//interface Props{}
import {Button, Form, Col, Row} from "react-bootstrap";
import '../css/PatientList.css';
import '../css/Register.css';
import '../css/nonDoctorList.css';
import SocketContext from '../components/socket'

//interface Props{}

function SelectPatientDetailsWithoutSocket(props){
    const [patientList, setPatientList] =  React.useState("");
    const [allNonDoctors, setAllNonDoctors] = React.useState("");
    
    
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

    React.useEffect(() => {
        props.socket.emit("getAllPatients", {});
        props.socket.on("getAllPatientsResults", function (data){
            setAllNonDoctors(addNonDoctorList(data));
        });
        return () => {
            props.socket.off("getAllPatients");
        };

    }, []);
    React.useEffect(() => {
        props.socket.on("patientRequest", function(data){ 
        });
    
        return () => {
            props.socket.off("patientRequest");
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
            buttonArray.push(<p className="Paragraph">No patients have selected you as their registered doctor. If you believe any of your patients are using this app, and that they should be sharing their data with you, please tell your patient to select you as their registered doctor for their account or send a request to become their doctor using the list below.</p>)
        }else
        {
            for(let patient of patients){
                buttonArray.push(addButtonToList(patient, i));
                i++;
            }
        }
        return buttonArray;
    }

    function addNonDoctorList(data)
    {
        var i = 0;
        var buttonArray =[];
        var nonDoctors = data.patients;
        if (nonDoctors.length == 0)
        {
            console.log("Went into no patients message");
            buttonArray.push(<p className="Paragraph">No patients to display.</p>)
        } else {
            for(let nonDoctor of nonDoctors){
                buttonArray.push(addNonPatientButtonToList(nonDoctor, i));
                i++;
            }
        }
        return buttonArray;
    }

    // 
    function addNonPatientButtonToList(nonDoctor, inc)
    {
        var button = (<button type="button" key={inc} onClick={sendPatientRequest} 
        value={nonDoctor._id} className="list-group-item list-group-item-action">{`${nonDoctor.forename} ${nonDoctor.surname}`}</button>)
        return button;
    }

    function addButtonToList(patient, inc)
    {
        var button = (<button type="button" key={inc} onClick={patientClicked} 
        value={patient._id} className="list-group-item list-group-item-action">{`${patient.forename} ${patient.surname}`}</button>)
        return button;
    }

    // Calls patient details for patient that is selected
    function patientClicked(event){
        var button = event.target;
        console.log(button.value);//TODO pass to patient details/record page
        props.appProps.setCurrentSelectedPatient(button.value);
        props.history.push('/HealthCareProfessional/Patient-Details');
    }

    //  Sends the request to the patient
    function sendPatientRequest(event){
        var button = event.target;
        console.log(button.value);
        if(window.confirm("Please confirm you want to send the request")){
            props.socket.emit("sendDoctorRequest", button.value)
        }

    }

    return (
        <div className = "selectPatient">
        <br></br>
        <div className="patientContain">
        <div className="Title">Please select your patient from the list below to see their patient record:</div>
    
            <div className = "list-group">
                {patientList}
            </div>
        <div className="selectNonDoctor">
            <br></br>
        </div>
        <div className="nonDoctorContain">
        <div className="Title">Select a patient to send request:</div>
        <div className = "list-group">
                {allNonDoctors}
            </div>
        </div>
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
