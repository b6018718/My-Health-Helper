import * as React from "react";
//interface Props{}
import { Button, Form, Nav, Navbar, FormControl, NavItem, Dropdown, DropdownButton, ButtonGroup, Image } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "../css/header.css";


export default function Header(props) {
    const [bloodSugarModule, setBloodSugarModule] = React.useState(""); //stores the html section for the patient's blood sugar data
    React.useEffect(() =>{
        if (props.appProps.isDoctor) { //Checks if user requesting record is a patient or doctor
            props.socket.emit("getMyPatientRecord", { selectedPatientID: props.appProps.currentSelectedPatient })//requests details for patient record from the back end server
        }//if user is a doctor, we need to pass user ID of selected patient to the database when making the data request
        else {
            props.socket.emit("getMyPatientRecord", {});//requests details for patient record from the back end server
        } //if user is a patient, the server  already knows their patient ID so we don't need to pass it to the server
        props.socket.on("getMyPatientRecordResults", function (data) { //listener for patiient details information back from back end server
            if (data.registeredDoctor == null) { //handles null values if patient has no registered doctors
                setPatientDoctor({ forename: "No doctor is registered,", surname: " please select a doctor using the change my doctor page", email: "N/A" })
            }
            else {
                setPatientDoctor(data.registeredDoctor);//stores doctor details from server
            }
            setBloodSugarModule(createBloodSugarModule(data.bloodSugarReadings)); //creates and stores html section for blood sugar section
        });
    },[]);
    
    
    function logOut(e) {
        // Log user out and set local authenticated value to false
        e.preventDefault();
        props.appProps.userHasAuthenticated(false);
    }

    function DrNotifications()
    {
        return <Dropdown.Item href="#/action-1">Dr TEST!</Dropdown.Item>;
    }
    function userNotifications()
    {
return <Dropdown.Item href="#/action-1">User TEST!</Dropdown.Item>;
    }

    return (
        <>
            {props.appProps.isAuthenticated ? // Check if user is signed in
                <Navbar bg="primary" expand="lg" variant="dark" role="navigation">
                    <Image src={require('../images/logo.png')} alt="logo"></Image>
                    <Navbar.Brand href="#">&nbsp; My Health Helper</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto" >

                            {!props.appProps.isDoctor ?
                                // Patient Navigation Bar
                                <Nav>
                                    <LinkContainer to="/Patient/Homepage">
                                        <Nav.Link>Home</Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/Patient/Food-Intake">
                                        <Nav.Link>Record Diet</Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/Patient/Exercise">
                                        <Nav.Link>Record Exercise</Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/Patient/MyDetails">
                                        <Nav.Link>My Details</Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to='/register/Select-Doctor'>
                                        <Nav.Link>Change My Doctor</Nav.Link>
                                    </LinkContainer>


                                    {
                                        //Notification Section for User
                                    }

                                    <Dropdown as={ButtonGroup}>
                                        <Button type="button" className="NotificationButton" variant="light" className="pull-right">
                                            <span className="NotificationText">Notifications</span><span className="badge badge-danger ml-2">113</span>
                                        </Button>
                                        <Dropdown.Toggle split variant="light" id="dropdown-split-basic" />
                                        <Dropdown.Menu>
                                        {userNotifications()}
                                        </Dropdown.Menu></Dropdown>
                                </Nav>
                                : // Doctor Navigation Bar
                                <Nav>
                                    <LinkContainer to="/HealthCareProfessional/Homepage">
                                        <Nav.Link>Home</Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/HealthCareProfessional/My-Patient-List">
                                        <Nav.Link>My Patients</Nav.Link>
                                    </LinkContainer>

                                    {
                                        //Notification Section for Dr
                                    }
                                    <Dropdown as={ButtonGroup}>
                                        <Button type="button" className="NotificationButton" variant="light" >
                                            <span className="NotificationText">Notifications</span><span className="badge badge-danger ml-2">1</span>
                                        </Button>
                                        <Dropdown.Toggle split variant="light" id="dropdown-split-basic" />
                                        <Dropdown.Menu>

                                          {DrNotifications()}
                                        </Dropdown.Menu></Dropdown>
                                </Nav>
                            }
                        </Nav>
                    </Navbar.Collapse>
                    <Form inline>
                        <Button onClick={logOut} variant="outline-light">Log out</Button>
                    </Form>
                </Navbar>

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