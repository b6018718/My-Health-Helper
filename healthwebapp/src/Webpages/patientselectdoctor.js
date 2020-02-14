import * as React from "react";
import {Link} from "react-router-dom"
//interface Props{}
import {Button, Form, Col, Row} from "react-bootstrap";
//import '../css/Login.css';
import '../css/PatientSelectDoctor.css'
import '../css/Login.css';
import '../css/Register.css';
import OverflowScrolling from 'react-overflow-scrolling'
import * as ScrollArea from "react-scrollbar";

export default function Register(props){

    
    function addDoctorList(doctorList)
    {
        var i;
        var buttonArray =[];
        for (i = 0; i < 100; i++){
        buttonArray.push(addButtonToList("New doctor: " + i.toString()));
        }
        return buttonArray;
    }
    function addButtonToList(btnText, inc)
    {
        var button = (<button type="button" key={inc} className="list-group-item list-group-item-action">{btnText}</button>)
        return button;
        //document.getElementById("doctorList").appendChild(button);
    }
    const doctorList = addDoctorList("Test")
    function handleSubmit(event){
        // Log in system designed around code from https://serverless-stack.com/chapters/redirect-on-login.html

        console.log(props.appProps.nAccFirstName)
        console.log(props.appProps.nAccLastName)
        console.log(props.appProps.nAccEmail)
        console.log(props.appProps.nAccPassword)
            //props.history.push('/Patient/Homepage');
    }//"list-group-item list-group-item-action active"
    /*        <button type="button" class="list-group-item list-group-item-action active">
    Cras justo odio
  </button>
  <button type="button" class="list-group-item list-group-item-action">Dapibus ac facilisis in</button> */
return(
    <div className = "selectDoctor">
        <br></br>
        <div className="docContain">
        <div className="Title">Please select your doctor from the list below:</div>

            <div className = "list-group">
                {doctorList}
            </div>
    
            <br></br>
            
            <Button className="registerButton" variant="primary" type="submit" onClick={handleSubmit} value="patient">
                        Register as Patient
            </Button>
        </div>
    </div>
)
}
