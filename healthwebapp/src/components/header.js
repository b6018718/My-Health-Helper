import * as React from "react";
//interface Props{}
import { Button, Form, Nav, Navbar, FormControl, NavItem, Dropdown, DropdownButton, ButtonGroup, Image } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "../css/header.css";


export default function Header(props) {
    function logOut(e) {
        // Log user out and set local authenticated value to false
        e.preventDefault();
        props.appProps.userHasAuthenticated(false);
    }

    React.useEffect (() => {
        console.log(props.appProps)
    },[props.appProps])
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
                                    <Dropdown as={ButtonGroup}>
                                        <Button type="button" className="NotificationButton" variant="light" className="pull-right">
                                            <span className="NotificationText">Notifications</span><span className="badge badge-danger ml-2">113</span>
                                        </Button>
                                        <Dropdown.Toggle split variant="light" id="dropdown-split-basic" />
                                        <Dropdown.Menu>
                                            <Dropdown.Item href="#/action-1">Welcome to the Patient Hub!</Dropdown.Item>
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
                                    <LinkContainer to="/HealthCareProfessional/Select-Patient-Modules"> 
                                        <Nav.Link>Manage Paitent Modules</Nav.Link>
                                    </LinkContainer>
                                    <Dropdown as={ButtonGroup}>
                                        <Button type="button" className="NotificationButton" variant="light" >
                                            <span className="NotificationText">Notifications</span><span className="badge badge-danger ml-2">1</span>
                                        </Button>
                                        <Dropdown.Toggle split variant="light" id="dropdown-split-basic" />
                                        <Dropdown.Menu>
                                            <Dropdown.Item href="#/action-1">Welcome back, Doctor.</Dropdown.Item>
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