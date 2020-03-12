import * as React from "react";
import { Link } from "react-router-dom"
//interface Props{}
import { Button, Form, Col, Row, Toast } from "react-bootstrap";
import '../css/Login.css';
import '../css/Register.css';



// Socket provider
import SocketContext from '../components/socket'

function RegisterWithoutSocket(props) {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [forename, setForename] = React.useState("");
    const [surname, setSurname] = React.useState("");
    const [sex, setSex] = React.useState(null)
    const [DoB, setDoB] = React.useState(null)
    const [mobile, setMobile] = React.useState(null)
    const [telephone, setTelephone] = React.useState(null)
    const [address, setAddress] = React.useState(null)
    const [NHSnumber, setNHSnumber] = React.useState(null)
    const [showFailMessage, setFailMessage] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const toggleFailMessage = () => setFailMessage(!showFailMessage);
    //props.addProps.isRegistering(true);
    React.useEffect(() => {
        props.appProps.isRegistering(true);
    }, [props.appProps.registering]);

    React.useEffect(() => {
        props.socket.on("logInResult", function (data) {
            loading = false;

            props.appProps.userHasAuthenticated(data.result);
            if (data.result) {
                props.appProps.userHasVerifiedDoctor(data.doctor);
                if (data.doctor) {
                    props.history.push('/HealthCareProfessional/Homepage');
                } else {
                    props.history.push('/register/Select-Doctor');
                }
            } else {
                setFailMessage(true);
                setErrorMessage(data.message);
            }
        });
        return () => {
            props.socket.off("logInResult");
        };
    }, []);

    var loading;
    function checkIsValidPhoneNumber(number) {
        return (/^([0-9]{11})$/.test(number) || number == "" || number == null || /^([0-9]{5}[ ]{1}[0-9]{6})$/.test(number))
    }
    function checkIsValidNHSNumber(number) {
        return (/^([0-9]{10})$/.test(number) || number == "" || number == null || /^([0-9]{3}[ ]{1}[0-9]{3}[ ]{1}[0-9]{4})$/.test(number))
    }
    function handleSubmit(event) {
        // Log in system designed around code from https://serverless-stack.com/chapters/redirect-on-login.html
        event.preventDefault();

        if (!loading) {
            loading = true;
            var doctor = true;
            if (event.target.value == 'patient')
                doctor = false;

            props.appProps.passUserFirstName(forename);
            props.appProps.passUserLastName(surname);
            props.appProps.passUserEmail(email);
            props.appProps.passUserPassword(password);
            if (sex == "Please select") {
                setSex(null)
            }

            if (checkIsValidPhoneNumber(mobile) && (checkIsValidPhoneNumber(telephone))) {
                if (checkIsValidNHSNumber(NHSnumber)) {
                    props.socket.emit("signUp",
                        {
                            email: email, password: password, forename: forename, surname: surname, doctor: doctor,
                            sex: sex, DoB: DoB, mobile: mobile, telephone: telephone, address: address, NHSnumber: NHSnumber
                        });
                }
                else {
                    setErrorMessage("Please check you have entered valid NHS Number")
                    toggleFailMessage()
                }
            }
            else {
                setErrorMessage("Please check you have entered a valid phone number for telephone and mobile number fields")
                toggleFailMessage()
            }

        }
    }

    return (
        <div className="Login">
            <div className="Title">Register Account</div>
            <Form className="Form">
                <Row>
                    <Col>
                        <Form.Group controlId="formForename">
                            <Form.Label>Forename</Form.Label>
                            <Form.Control type="text" placeholder="Forename" onChange={e => setForename(e.target.value)} />
                            <Form.Text className="text-muted">
                            </Form.Text>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formSurname">
                            <Form.Label>Surname</Form.Label>
                            <Form.Control type="text" placeholder="Surname" onChange={e => setSurname(e.target.value)} />
                            <Form.Text className="text-muted">
                            </Form.Text>
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
                    <Form.Text className="text-muted">
                    </Form.Text>
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                </Form.Group>
                <div>Additional demographic information for paitent registration:</div>
                <div className="simpleBorder">
                    <Row>
                        <Col>
                            <Form.Group controlId="formBasicSex">
                                <Form.Label>Sex</Form.Label>
                                <Form.Control as="select" placeholder="--Please select--" onChange={e => setSex(e.target.value)}>
                                    <option>Please select</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                    <option>Prefer not to say</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formBasicDoB">
                                <Form.Label>Date of Birth</Form.Label>
                                <Form.Control placeholder="DoB" type="date" onChange={e => setDoB(e.target.value)} norequire />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="formBasicMobile">
                                <Form.Label>Mobile</Form.Label>
                                <Form.Control placeholder="Mobile no" type="tel" pattern="[0-9]{11}" onChange={e => setMobile(e.target.value)} norequire />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formBasicTelephone">
                                <Form.Label>Telephone</Form.Label>
                                <Form.Control placeholder="Telephone no" type="tel" pattern="[0-9{11}]" onChange={e => setTelephone(e.target.value)} norequire />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group controlId="formBasicAddress">
                        <Form.Label>Address</Form.Label>
                        <Form.Control placeholder="Address" onChange={e => setAddress(e.target.value)} norequire />
                    </Form.Group>
                    <Form.Group controlId="formBasicNHSNumber">
                        <Form.Label>NHS Number</Form.Label>
                        <Form.Control placeholder="123 123 1234" onChange={e => setNHSnumber(e.target.value)} norequire />
                    </Form.Group>
                </div>
                <div className="Button">
                    <Button className="registerButton" variant="primary" type="submit" onClick={handleSubmit} value="doctor">
                        Register as Doctor
                </Button>
                    <Button className="registerButton" variant="primary" type="submit" onClick={handleSubmit} value="patient">
                        Register as Patient
                </Button>
                </div>
            </Form>
            {showFailMessage ?
                <Toast className="Toast" show={showFailMessage} onClose={toggleFailMessage}>
                    <Toast.Header>
                        <strong className="mr-auto">Log In Error</strong>
                    </Toast.Header>
                    <Toast.Body>{errorMessage}</Toast.Body>
                </Toast>
                :
                <></>
            }

        </div>
    );
}

const Register = props => (
    <SocketContext.Consumer>
        {socket => <RegisterWithoutSocket {...props} socket={socket} />}
    </SocketContext.Consumer>
)



export default Register;

