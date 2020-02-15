import * as React from "react";
import {Link} from "react-router-dom"
//interface Props{}
import {Button, Form, Col, Row, Toast} from "react-bootstrap";
import '../css/Login.css';
import '../css/Register.css';

// Socket provider
import SocketContext from '../components/socket'

function RegisterWithoutSocket(props){
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [forename, setForename] = React.useState("");
    const [surname, setSurname] = React.useState("");
    const [showFailMessage, setFailMessage] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const toggleFailMessage = () => setFailMessage(!showFailMessage);
    //props.addProps.isRegistering(true);
    React.useEffect(() => {
        props.appProps.isRegistering(true);
    }, [props.appProps.registering]);

    React.useEffect(() => {
        props.socket.on("logInResult", function(data){ 
            loading = false;
    
            props.appProps.userHasAuthenticated(data.result);
            if(data.result){
                props.appProps.userHasVerifiedDoctor(data.doctor);
                if(data.doctor) {
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

    function handleSubmit(event){
        // Log in system designed around code from https://serverless-stack.com/chapters/redirect-on-login.html
        event.preventDefault();

        if(!loading){
            loading = true;
            var doctor = true;
            if(event.target.value == 'patient')
                doctor = false;

            props.appProps.passUserFirstName(forename);
            props.appProps.passUserLastName(surname);
            props.appProps.passUserEmail(email);
            props.appProps.passUserPassword(password);

            props.socket.emit("signUp",
            {email: email, password: password, forename: forename, surname: surname, doctor: doctor});
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
