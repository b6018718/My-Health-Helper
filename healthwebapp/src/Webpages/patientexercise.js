import * as React from "react";
import {Button, Card, FormGroup, Form, Toast} from "react-bootstrap";

import SocketContext from '../components/socket';
import '../css/PatientFoodIntake.css';

function PatientExerciseWithoutSocket (props) {
    var cycling = {exercisetype: "High", exercisename:"Cycling"};
    var swimming = {exercisetype: "Mid", exercisename:"Swimming"};
    var yoga = {exercisetype: "Low", exercisename:"Yoga"};
    var walking = {exercisetype: "Low", exercisename:"Walking"};
    const [showSuccessMessage, setSuccessMessage] = React.useState(false);

    const toggleSuccessMessage = () => setSuccessMessage(!showSuccessMessage);

    var exerciseList = [];

    function sendExerciseToDB(){
        if(exerciseList.length != 0){
            props.socket.emit("recordExerciseDiary", exerciseList);
            reset();
            setSuccessMessage(true);
        }
    }

    function reset(){
        document.getElementById("Exercise").textContent = "Today's Exercise:";
        exerciseList = [];
        document.getElementById("swimmingTime").value = "";
        document.getElementById("cyclingTime").value = "";
        document.getElementById("yogaTime").value = "";
    }
    
    function addExercise(exercise, time){

        if(time != ""){
            // Get minutes
            var time = time.split(':'); // split it at the colons
            // Hours are worth 60 minutes.
            var minutes = (+time[0]) * 60 + (+time[1]);
            // Add text
            document.getElementById("Exercise").textContent += '\r\n';  
            document.getElementById("Exercise").textContent += exercise.exercisename;
            // Add minutes to a new exercise object
            var exerciseClone = JSON.parse(JSON.stringify(exercise));
            exerciseClone["exercisedurationmins"] = minutes;
            exerciseList.push(exerciseClone);
        }
    }

    return (
        <div className="bgContainer">
            <div className="container topPad">
                <div className="Title">Exercise Diary</div>
                <div className="Paragraph">Please add an exercise input.</div>   

                <div className="row">
                <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={require('../images/swimming.jpg')} />
                <Card.Body>
                    <Card.Title>{swimming.exercisename}</Card.Title>
                    <Form onSubmit={e => {e.preventDefault();}}>
                        <div className='row center'>
                            <Card.Text className='durationLabel'>
                                Duration:
                            </Card.Text>
                            <FormGroup>
                                <input type="time" name="time" id="swimmingTime" placeholder="time placeholder" required/>
                            </FormGroup>
                        </div>
                    <Button type="submit" variant="primary" onClick={()=>addExercise(swimming, document.getElementById("swimmingTime").value)}>Add {swimming.exercisename}</Button>
                    </Form>
                </Card.Body>
                </Card>

                <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={require('../images/cycling.jpg')} />
                <Card.Body>
                    <Card.Title>{cycling.exercisename}</Card.Title>
                    <Form onSubmit={e => {e.preventDefault();}}>
                        <div className='row center'>
                            <Card.Text className='durationLabel'>
                                Duration:
                            </Card.Text>
                            <FormGroup>
                                <input type="time" name="time" id="cyclingTime" placeholder="time placeholder" required/>
                            </FormGroup>
                        </div>
                        <Button type="submit" variant="primary" onClick={()=>addExercise(cycling, document.getElementById("cyclingTime").value)}>Add {cycling.exercisename}</Button>
                    </Form>
                </Card.Body>
                </Card>

                <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={require('../images/yoga.jpg')} />
                <Card.Body>
                    <Card.Title>{yoga.exercisename}</Card.Title>
                    <Form onSubmit={e => {e.preventDefault();}}>
                        <div className='row center'>
                            <Card.Text className='durationLabel'>
                                Duration:
                            </Card.Text>
                            <FormGroup>
                                <input type="time" name="time" id="yogaTime" placeholder="time placeholder" required/>
                            </FormGroup>
                        </div>
                        <Button type="submit" variant="primary" onClick={()=>addExercise(yoga, document.getElementById("yogaTime").value)}>Add {yoga.exercisename}</Button>
                    </Form>
                </Card.Body>
                </Card>

                </div>

                <div className="row foodBottom">
                    <div className="col">
                        <div className="EditableText foodList" id="Exercise">Today's Exercise: </div>
                        <Button className="padButton" onClick={() => reset()}>Reset</Button>
                        <Button className="padButton" onClick={() => sendExerciseToDB()}>Submit Exercise</Button>
                    </div>
                </div>
                {showSuccessMessage ?
                    <Toast className="Toast" show={showSuccessMessage} onClose={toggleSuccessMessage}>
                    <Toast.Header>
                        <strong className="mr-auto">Exercise submitted</strong>
                    </Toast.Header>
                    <Toast.Body>{`Exercise submitted successfully`}</Toast.Body>
                </Toast>
                :
                <></>
                 }
            </div>
        </div>
    )
};

// Walking Card
/*<Card style={{ width: '18rem' }}>
<Card.Img variant="top" src={require('../images/walking.jpg')} />
<Card.Body>
    <Card.Title>{walking.exercisename}</Card.Title>
    <Card.Text>
    </Card.Text>
<Button variant="primary" onClick={()=>addExercise(walking)}>Add {walking.exercisename}</Button>
</Card.Body>
</Card>*/

const PatientExercise = props => (
    <SocketContext.Consumer>
        {socket => <PatientExerciseWithoutSocket {...props} socket={socket} />}
    </SocketContext.Consumer>
)

export default PatientExercise;