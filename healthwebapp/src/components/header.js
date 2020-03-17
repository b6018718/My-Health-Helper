import * as React from "react";
//interface Props{}
import { Button, Form, Nav, Navbar, FormControl, NavItem, Dropdown, DropdownButton, ButtonGroup, Image } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import SocketContext from '../components/socket'
import "../css/header.css";
import authenticatedHeader from "./authenticatedHeader";


export default function Header(props) {
    const [bloodSugarModule, setBloodSugarModule] = React.useState(""); //stores the html section for the patient's blood sugar data
        React.useEffect(() => {
            if (props.appProps.isDoctor) { //Checks if user requesting record is a patient or doctor
                props.socket.emit("getMyPatientRecord", { selectedPatientID: props.appProps.currentSelectedPatient })//requests details for patient record from the back end server
            }//if user is a doctor, we need to pass user ID of selected patient to the database when making the data request
            else {
                props.socket.emit("getMyPatientRecord", {});//requests details for patient record from the back end server
            } //if user is a patient, the server  already knows their patient ID so we don't need to pass it to the server
            props.socket.on("getMyPatientRecordResults", function (data) { //listener for patiient details information back from back end server
                setBloodSugarModule(createBloodSugarModule(data.bloodSugarReadings)); //creates and stores html section for blood sugar section
                return () => {
                    props.socket.off("getMyPatientRecordResults"); //turns off listener sockets for receiving data
                }
            });
        }, []);
    

    function logOut(e) {
        // Log user out and set local authenticated value to false
        e.preventDefault();
        props.appProps.userHasAuthenticated(false);
    }

    function DrNotifications() {
        return <Dropdown.Item href="#/action-1">Dr TEST!</Dropdown.Item>;
    }
    function userNotifications() {
        return <Dropdown.Item href="#/action-1">User TEST!</Dropdown.Item>;
    }
    return (
        <>

            {props.appProps.isAuthenticated ? // Check if user is signed in
            
            <authenticatedHeader/>
                :
                <>
                    {!props.appProps.registering ?
                        // Log In Navigation Bar
                        <>
                            <Navbar bg="primary" variant="dark">
                                <Image src={require('../images/logo.png')} alt="logo"></Image>
                                <Navbar.Brand>&nbsp; My Health Helper</Navbar.Brand>
                                <Nav className="mr-auto">
                                </Nav>
                                <Form inline>
                                    <LinkContainer to="/register" activeClassName="">
                                        <Button onClick="" variant="outline-light">Register</Button>
                                    </LinkContainer>
                                </Form>
                            </Navbar>
                        </>
                        :
                        // Registration Navigation Bar
                        <>
                            <Navbar bg="primary" variant="dark">
                                <Image src={require('../images/logo.png')} alt="logo"></Image>
                                <Navbar.Brand>&nbsp; My Health Helper</Navbar.Brand>
                                <Nav className="mr-auto">
                                </Nav>
                                <Form inline>
                                    <LinkContainer to="/" activeClassName="">
                                        <Button onClick="" variant="outline-light">Log on</Button>
                                    </LinkContainer>
                                </Form>
                            </Navbar>
                        </>
                    }
                </>
            }
        </>
    );
}