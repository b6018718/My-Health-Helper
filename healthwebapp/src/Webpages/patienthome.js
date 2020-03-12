import * as React from "react";
import { Button, Modal, ListGroup, Spinner } from "react-bootstrap";
import '../css/PatientHome.css';
import { LinkContainer } from "react-router-bootstrap";

// Socket provider
import SocketContext from '../components/socket'

function PatientHomeWithoutSocket(props) {
    const [fingerPrickActivated, setFingerPrickActivated] = React.useState(false);
    const [showModal, setShowModal] = React.useState(false);
    const [bluetoothSelected, setBluetoothSelected] = React.useState(false);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    /*
    User clicks the register blood sugar device,
    depending on the status of the button, either
    the user is added to or removed from the
    simulated sensor on the server.
    */
    function clickRegisterDevice() {
        if (!fingerPrickActivated) {
            props.socket.emit("subscribeToFingerPrick", {});
        } else {
            props.socket.emit("unSubscribeFingerPrick", {});
        }
        setFingerPrickActivated(!fingerPrickActivated);
        setBluetoothSelected(false);
    }

    React.useEffect(() => {
        // Emit the request to the server to set the status of the button
        props.socket.emit("checkIfSubscribed", {});
    }, []);

    React.useEffect(() => {
        // Check if already subscribed to set the button on page load
        props.socket.on("checkIfSubscribedResults", function (data) {
            if (data.result != fingerPrickActivated)
                setFingerPrickActivated(data.result);
        });
        return () => {
            props.socket.off("checkIfSubscribedResults");
        }
    }, []);

    React.useEffect(() => {
        // Debug information for finger prick simulated sensor
        props.socket.on("fingerPrickData", function (data) {
            console.log(data);
        });
        return () => {
            props.socket.off("fingerPrickData");
        };
    }, []);

    var tick;
    var spinner;
    function bluetoothClicked(event) {
        // Set the button to be blue
        setBluetoothSelected(false);
        var buttonList = event.target.parentNode.childNodes;
        for (let button of buttonList) {
            button.classList.remove("active");
        }

        // Add the bootstrap active element to the button
        var button = event.target;
        button.classList.add("active");
        tick = event.target.childNodes[1];
        spinner = event.target.childNodes[2];

        // Add the spinner to simulate connecting to the sensor
        spinner.classList.remove("hide");
        setTimeout(function () {
            spinner.classList.add("hide");
            tick.classList.remove("hide");
            setBluetoothSelected(true);
        }, 3000);
    }

    let name = `${props.appProps.nAccFirstName} ${props.appProps.nAccLastName}`;
    return (
        <div className="Home">
            <div class="container">
                <div className="Title">  Welcome {name} </div>
                <div className="Paragraph">Welcome to My Health Helper. This website enables you to record and and view your health data. By doing this, doctors can track your health condition and find trends that may indicate any possible health issues or risks that they can act on accordingly.</div>
                <div className="Paragraph">Please select the module you want to use from the list below. The register doctor module allows you to select the doctors who you want to see your health records. The record diet module allows you to record the food you are eating and the record exercise module allows you to record any exercise you've done. The my details module allows you to view the data you have entered into My Health Helper. Finally, the register external device module allows you to register a compatible Bluetooth device that can automatically send data to My Health Helper </div>

                <div class="row"> <div className="Modules">
                    <LinkContainer to="/Patient/Food-Intake">
                        <Button variant="primary" type="submit" className="ModuleButton" >
                            <span className="LargeText"> Record Diet </span>
                        </Button>
                    </LinkContainer>
                    <LinkContainer to="/Patient/Exercise" className="ModuleLinkContainer">
                        <Button variant="primary" type="submit" className="ModuleButton">
                            <span className="LargeText">Record Exercise</span>
                        </Button>
                    </LinkContainer>
                    <LinkContainer to="/Patient/MyDetails" className="ModuleLinkContainer">
                        <Button variant="primary" type="submit" className="ModuleButton" >
                            <span className="LargeText"> My Details</span>
                        </Button>
                    </LinkContainer>
                </div>
                    <div className='Modules'>
                        {fingerPrickActivated ?
                            <>
                                <Button variant="primary" type="submit" className="ModuleButton" onClick={clickRegisterDevice}>
                                    <span className="LargeText">Deactivate Finger Prick Device</span>
                                </Button>
                            </>
                            :
                            <>
                                <Button variant="primary" type="submit" className="ModuleButton" onClick={handleShow}>
                                    <span className="LargeText">Register Finger Prick Device</span>
                                </Button>
                            </>
                        }
                    </div>
                </div>

                <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Select a Bluetooth Connection</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ListGroup>
                            <ListGroup.Item action onClick={bluetoothClicked}>
                                One Plus ZR 27G: Bluetooth
                                <span className='tick hide'>✓</span>
                                <Spinner className='rightSpinner hide' animation="border" size='sm' />
                            </ListGroup.Item>
                            <ListGroup.Item action onClick={bluetoothClicked}>
                                Samsung Galaxy M4 Edition: Bluetooth
                                <span className='tick hide'>✓</span>
                                <Spinner className='rightSpinner hide' animation="border" size='sm' />
                            </ListGroup.Item>
                            <ListGroup.Item action onClick={bluetoothClicked}>
                                moto g(6) plus: Bluetooth
                                <span className='tick hide'>✓</span>
                                <Spinner className='rightSpinner hide' animation="border" size='sm' />
                            </ListGroup.Item>
                        </ListGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                    </Button>
                        <Button variant="primary" disabled={!bluetoothSelected} onClick={() => { clickRegisterDevice(); handleClose(); }}>
                            Establish Connection
                    </Button>
                    </Modal.Footer>
                </Modal>

                <div class="row">
                    <div className="Paragraph">  </div>
                </div>
            </div>
        </div>
    )
};

const PatientHome = props => (
    <SocketContext.Consumer>
        {socket => <PatientHomeWithoutSocket {...props} socket={socket} />}
    </SocketContext.Consumer>
)

export default PatientHome;