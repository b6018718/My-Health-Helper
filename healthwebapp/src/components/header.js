import * as React from "react";
//interface Props{}
import {Button, Form, Nav, Navbar, FormControl, NavItem} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "../css/header.css";

export default function Header(props){
    function logOut(e){
        e.preventDefault();
        props.appProps.userHasAuthenticated(false);
    }

    return(
        <span>
            {props.appProps.isAuthenticated ?
                <Navbar bg="primary" variant="dark">
                    <Navbar.Brand >My Health Helper</Navbar.Brand>
                    <Nav className="mr-auto">
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
                            </Nav>
                            :
                            <Nav>
                                <LinkContainer to="/HealthCareProfessional/Homepage">
                                    <Nav.Link>Home Page</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/HealthCareProfessional/My-Patient-List">
                                    <Nav.Link>My Patients</Nav.Link>
                                </LinkContainer>
                            </Nav>
                        }
                    </Nav>
                    <Form inline>
                        <Button onClick={logOut} variant="outline-light">Log out</Button>
                    </Form>
                </Navbar>

                :
                <div>
                    <Navbar bg="primary" variant="dark">
                        <Navbar.Brand href="/">My Health Helper</Navbar.Brand>
                        <Nav className="mr-auto">
                        </Nav>
                    </Navbar>
                </div>
            }
        </span>
    );

}