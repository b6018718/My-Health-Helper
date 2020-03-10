import React, {useState} from 'react';
import { BrowserRouter, Route, Switch} from "react-router-dom";
import Login from "../Webpages/login";
import PatientHome from "../Webpages/patienthome";
import DoctorHome from "../Webpages/doctorhome";
import PatientDetails from "../Webpages/patientdetails";
import PatientExercise from "../Webpages/patientexercise";
import PatientFoodIntake from "../Webpages/patientfoodintake";
import PatientList from "../Webpages/patientlist"
import Register from "../Webpages/register";
import SelectDoctor from "..//Webpages/patientselectdoctor"
import AppliedRoute from "./appliedRoute";
import AuthenticedRoute from "./authenticedRoute";
import UnauthenticatedRoute from "./unauthenticedRoute";

function Routes({ appProps }) {
    return (
        <Switch>
            <UnauthenticatedRoute path='/' exact component ={Login} appProps={{ appProps }} />
            <UnauthenticatedRoute path='/register' exact component ={Register} appProps={{ appProps }} />
            <AuthenticedRoute path='/register/Select-Doctor' exact component = {SelectDoctor} appProps={{appProps}} />
            <AuthenticedRoute path='/Patient/Homepage' exact component ={PatientHome} appProps={{ appProps }} />
            <AuthenticedRoute path='/Patient/Food-Intake' exact component ={PatientFoodIntake} appProps={{ appProps }} />
            <AuthenticedRoute path='/Patient/Exercise' exact component ={PatientExercise} appProps={{ appProps }} />
            <AuthenticedRoute path='/Patient/MyDetails' exact component ={PatientDetails} appProps={{ appProps }} />
            <AuthenticedRoute path='/HealthCareProfessional/Homepage' exact component ={DoctorHome} appProps={{ appProps }} />
            <AuthenticedRoute path='/HealthCareProfessional/My-Patient-List' exact component ={PatientList} appProps={{ appProps }} />
            <AuthenticedRoute path='/HealthCareProfessional/Patient-Details' exact component ={PatientDetails} appProps={{ appProps }} />
            <Route path='/' render={() => <div> Error 404: page not found :(</div>} />
        </Switch>
    );
  }
  
  export default Routes;
  