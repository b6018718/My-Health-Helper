import * as React from "react";
import { Link } from "react-router-dom"
import { Button, Form, Toast } from "react-bootstrap";
import '../css/Login.css';

// Socket provider
import SocketContext from '../components/socket'

function LoginWithoutSocket(props) {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [showFailMessage, setFailMessage] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const toggleFailMessage = () => setFailMessage(!showFailMessage);

    // Use effect, activates when the component is rendered in the DOM
    React.useEffect(() => {
        props.appProps.isRegistering(false);
    }, [props.appProps.registering]);

    /*
    The user logs into the system by sending authentication details
    to the server. The server then replies with if the users credentials
    worked or not. If the user fails an error message Toast will be displayed.
    If they pass then the user will be redirected to their appropriate
    homepage, depending on if they are a patient or a doctor.
    */

    React.useEffect(() => {
        // Calculates result from the back end
        props.socket.on("logInResult", function (data) {
            console.log(data)
            props.appProps.userHasAuthenticated(data.result);
            if (data.result) {
                props.appProps.userHasVerifiedDoctor(data.doctor);
                // Set details
                props.appProps.passUserFirstName(data.forename);
                props.appProps.passUserLastName(data.surname);

                if (data.doctor)
                    props.history.push('/HealthCareProfessional/Homepage');
                else
                    props.history.push('/Patient/Homepage');
            } else {
                setFailMessage(true);
                setErrorMessage(data.message);
            }
        });
        return () => {
            props.socket.off("logInResult");
        };
    }, []);

    function handleSubmit(event) {
        // Log in system designed around code from https://serverless-stack.com/chapters/redirect-on-login.html
        // Back end code https://dev.to/captainpandaz/a-socket-io-tutorial-that-isn-t-a-chat-app-with-react-js-58jh 

        event.preventDefault();

        // Send details to the server
        props.socket.emit("logIn", { email: email, password: password });
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
            {showFailMessage ?
                <Toast className="ToastLogin" show={showFailMessage} onClose={toggleFailMessage}>
                    <Toast.Header>
                        <strong className="mr-auto">Log In Error</strong>
                    </Toast.Header>
                    <Toast.Body>{errorMessage}</Toast.Body>
                </Toast>
                :
                <></>
            }

        </div>);
}

// Export with the socket
const Login = props => (
    <SocketContext.Consumer>
        {socket => <LoginWithoutSocket {...props} socket={socket} />}
    </SocketContext.Consumer>
)

export default Login;