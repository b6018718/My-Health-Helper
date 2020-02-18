import * as React from "react"; 
import {Button,  Dropdown, Image, ButtonGroup, Card} from "react-bootstrap";

//interface Props{}

export const PatientFoodIntake = (props) => {
       

    return (
       
        <div class="container">
            <div className="Title">  Food Logger  </div>
            <div className="Paragraph">Please add a food input.</div>   

            <div className="row">
            <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={require('../images/cheeseSandwich.png')} />
            <Card.Body>
                <Card.Title>Cheese Sandwich</Card.Title>
                <Card.Text>
                Calories: 261
                </Card.Text>
                <Button variant="primary" onClick={()=>addFood('Cheese Sandwich')}>Add Cheese Sandwich</Button>
            </Card.Body>
            </Card>

            <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={require('../images/kitKat.png')} />
            <Card.Body>
                <Card.Title>KitKat</Card.Title>
                <Card.Text>
                Calories: 230
                </Card.Text>
                <Button variant="primary" onClick={()=>addFood('KitKat')}>Add KitKat</Button>
            </Card.Body>
            </Card>

            <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={require('../images/sausageRoll.png')} />
            <Card.Body>
                <Card.Title>Sausage Roll</Card.Title>
                <Card.Text>
                Calories: 362
                </Card.Text>
                <Button variant="primary" onClick={()=>addFood('Sausage Roll')}>Add Sausage Roll</Button>
            </Card.Body>
            </Card>   
            </div>

            <div className="row">
            <div className="EditableText" id="Food">Today's Food: </div>
            </div>
        </div> 
        )
         };

         function addFood(food){          
            document.getElementById("Food").textContent += '\r\n';  
            document.getElementById("Food").textContent += food;
      }