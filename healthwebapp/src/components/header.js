import * as React from "react";
//interface Props{}
import {Button, Form, Nav, Navbar, FormControl, NavItem, Dropdown, DropdownButton, ButtonGroup, Image} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "../css/header.css";


export default function Header(props){
    function logOut(e){
        e.preventDefault();
        props.appProps.userHasAuthenticated(false);
    }
    return(
        <>
            {props.appProps.isAuthenticated ? //(If someone is signed in)
                <Navbar bg="primary" variant="dark" role="navigation">
                    <Image src={require('../images/logo.png')}  alt="logo"></Image>
                    <Navbar.Brand href="#"> >My Health Helper</Navbar.Brand>                    
                        
                    <Nav className="mr-auto" >
                   
                        {!props.appProps.isDoctor ?
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


                                <Dropdown as={ButtonGroup}>
                                <Button type="button" className="NotificationButton" variant="light" className="pull-right">
                                    <span class="NotificationText">Notifications</span><span class="badge badge-danger ml-2">1</span>
                                    </Button>
                                <Dropdown.Toggle split variant="light" id="dropdown-split-basic" />
                                <Dropdown.Menu>
                                    <Dropdown.Item href="#/action-1">Welcome to the Patient Hub!</Dropdown.Item>
                                </Dropdown.Menu></Dropdown>                          
                                
                                
                                
                                
                            </Nav>
                            : //if they are a doctor, change the header buttons
                            <Nav>
                                <LinkContainer to="/HealthCareProfessional/Homepage">
                                    <Nav.Link>Home</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/HealthCareProfessional/My-Patient-List">
                                    <Nav.Link>My Patients</Nav.Link>
                                </LinkContainer>
                                <Dropdown as={ButtonGroup}>
                                <Button type="button" className="NotificationButton" variant="light" >
                                    <span class="NotificationText">Notifications</span><span class="badge badge-danger ml-2">1</span>
                                    </Button>
                                <Dropdown.Toggle split variant="light" id="dropdown-split-basic" />
                                <Dropdown.Menu>
                                    <Dropdown.Item href="#/action-1">Welcome back, Doctor.</Dropdown.Item>
                                </Dropdown.Menu></Dropdown>
                                
                            </Nav>

                        
                        }
                    </Nav>
                    
                    <Form inline>                        
                        <Button onClick={logOut} variant="outline-light">Log out</Button>
                    </Form>
                </Navbar>

                :
                <>
                    {!props.appProps.registering ?
                        <>
                        <Navbar bg="primary" variant="dark">
                            <Navbar.Brand>My Health Helper</Navbar.Brand>
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
                        <>
                        <Navbar bg="primary" variant="dark">
                            <Navbar.Brand>My Health Helper</Navbar.Brand>
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