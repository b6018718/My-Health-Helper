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


function DrNotifications() {
    return <Dropdown.Item href="#/action-1">Dr TEST!</Dropdown.Item>;
}
function userNotifications() {
    return <Dropdown.Item href="#/action-1">User TEST!</Dropdown.Item>;
}


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