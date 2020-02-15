import * as React from "react";
import {Link} from "react-router-dom"
//interface Props{}
import {Button, Form, Col, Row} from "react-bootstrap";
//import '../css/Login.css';
import '../css/PatientSelectDoctor.css';
import '../css/Login.css';
import '../css/Register.css';
import SocketContext from '../components/socket'


function SelectDoctorWithoutSocket(props){
    // Initialise doctor list
    const [doctorList, setDoctorList] = React.useState("");
    const [idSelected, setSelectedId] = React.useState("");

    React.useEffect(() => {
        props.socket.emit("getAllDoctors", {});
        
        props.socket.on("getAllDoctorsResults", function (data){
            console.log(data)
            setDoctorList(addDoctorList(data));
        });

        return () => {
            props.socket.off("getAllDoctorsResults");
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

    
    function addDoctorList(data)
    {
        var i = 0;
        var buttonArray =[];
        for(let doctor of data){
            buttonArray.push(addButtonToList(doctor, i));
            i++;
        }
        return buttonArray;
    }

    function addButtonToList(doctor, inc)
    {
        var button = (<button type="button" key={inc} onClick={doctorClicked} value={doctor._id} className="list-group-item list-group-item-action">{`${doctor.forename} ${doctor.surname}`}</button>)
        return button;
        //document.getElementById("doctorList").appendChild(button);
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
            props.socket.emit("updateAssignedDoctor", idSelected);
        }
    }


    return(
    <div className = "selectDoctor">
        <br></br>
        <div className="docContain">
        <div className="Title">Please select your doctor from the list below:</div>

            <div className = "list-group">
                {doctorList}
            </div>
    
            <br></br>
            
            <Button className="registerButton" variant="primary" type="submit" onClick={handleSubmit} value="patient">
                        Register as Patient
            </Button>
        </div>
    </div>
    )
}

const SelectDoctor = props => (
    <SocketContext.Consumer>
        {socket => <SelectDoctorWithoutSocket {...props} socket={socket} />}
    </SocketContext.Consumer>
)

export default SelectDoctor;