import * as React from "react";
import {Link} from "react-router-dom"
//interface Props{}
import {Button, Form, Col, Row} from "react-bootstrap";
import '../css/Login.css';
import '../css/Register.css';

export default function Register(props){
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [forename, setForename] = React.useState("");
    const [surname, setSurname] = React.useState("");
    //props.addProps.isRegistering(true);
    React.useEffect(() => {
        props.appProps.isRegistering(true);
    }, [props.appProps.registering]);


    function handleSubmit(event){
        // Log in system designed around code from https://serverless-stack.com/chapters/redirect-on-login.html
        event.preventDefault();
        var doctor;
        if(event.target.value == 'patient')
            doctor = false;
        else
            doctor = true;
        // 1. Authenticate
        props.appProps.socket.emit("signUp", {email: email, password: password, forename: forename, surname: surname, doctor: doctor});
        // 2. Check permissions
    }

    props.appProps.socket.on("logInResult", function(data){ 

        props.appProps.userHasAuthenticated(true);
        props.appProps.userHasVerifiedDoctor(data.doctor);

        if(data.doctor)
            props.history.push('/HealthCareProfessional/Homepage');
        else
            props.history.push('/Patient/Homepage');
    });
    

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
        {/* <Link to="/Patient/Homepage">Example Link To Patient Homepage</Link> */}
    
     </div>);
}

