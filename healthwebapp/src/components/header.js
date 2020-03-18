import * as React from "react";
//interface Props{}
import { Button, Form, Nav, Navbar, FormControl, NavItem, Dropdown, DropdownButton, ButtonGroup, Image } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "../css/header.css";
import SocketContext from '../components/socket'

function DisplayHeaderWithoutSocket(props) {
    const [myPatientHeader,setMyPatientHeader] = React.useState(<div></div>)

    function logOut(e) {
        // Log user out and set local authenticated value to false
        e.preventDefault();
        props.appProps.userHasAuthenticated(false);
        setMyPatientHeader(<div></div>) //resets user's module header upon logging out
    }

    React.useEffect (() => {
        if(props.appProps.isAuthenticated)
        {
            props.socket.emit("getMyPatientHeaderLinks", {}) //request custom header from server based on patient's approved modules
            props.socket.on("myPatientHeaderLinksResult", function (data) { 
                setMyPatientHeader(createPatientHeaderLinks(data.enabledHeaderNav))
            });
            return () => {
                props.socket.off("myPatientHeaderLinksResult"); //turns off listener sockets for receiving data
            }
        }
         //creates and returns list of link buttons using enabled link modules from the server
        function createPatientHeaderLinks(data)
        {
            
            let linkButtons = []
            for(let module of data)
            {
                linkButtons.push(createPatientHeaderLink(module))
            }
            return  (                
            <>
                {linkButtons}
            </>
            )
             
        }
          //creates individual link button
        function createPatientHeaderLink(data)
        {
            return(
            <LinkContainer to={data.urlLink}>
                <Nav.Link>{data.navBarName}</Nav.Link>
            </LinkContainer>
            )
        }
    },[props.appProps.isAuthenticated])
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
                                    {myPatientHeader}
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

const Header = props => ( //Calls function to create html page to be exported
    <SocketContext.Consumer>
        {socket => <DisplayHeaderWithoutSocket {...props} socket={socket} />}
    </SocketContext.Consumer>
)
export default Header; //Exports header