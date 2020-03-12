import * as React from "react";
import SocketContext from '../components/socket'
import '../css/PatientHome.css';
import { LinkContainer } from "react-router-bootstrap";
import { Button } from "react-bootstrap";

// Doctor Homepage
function DoctorHomeWithoutSocket(props) {
    let name = `${props.appProps.nAccLastName}`;
    return (
        <div className="Home">
            <div class="container">
                <div className="Title">
                    <img className="image" src={require('../images/doctor2.jpg')} height="100" width="75" alt="" />
                    Welcome Dr. {name}
                    <img className="image" src={require('../images/doctor.jpg')} height="100" width="66" alt="" />
                </div>
                <div className="Paragraph">Welcome to My Health Helper. This website allows you to view your patients' health data. You can track your patients' health conditions and find trends that may indicate any possible health issues or risks that you can act on accordingly.</div>
                <div className="Paragraph">Please select the module you want to use. The view patient details module allows you to select and view the details of patients who you are assigned to.</div>
                <div class="row"> <div className="Modules">
                    <LinkContainer to="/HealthCareProfessional/My-Patient-List">
                        <Button variant="primary" type="submit" className="ModuleButton" >
                            <span className="LargeText"> View patients </span>
                        </Button>
                    </LinkContainer>
                </div>
                </div>
            </div>

        </div>
    )
}

// Export the home page with the socket
const DoctorHome = props => (
    <SocketContext.Consumer>
        {socket => <DoctorHomeWithoutSocket {...props} socket={socket} />}
    </SocketContext.Consumer>
)
export default DoctorHome;