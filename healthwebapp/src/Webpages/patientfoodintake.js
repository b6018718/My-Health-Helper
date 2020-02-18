import * as React from "react"; 
import {Button,  Dropdown, Image, ButtonGroup} from "react-bootstrap";

//interface Props{}

export const PatientFoodIntake = (props) => {
       

    return (
       
        <div class="container">
            <div className="Title">  Food Logger  </div>
            <div className="Paragraph">Please add a food input.</div>
            <div className="EditableText" id="Food">Today's Food: </div>
            <div className="row">
                <div>  
                
                <Dropdown as={ButtonGroup}>
                                <Button type="button" className="NotificationButton" variant="light" className="pull-right">
                                    <span class="NotificationText"> Choose Food </span>
                                    </Button>
                                <Dropdown.Toggle split variant="light" id="dropdown-split-basic" />
                                <Dropdown.Menu>
                                    <Image src={require('../images/cheeseSandwich.png')} className="DropdownImage"></Image>
                                    <Dropdown.Item onClick={()=>addFood('Cheese Sandwich')}>Cheese Sandwich</Dropdown.Item>
                                    --------
                                    <Image src={require('../images/kitKat.png')} className="DropdownImage"></Image>
                                    <Dropdown.Item onClick={()=>addFood('KitKat')}>KitKat</Dropdown.Item>
                                    --------
                                    <Image src={require('../images/sausageRoll.png')} className="DropdownImage"></Image>
                                    <Dropdown.Item onClick={()=>addFood('Sausage Roll')}>Sausage Roll</Dropdown.Item>
                                </Dropdown.Menu></Dropdown>        
  
            </div>
        </div> </div>
        )
         };

         function addFood(food){          
            document.getElementById("Food").textContent += '\r\n';  
            document.getElementById("Food").textContent += food;
      }