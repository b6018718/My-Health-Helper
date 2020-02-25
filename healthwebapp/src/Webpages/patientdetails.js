import * as React from "react";
import {Link} from "react-router-dom"
//interface Props{}
import {Button, Form, Col, Row, ListGroup, Line} from "react-bootstrap";
//import '../css/Login.css';
import '../css/PatientDetails.css';
//import '../css/Login.css';
//import '../css/Register.css';
import SocketContext from '../components/socket'
import {Chart} from "react-google-charts"

//interface Props{}
function DisplayPatientDetailsWithoutSocket(props)
{
    const [patientDoctor, setPatientDoctor] = React.useState("");
    //const [bloodSugarList, setBloodSugarList] = React.useState("");
    //const [bloodSugarGraph,setBloodSugarGraph] = React.useState("");
    const [patientDetails,setPatientDetails] = React.useState("");
    const [bloodSugarModule, setBloodSugarModule] = React.useState("");
    const [foodDiaryModule,setFoodDiaryModule] = React.useState("");
    const [pageTitle,setPageTitle]=React.useState("");
    React.useEffect(() => {
        if(props.appProps.isDoctor)
        {
            console.log( props.appProps.currentSelectedPatient)
            console.log("doctor requested patient data");
            props.socket.emit("getMyPatientRecord",{selectedPatientID: props.appProps.currentSelectedPatient})
        }
        else
        {
            console.log("patient requested their data");
            props.socket.emit("getMyPatientRecord", {});
        }
        props.socket.on("getMyPatientRecordResults", function (data){
            console.log(data)
            setPatientDetails(data.patientDetails);
            setPageTitle(createPageTitle(data.patientDetails));
            setPatientDoctor(data.registeredDoctor);
            setBloodSugarModule(createBloodSugarModule(data.bloodSugarReadings));
            setFoodDiaryModule(createdFoodDiaryModule(data.foodDiary))
        });

        return () => {
            props.socket.off("getMyPatientRecordResults");
        };
        
            
    }, []);

    function  createBloodSugarModule(dataList)
    {
        if(dataList != null && dataList != "" && dataList.fingerPrick !=[] && dataList.fingerPrick.length != 0){
            var bloodSugarList = createBloodSugarList(dataList)
            var bloodSugarGraph = createBloodSugarGraph(dataList)
            return(
            <div>
            <div className = "SubTitle">My blood sugar readings: </div>
            <div class = "listGroupExtended ListGroup">
                {bloodSugarList}
            </div>
            <br/>
            {bloodSugarGraph}
            <i>Please note, you can zoom in and out of the graph and scroll along to view more detail</i>
            <br/>
            </div>
            )
        }
        else{
            return(<div></div>)
        }
    }

    function createBloodSugarGraph(bloodSugarData)
    {
        var graphData=[]
        graphData.push(["DateTime","mmol/L"])
        var bloodSugarDataValues = bloodSugarData.fingerPrick;
        //console.log(bloodSugarData)
        for(let bloodSugarDataValue of bloodSugarDataValues)
        {
            graphData.push(formatBloodSugarDataForGraph(bloodSugarDataValue))
        }
        return (
            <Chart
                chartType = "LineChart"
                data={graphData}
                width = "100%"
                height="400px"
                legendToggle
                options={{

                        title: 'Blood sugar levels over time:',
                    
                    explorer: {axis: 'horizontal', keepInBounds: true},

                    hAxis: {
                      title: 'Date/Time',
                    },
                    vAxis: {
                      title: 'Sugar mmol/L',
                    },
                    pointSize: 5
                  }}
            />
        )
    }
    function formatBloodSugarDataForGraph(data)
    {
        var date= new Date(data.time)
        return([date,data.millimolesPerLitre])
    }
    function createBloodSugarList(bloodSugarData)
    {
        var i = 0;
        var listItemArray =[];
        var bloodSugarDataValues = bloodSugarData.fingerPrick.reverse();
        //console.log(bloodSugarData)
        for(let bloodSugarDataValue of bloodSugarDataValues){
            listItemArray.push(addItemToBloodSugarList(bloodSugarDataValue));
            i++;
        }
        return listItemArray;
    }
    function addItemToBloodSugarList(data)
    {
    var date= new Date(data.time)
    if(data.millimolesPerLitre <= 4 || data.millimolesPerLitre >= 8 )
        {
            if(data.millimolesPerLitre <= 3 || data.millimolesPerLitre >= 9 )
            {
                return(<ListGroup.Item variant = "danger">{data.millimolesPerLitre}{"mmol/L"} recorded at: {date.toUTCString()} </ListGroup.Item>) 
            }
            else
            {
                return(<ListGroup.Item variant ="warning">{data.millimolesPerLitre}{"mmol/L"} recorded at: {date.toUTCString()} </ListGroup.Item>) 
            }
        }
    else
        {
        return(<ListGroup.Item>{data.millimolesPerLitre}{"mmol/L"} recorded at: {date.toUTCString()} </ListGroup.Item>)   
        }    
    }
    function createPageTitle(patientData){
        if(props.appProps.isDoctor)
        {
            var title = ""
            return title.concat(patientData.forename, " ", patientData.surname, "'s patient record")
        }  
        else
        {
            return "My patient record"
        }
    }

    function  createdFoodDiaryModule(dataList)
    {
        if(dataList != null && dataList != "" && dataList.foodRecord !=[] && dataList.foodRecord.length != 0){
            var foodDiaryList = createFoodDiaryList(dataList)
           // var bloodSugarGraph = createBloodSugarGraph(dataList)
            return(
            <div>
            <div className = "SubTitle">My food diary: </div>
            <div class = "listGroupExtended ListGroup">
                {foodDiaryList}
            </div>
            <br/>
            
            <i>Please note, you can zoom in and out of the graph and scroll along to view more detail</i>
            <br/>
            </div>
            )
        }
        else{
            return(<div></div>)
        }
    }
    function createFoodDiaryList(foodDiaryData)
    {
        var i = 0;
        var listItemArray =[];
        var foodDiaryValues = foodDiaryData.foodRecord.reverse();
        //console.log(bloodSugarData)
        for(let foodDiaryValue of foodDiaryValues){
            listItemArray.push(addItemToFoodDiaryList(foodDiaryValue));
            i++;
        }
        return listItemArray;
    }
    function addItemToFoodDiaryList(data)
    {
    var date= new Date(data.time)
    return(<ListGroup.Item>{data.calories}{" calories from a "}{data.foodname} recorded at: {date.toUTCString()} </ListGroup.Item>)   
           
    }

    
    return (<div className = "PatientDetails">   
            <div className = "PatientDetailsContainer">
            <div className="Title">{pageTitle}</div>
                <div className = "Paragraph"> 
                    <div className = "SubTitle">Profile: </div>
                    <div>Name: {patientDetails.forename} {patientDetails.surname}</div>
                    <div>Email: {patientDetails.email}</div>
                    <br/>
                    <div className = "SubTitle">Registered doctor's details: </div>
                    <div>Registered doctor: {patientDoctor.forename} {patientDoctor.surname} </div>
                    <div>Doctor's email: {patientDoctor.email}</div>
                    <br/>
                    {bloodSugarModule}
                    {foodDiaryModule}
                    <div className = "SubTitle">My exercise diary: </div>
                        <br/>
                </div>
                </div>
            </div>)
    

}


const PatientDetails = props => (
    <SocketContext.Consumer>
        {socket => <DisplayPatientDetailsWithoutSocket {...props} socket={socket} />}
    </SocketContext.Consumer>
)
export default PatientDetails;