import * as React from "react";
import {Link} from "react-router-dom"
//interface Props{}
import {Button, Form, Col, Row, Toast} from "react-bootstrap";
//import '../css/Login.css';
import '../css/PatientSelectDoctor.css';
//import '../css/Login.css';
import '../css/Register.css';
import SocketContext from '../components/socket'


function SelectDoctorWithoutSocket(props){
    // Initialise doctor list
    const [doctorList, setDoctorList] = React.useState("");
    const [idSelected, setSelectedId] = React.useState("");
    const [requestedDoctorChange, setRequestedDcotorChange] = React.useState("");

    // Get the doctor assigned to the current patient
    React.useEffect(() => {
        props.socket.emit("getMyDoctor", {});
        //props.socket.emit("getAllDoctors", {});
        
        props.socket.on("getAllDoctorsResults", function (data){
            //console.log(data)
            setDoctorList(addDoctorList(data));
        });
        return () => {
            props.socket.off("getAllDoctorsResults");
        };
    }, []);

    React.useEffect(() => {
        props.socket.on("getMyDoctorResults", function (data){
            setDoctorList(addDoctorList(data));
        });
        return () => {
            props.socket.off("getMyDoctorResults");
        };
    }, []);


    React.useEffect(() => {
        props.socket.on("updateAssignedDoctorResult", function(data){ 
            props.history.push('/Patient/Homepage');
        });

        return () => {
            props.socket.off("updateAssignedDoctorResult");
        };
    }, []);

    // Gets the request data
    React.useEffect(() => {
        props.socket.emit("hasChangeRequest", {});
        setRequestedDcotorChange("");
    }, []);

    React.useEffect(() => {
        props.socket.on("hasRequest", function(data){
            setRequestedDcotorChange(data.doc)
        });
        return () => {
            props.socket.off("hasRequest");
        };
    })

    function addDoctorList(data)
    {
        var i = 0;
        var buttonArray =[];
        var doctors = data.doctors;
        for(let doctor of doctors){
            buttonArray.push(addButtonToList(doctor, i, data.idAssignedDoctor));
            i++;
        }
        return buttonArray;
    }

    function addButtonToList(doctor, inc, assignedId)
    {
        if(assignedId != null && assignedId == doctor._id){
            var button = (<button type="button" key={inc} onClick={doctorClicked} value={doctor._id} className="list-group-item list-group-item-action active">{`${doctor.forename} ${doctor.surname}`}</button>)
        
        } else {
            var button = (<button type="button" key={inc} onClick={doctorClicked} value={doctor._id} className="list-group-item list-group-item-action">{`${doctor.forename} ${doctor.surname}`}</button>)
        }
        return button;
    }

    function doctorClicked(event){
        var buttonList = event.target.parentNode.childNodes;
        for (let button of buttonList){
            button.classList.remove("active");
        }

        var button = event.target;
        setSelectedId(button.value);
        button.classList.add("active");
    }

    function handleSubmit(event){
        // Log in system designed around code from https://serverless-stack.com/chapters/redirect-on-login.html
        if(idSelected != ""){
            //console.log(idSelected)
            props.socket.emit("updateAssignedDoctor", idSelected);
        }
    }

    // 
    function acceptDoctorChange(event){
        props.socket.emit("acceptDoctorRequest", {})
        setRequestedDcotorChange("");
        props.history.push('/patient/Homepage');
    }

    function cancelRequest(event){
        props.socket.emit("cancelDoctorRequest", {})
        setRequestedDcotorChange("");
    }

    return(
        
    <div className = "selectDoctor">
        
        <div className="docContain">
        <div className="Title">Please select your doctor from the list below:</div>

            <div className = "list-group">
                {doctorList}
            </div>

            <br></br>
            
            <Button className="registerButton" variant="primary" type="submit" onClick={handleSubmit} value="patient">
                        Select Doctor
            </Button>
        </div>

        {(requestedDoctorChange != "") ? 
        
            <Toast className="Toast" >
                <Toast.Header>
                    <strong className="mr-auto"> You have recieved a request to change doctor!</strong>
                </Toast.Header>
                <Toast.Body>
                    {'Dr. ' + requestedDoctorChange.surname + ` has requested to become your primary health care offical`}
                    <div>
                    <Button onClick={acceptDoctorChange}>
                        Accept
                    </Button>
                    <Button onClick={cancelRequest}>
                        Cancel
                    </Button>
                    </div>
                </Toast.Body>
            </Toast>
        
        :
        <></>
        }
    </div>
    )
}

const SelectDoctor = props => (
    <SocketContext.Consumer>
        {socket => <SelectDoctorWithoutSocket {...props} socket={socket} />}
    </SocketContext.Consumer>
)

export default SelectDoctor;