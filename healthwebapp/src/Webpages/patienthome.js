import * as React from "react";
import {Button} from "react-bootstrap";
import '../css/PatientHome.css';
import { LinkContainer } from "react-router-bootstrap";
//interface Props{}

export const PatientHome = () => {

    function clickRegisterDevice()
    {   
        console.log("Device registered successfully!")
    }
    function clickRegisterDoctor()
    {   
        console.log("Doctor registered successfully!")
    }
    return (
    <div className="Home">
        <div className="Title">  Welcome "Patient Name Here"  </div>
        <div className="Paragraph">Welcome to My Health Helper. This website enables you to record and and view your health data. By doing this, doctors can track your health condition and find trends that may indicate any possible health issues or risks that they can act on accordingly.</div>
        <div className="Paragraph">Please select the module you want to use from the list below. The register doctor module allows you to select the doctors who you want to see your health records. The record diet module allows you to record the food you are eating and the record exercise module allows you to record any exercise you've done. The my details module allows you to view the data you have entered into My Health Helper. Finally, the register external device module allows you to register a compatible Bluetooth device that can automatically send data to My Health Helper </div>
        <div className="Modules">
                <Button variant="primary" type="submit" className="ModuleButton" onClick={ clickRegisterDoctor()} >
                    Register Doctor
                </Button>
                <LinkContainer to="/Patient/Food-Intake" className="ModuleLinkContainer">
                <Button variant="primary" type="submit" className="ModuleButton" >
                    Record diet
                </Button>
                </LinkContainer>
                <LinkContainer to="/Patient/Exercise" className="ModuleLinkContainer">
                <Button variant="primary" type="submit" className="ModuleButton">
                    Record exercise
                </Button>
                </LinkContainer>
                <LinkContainer to="/Patient/MyDetails" className="ModuleLinkContainer">
                <Button variant="primary" type="submit" className="ModuleButton" >
                    My Details
                </Button>
                </LinkContainer>
                <Button variant="primary" type="submit" className="ModuleButton" onClick={ clickRegisterDevice()}>
                    Register External Device
                </Button>
            </div>  
            </div>  
    )
};