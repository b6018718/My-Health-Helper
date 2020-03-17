import * as React from "react";
//interface Props{}
import { Button, Form, Nav, Navbar, FormControl, NavItem, Dropdown, DropdownButton, ButtonGroup, Image } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import SocketContext from '../components/socket'
import "../css/header.css";
import authenticatedHeader from "./authenticatedHeader";


export default function Header(props) {
    function logOut(e) {
        // Log user out and set local authenticated value to false
        e.preventDefault();
        props.appProps.userHasAuthenticated(false);
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