import * as React from "react";
import {Link} from "react-router-dom"
//interface Props{}
import {Button, Form, Col, Row} from "react-bootstrap";
//import '../css/Login.css';
import '../css/PatientSelectDoctor.css'
import '../css/Login.css';
import '../css/Register.css';

export default function Register(props){



    function handleSubmit(event){
        // Log in system designed around code from https://serverless-stack.com/chapters/redirect-on-login.html

        console.log(props.appProps.nAccFirstName)
        console.log(props.appProps.nAccLastName)
        console.log(props.appProps.nAccEmail)
        console.log(props.appProps.nAccPassword)
            //props.history.push('/Patient/Homepage');
    }
return(
    <div className = "selectDoctor">
selectDoctor here

<Button className="registerButton" variant="primary" type="submit" onClick={handleSubmit} value="patient">
                    Register as Patient
                </Button>
    </div>
)
}
