import * as React from "react";
//interface Props{}
//import { Button, Form, Col, Row } from "react-bootstrap";
import '../css/SelectPatientModules.css';
import '../css/Register.css';
import SocketContext from '../components/socket'
//import { ListGroup } from "react-bootstrap";
import Table from 'react-bootstrap/Table'
//interface Props{}

function SelectPatientModulesWithoutSocket(props) {
    const [patientModuleList, setPatientList] = React.useState("");//stores list of doctor's patients

    React.useEffect(() => {
        props.socket.emit("getMyPatientsModules", {}); //requests list of patients from back end database
        props.socket.on("getMyPatientsModulesResults", function (data) { //listens for patient list to be return from server
            //console.log(data)
            setPatientList(addPatientList(data));//creates and stores patient list
        });

        return () => {
            props.socket.off("getMyPatientsModulesResults"); //closes listener
        };
    }, []);

    React.useEffect(() => {
        props.socket.on("getMyPatientsModulesResults", function (data) {
            setPatientList(addPatientList(data));
        });
        return () => {
            props.socket.off("getMyPatientsModulesResults");
        };
    }, []);

    function addPatientList(data) {
        var i = 0; //increments for unique key for bootstrap list
        var buttonArray = []; //array to store select patient buttons
        var tableHead = [];
        var patients = data.myPatients;
        var patientList
        //console.log(patients.length);
        //console.log(patients.length == 0);
        if (patients.length == 0) { //checks if doctor has 0 patients, if a doctor has no patients, return appropriate message stating so
            patientList = (<p className="Paragraph">No patients have selected you as their registered doctor. If you believe any of your patients are using this app, and that they should be sharing their data with you, please tell your patient to select you as their registered doctor for their account.</p>)
        } else {
            const walk = patients[0].enabledModules.length//to increment inc based on number of modules to ensure all modules buttons have unique keys
            tableHead.push(<th class = "tableAlignLeft">Patient name</th>)//create table heading
            for(let module of patients[0].enabledModules)
            {
            tableHead.push(<th>{module.moduleName} module</th>)
            }
            for (let patient of patients) { //for size of patients list, format and push patient to list
                buttonArray.push(addPatientToList(patient, i));
                i+= walk;
            }
            patientList =(<Table responsive striped bordered hover>
                  <thead><tr>{tableHead}</tr></thead>
                  <tbody>{buttonArray}</tbody>
                  </Table>)
        } //return buttonArray for selecting patients
        return patientList;
    }

    function addPatientToList(patient, inc) { //formats patients details into a html button
        var toggleButtonList = []
        for(let module of patient.enabledModules)
        {
            toggleButtonList.push(addModuleToPatient(patient._id,module,inc))
            inc++
        }
        var button = (<button type="button" key={inc} onClick={patientModuleClicked}
            value={patient._id} >{`${patient.forename} ${patient.surname}`}</button>)
        return (
        <tr><td class="tableAlignLeft">{`${patient.forename} ${patient.surname}`}</td>{toggleButtonList}</tr>
        );

    }

    function addModuleToPatient(patientID,module,inc)
    {
    return (<td><button type="button" key = {inc} onClick={patientModuleClicked} value = { {patientID: patientID, moduleID: module.moduleID}}>{module.moduleName}</button></td>)
    }

    function patientModuleClicked(event) { //handles patient selection button being pressed
        var button = event.target; //gets patient id of button pressed
        //setSelectedId(button.value);
        //console.log(button.value);
        props.appProps.setCurrentSelectedPatient(button.value); //sets selected to patient id to be passed into next react view
        props.history.push('/HealthCareProfessional/Patient-Details'); //uses react router to go to patient details page
    }
    //returns patient list html for react export
    return (
        <div class="selectPatient">
            <br></br>
            <div class="patientContain">
                <div class="Title">Please select the modules you want your patients to have access to from the list below:</div>
                    {patientModuleList}
                <br></br>
            </div>
        </div>
    )

}

const PatientModulesList = props => (
    <SocketContext.Consumer>
        {socket => <SelectPatientModulesWithoutSocket {...props} socket={socket} />}
    </SocketContext.Consumer>
)
export default PatientModulesList;
