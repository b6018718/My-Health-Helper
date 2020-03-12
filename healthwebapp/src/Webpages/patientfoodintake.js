import * as React from "react"; 
import {Button,  Dropdown, Image, ButtonGroup, Card, Toast} from "react-bootstrap";

import SocketContext from '../components/socket'
import '../css/PatientFoodIntake.css';

//interface Props{}

function PatientFoodIntakeWithoutSocket (props) {
    var sausageRoll = {calories: 362, name:"Sausage Roll", group:"Protein"};
    var cheeseSandwich = {calories: 261, name:"Cheese Sandwich", group:"Carbohydrates"};
    var kitKat = {calories: 108, name:"KitKat", group:"Sugar"};
    const [showSuccessMessage, setSuccessMessage] = React.useState(false);

    const toggleSuccessMessage = () => setSuccessMessage(!showSuccessMessage);

    var foodList = [];

    function sendFoodToDB(){
        if(foodList.length != 0){
            console.log(Date.now());
            props.socket.emit("recordFoodDiary", foodList);
            document.getElementById("Food").textContent = "Today's Food: ";
            foodList = [];
            setSuccessMessage(true);
            console.log(Date.now());
        }
    }
    
    function addFood(food){          
        document.getElementById("Food").textContent += '\r\n';  
        document.getElementById("Food").textContent += food.name;
        foodList.push(food);
    }

    return (
       <div className="bgContainer">
            <div className="container topPad">
                <div className="Title">Food Diary</div>
                <div className="Paragraph">Please add a food input.</div>   

                <div className="row">
                <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={require('../images/cheeseSandwich.png')} />
                <Card.Body>
                    <Card.Title>{cheeseSandwich.name}</Card.Title>
                    <Card.Text>
                    Calories: {cheeseSandwich.calories}
                    </Card.Text>
                <Button variant="primary" onClick={()=>addFood(cheeseSandwich)}>Add {cheeseSandwich.name}</Button>
                </Card.Body>
                </Card>

                <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={require('../images/kitKat.png')} />
                <Card.Body>
                    <Card.Title>{kitKat.name}</Card.Title>
                    <Card.Text>
                    Calories: {kitKat.calories}
                    </Card.Text>
                <Button variant="primary" onClick={()=>addFood(kitKat)}>Add {kitKat.name}</Button>
                </Card.Body>
                </Card>

                <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={require('../images/sausageRoll.png')} />
                <Card.Body>
                    <Card.Title>{sausageRoll.name}</Card.Title>
                    <Card.Text>
                    Calories: {sausageRoll.calories}
                    </Card.Text>
                <Button variant="primary" onClick={()=>addFood(sausageRoll)}>Add {sausageRoll.name}</Button>
                </Card.Body>
                </Card>
                </div>

                <div className="row foodBottom">
                    <div className="col">
                        <div className="EditableText foodList" id="Food">Today's Food: </div>
                        <Button onClick={() => sendFoodToDB()}>Submit Food</Button>
                    </div>
                </div>
                {showSuccessMessage ?
                    <Toast className="Toast" show={showSuccessMessage} onClose={toggleSuccessMessage}>
                    <Toast.Header>
                        <strong className="mr-auto">Food submitted</strong>
                    </Toast.Header>
                    <Toast.Body>{`Food submitted successfully`}</Toast.Body>
                </Toast>
                :
                <></>
                 }
            </div>
        </div>
        )
    };

const PatientFoodIntake = props => (
    <SocketContext.Consumer>
        {socket => <PatientFoodIntakeWithoutSocket {...props} socket={socket} />}
    </SocketContext.Consumer>
)

export default PatientFoodIntake;