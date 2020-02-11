import * as React from "react";
//interface Props{}
import {Button, Form, Nav, Navbar, FormControl, NavItem} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "../css/header.css";

export default function Header(props){

    return(
        <span>
            {props.appProps.isAuthenticated ?
                <Navbar bg="primary" variant="dark">
                    <Navbar.Brand >My Health Healper</Navbar.Brand>
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
                            <Nav.Link to="#home">Home</Nav.Link>
                            <Nav.Link to="#features">Features</Nav.Link>
                            <Nav.Link to="#pricing">Pricing</Nav.Link>
                            </Nav>
                        }
                    </Nav>
                    <Form inline>
                    <Button variant="outline-light">Log out</Button>
                    </Form>
                </Navbar>

                :
                <div>
                    <Navbar bg="primary" variant="dark">
                        <Navbar.Brand href="/">My Health Healper</Navbar.Brand>
                        <Nav className="mr-auto">
                        </Nav>
                    </Navbar>
                </div>
            }
        </span>
            



    );

}