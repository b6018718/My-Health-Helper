import * as React from "react";
import {Link} from "react-router-dom"
//interface Props{}
import {Button, Form} from "react-bootstrap";
import '../css/Login.css';

export default function Login(props){
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    // Use effect, activates when the component is rendered in the DOM
    React.useEffect(() => {
        props.appProps.isRegistering(false);
    }, [props.appProps.registering]);

    function handleSubmit(event){
        // Log in system designed around code from https://serverless-stack.com/chapters/redirect-on-login.html

        event.preventDefault();
        // 1. Authenticate
        
        // 2. Check permissions

        // 3. Redirect
        props.appProps.userHasAuthenticated(true);

        // STUB -- Change this to make the server return if the doctor is a patient or a doctor
        var doctor = false;
        props.appProps.userHasVerifiedDoctor(doctor);


        props.appProps.userIsAuthenticed = true;
        if(doctor)
            props.history.push('/HealthCareProfessional/Homepage');
        else
            props.history.push('/Patient/Homepage');
    }

    return (
    <div className="Login">  
        <div className="Title">My Health Helper</div>
        <Form className="Form" onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" onChange={e => setEmail(e.target.value)} />
                <Form.Text className="text-muted">
                If you don't already have an account, register one <Link to="/register">here</Link>.
                </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
            </Form.Group>
            <div className="Button">
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </div>
        </Form>
        {/* <Link to="/Patient/Homepage">Example Link To Patient Homepage</Link> */}
    
     </div>);
}

