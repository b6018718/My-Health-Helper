import * as React from "react";
//interface Props{}
import { Button, Form, Nav, Navbar, FormControl, NavItem, Dropdown, DropdownButton, ButtonGroup, Image } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import SocketContext from './socket'

function AuthenticatedHeaderWithoutSocket(props)
{
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
        console.log(bloodSugarModule);
        return () => {
            props.socket.off("getMyPatientRecordResults"); //turns off listener sockets for receiving data
        }
    });
    props.socket.on("realTimeFingerPrickData", function (data) { //refreshes blood sugar section if any changes are made to the data on the database 
        setBloodSugarModule(createBloodSugarModule(data));
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

function createBloodSugarModule(dataList) { //creates html section for blood sugar data
    if (dataList !== null && dataList !== "" && dataList.fingerPrick !== [] && dataList.fingerPrick.length !== 0) { //checks data is not null
        var bloodSugarList = createBloodSugarList(dataList) //creates and stores list of readings to be used in html section
        return (bloodSugarList)
    }
    else {//if data is null, returns no data
        return (<Dropdown.Item href="#/action-1">No Notifications!</Dropdown.Item>)
    }
}

function createBloodSugarList(bloodSugarData) { //creates list of blood sugar data values
    var i = 0;//incremented to give list objects unique key values
    var listItemArray = [];//used to store list values
    var bloodSugarDataValues = bloodSugarData.fingerPrick.reverse(); //orders data so most recent data appears at the top of the list
    for (let bloodSugarDataValue of bloodSugarDataValues) {
            listItemArray.push(addItemToBloodSugarList(bloodSugarDataValue, i));//formats and pushs values into list
            i++; //increments unique key
    }
var returnedlistItemArray = listItemArray.slice(0, 10);

    return returnedlistItemArray; //returns list values
}


function addItemToBloodSugarList(data, i) {
    var date = new Date(data.time) //formats date 
       if(data.millimolesPerLitre <= 3 || data.millimolesPerLitre >= 9){// Checls if data is within the danger range 
            return (<Dropdown.Item variant="danger" key={i} >{data.millimolesPerLitre}{"mmol/L"} </Dropdown.Item>)
        }
}


return(
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
                        <span className="NotificationText">Recent Warnings</span><span className="badge badge-danger ml-2">ADD NUMBER HERE</span>
                    </Button>
                    <Dropdown.Toggle split variant="light" id="dropdown-split-basic" />
                    <Dropdown.Menu>
                        
                        {bloodSugarModule}
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
                        <span className="NotificationText">Recent Warnings</span><span className="badge badge-danger ml-2">1</span>
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
);
}
const AuthenticatedHeader = props => (
    <SocketContext.Consumer>
        {socket => <AuthenticatedHeaderWithoutSocket {...props} socket={socket} />}
    </SocketContext.Consumer>
)

export default AuthenticatedHeader;