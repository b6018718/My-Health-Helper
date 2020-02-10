import React from 'react';
import logo from './logo.svg';
import './App.css';

import { BrowserRouter, Route,Switch} from "react-router-dom";
import {Login} from "./Webpages/login";
import {PatientHome} from "./Webpages/patienthome";
import {DoctorHome} from "./Webpages/doctorhome";
import {PatientDetails} from "./Webpages/patientdetails";
import {PatientExercise} from "./Webpages/patientexercise";
import {PatientFoodIntake} from "./Webpages/patientfoodintake";
import {PatientList} from "./Webpages/patientlist"
import {Register} from "./Webpages/register";

function App() {
  return (
    <BrowserRouter>
    <Switch>
     <Route path='/' exact component ={Login} />
     <Route path='/Patient/Homepage' exact component ={PatientHome} />
     <Route path='/Patient/Food-Intake' exact component ={PatientFoodIntake} />
     <Route path='/Patient/Exercise' exact component ={PatientExercise} />
     <Route path='/Patient/MyDetails' exact component ={PatientDetails} /> {/* need to pass in patient ID */}
     <Route path='/HealthCareProfessional/Homepage' exact component ={DoctorHome} />
     <Route path='/HealthCareProfessional/My-Patient-List' exact component ={PatientList} />
     <Route path='/HealthCareProfessional/Patient-Details' exact component ={PatientDetails} />{/* need to pass in patient ID */}
     <Route path='/Register' exact component ={Register} />
     <Route path='/' render={() => <div> Error 404: page not found :(</div>}/>
    </Switch>
    </BrowserRouter>
    /*
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>*/
  );
}

export default App;
