import * as React from "react";
//interface Props{}
import { Button, } from "react-bootstrap";
//import '../css/Login.css';
import '../css/PatientSelectDoctor.css';
import '../css/Login.css';
import '../css/Register.css';
import SocketContext from '../components/socket'
function SelectDoctorWithoutSocket(props) {
    // Initialise doctor list
    const [doctorList, setDoctorList] = React.useState("");
    const [idSelected, setSelectedId] = React.useState("");

    React.useEffect(() => {
        props.socket.emit("getMyDoctor", {}); //requests current assigned doctor from alongside all doctors
        //props.socket.emit("getAllDoctors", {});

        props.socket.on("getAllDoctorsResults", function (data) {
            //console.log(data)
            setDoctorList(addDoctorList(data));
        });
        return () => {
            props.socket.off("getAllDoctorsResults");
        };
    }, []);

    React.useEffect(() => {
        props.socket.on("getMyDoctorResults", function (data) {
            setDoctorList(addDoctorList(data));
        });
        return () => {
            props.socket.off("getMyDoctorResults");
        };
    }, []);

    React.useEffect(() => {
        props.socket.on("updateAssignedDoctorResult", function (data) {
            props.history.push('/Patient/Homepage');
        });

        return () => {
            props.socket.off("updateAssignedDoctorResult");
        };
    }, []);


    function addDoctorList(data) {
        //console.log(data)
        var i = 0; //use for unique key for creating doctor list
        var buttonArray = [];//stores doctor button list
        var doctors = data.doctors;
        for (let doctor of doctors) { 
            buttonArray.push(addButtonToList(doctor, i, data.idAssignedDoctor)); //formats doctors as buttons and adds them to list
            i++;
        }
        return buttonArray;
    }

    function addButtonToList(doctor, inc, assignedId) {
        if (assignedId != null && assignedId === doctor._id) { // if current assigned doctor, formats their button as active
            var button = (<button type="button" key={inc} onClick={doctorClicked} value={doctor._id} className="list-group-item list-group-item-action active">{`${doctor.forename} ${doctor.surname}`}</button>)

        } else {//else return normal formatting for button
            var button = (<button type="button" key={inc} onClick={doctorClicked} value={doctor._id} className="list-group-item list-group-item-action">{`${doctor.forename} ${doctor.surname}`}</button>)
        }
        return button;
        //document.getElementById("doctorList").appendChild(button);
    }

    function doctorClicked(event) { //handles clicking on a doctor
        var buttonList = event.target.parentNode.childNodes;
        for (let button of buttonList) {//removes active class from all buttons
            button.classList.remove("active");
        }

        var button = event.target;
        setSelectedId(button.value);
        button.classList.add("active"); //adds active css class formatting to doctor button that was just clicked
    }

    function handleSubmit(event) {//handles submit button being pressed
        // Log in system designed around code from https://serverless-stack.com/chapters/redirect-on-login.html
        if (idSelected != "") {//handles if no doctor was selected
            props.socket.emit("updateAssignedDoctor", idSelected);//sends selected doctor to update registered doctor for current patient in the database
        }
    }

    //returns html for react export
    return (
        <div className="selectDoctor">
            <br></br>
            <div className="docContain">
                <div className="Title">Please select your doctor from the list below:</div>

                <div className="list-group">
                    {doctorList}
                </div>

                <br></br>

                <Button className="registerButton" variant="primary" type="submit" onClick={handleSubmit} value="patient">
                    Select Doctor
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