import * as React from "react"; 
import {Button,  Dropdown, Image, ButtonGroup} from "react-bootstrap";

//interface Props{}

export const PatientFoodIntake = () => {
    return (
        <div class="container">
            <div className="Title">  Food Logger  </div>
            <div className="Paragraph">Please add a food input.</div>
            <div className="row">
                <div>  
                
                <Dropdown as={ButtonGroup}>
                                <Button type="button" className="NotificationButton" variant="light" className="pull-right">
                                    <span class="NotificationText"> Choose Food </span>
                                    </Button>
                                <Dropdown.Toggle split variant="light" id="dropdown-split-basic" />
                                <Dropdown.Menu>
                                    <Image src={require('../images/cheeseSandwich.png')} className="DropdownImage"></Image>
                                    <Dropdown.Item href="#/action-1">Cheese Sandwich</Dropdown.Item>
                                    --------
                                    <Image src={require('../images/kitKat.png')} className="DropdownImage"></Image>
                                    <Dropdown.Item href="#/action-2">KitKat</Dropdown.Item>
                                    --------
                                    <Image src={require('../images/sausageRoll.png')} className="DropdownImage"></Image>
                                    <Dropdown.Item href="#/action-3">Sausage Roll</Dropdown.Item>
                                </Dropdown.Menu></Dropdown>        
  
            </div>
        </div> </div>
        )
         };