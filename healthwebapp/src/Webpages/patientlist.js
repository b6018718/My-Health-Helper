import * as React from "react";
//interface Props{}
//import { Button, Form, Col, Row } from "react-bootstrap";
import '../css/PatientList.css';
import '../css/Register.css';
import SocketContext from '../components/socket'

//interface Props{}

function SelectPatientDetailsWithoutSocket(props) {
    const [patientList, setPatientList] = React.useState("");//stores list of doctor's patients

    React.useEffect(() => {
        props.socket.emit("getMyPatients", {}); //requests list of patients from back end database
        props.socket.on("getMyPatientsResults", function (data) { //listens for patient list to be return from server
            //console.log(data)
            setPatientList(addPatientList(data));//creates and stores patient list
        });

        return () => {
            props.socket.off("getMyPatientsResults"); //closes listener
        };
    }, []);

    React.useEffect(() => {
        props.socket.on("getMyPatientsResults", function (data) {
            setPatientList(addPatientList(data));
        });
        return () => {
            props.socket.off("getMyPatientsResults");
        };
    }, []);

    function addPatientList(data) {
        var i = 0; //increments for unique key for bootstrap list
        var buttonArray = []; //array to store select patient buttons
        var patients = data.myPatients;
        //console.log(patients.length);
        //console.log(patients.length == 0);
        if (patients.length == 0) { //checks if doctor has 0 patients, if a doctor has no patients, return appropriate message stating so
            buttonArray.push(<p className="Paragraph">No patients have selected you as their registered doctor. If you believe any of your patients are using this app, and that they should be sharing their data with you, please tell your patient to select you as their registered doctor for their account.</p>)
        } else {
            for (let patient of patients) { //for size of patients list, format and push patient to list
                buttonArray.push(addButtonToList(patient, i));
                i++;
            }
        } //return buttonArray for selecting patients
        return buttonArray;
    }

    function addButtonToList(patient, inc) { //formats patients details into a html button
        var button = (<button type="button" key={inc} onClick={patientClicked}
            value={patient._id} className="list-group-item list-group-item-action">{`${patient.forename} ${patient.surname}`}</button>)
        return button;
        //document.getElementById("doctorList").appendChild(button);
    }

    function patientClicked(event) { //handles patient selection button being pressed
        var button = event.target; //gets patient id of button pressed
        //setSelectedId(button.value);
        //console.log(button.value);
        props.appProps.setCurrentSelectedPatient(button.value); //sets selected to patient id to be passed into next react view
        props.history.push('/HealthCareProfessional/Patient-Details'); //uses react router to go to patient details page
    }
    //returns patient list html for react export
    return (
        <div className="selectPatient">
            <br></br>
            <div className="patientContain">
                <div className="Title">Please select your patient from the list below to see their patient record:</div>

                <div className="list-group">
                    {patientList}
                </div>

                <br></br>
            </div>
        </div>
    )

}

const PatientList = props => (
    <SocketContext.Consumer>
        {socket => <SelectPatientDetailsWithoutSocket {...props} socket={socket} />}
    </SocketContext.Consumer>
)
export default PatientList;
