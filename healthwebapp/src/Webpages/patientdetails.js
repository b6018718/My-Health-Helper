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
    const [exerciseDiaryModule,setExerciseDiaryModule] = React.useState("");
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
            setFoodDiaryModule(createListGraphModule(data.foodDiary
                ,"foodRecord","time","calories","foodgroup","Daily Calorie Intake","Day","Calories",'Most recent diet vairety for: '
                ,"foodname"," calories from a ","My Food Diary: "
                ));
            setExerciseDiaryModule(createListGraphModule(data.exercise
                ,"exercise","time","exercisedurationmins","exercisetype","Daily exericse duration: ","Day","Exercise duration(minutes)",'Most recent exercise vairety for: '
                ,"exercisename"," min done by ","My Exercise Diary: "
                )
            );
            
                //My exercise diary: 
        });

        props.socket.on("realTimeFingerPrickData", function (data){
            setBloodSugarModule(createBloodSugarModule(data));
        });

        props.socket.on("realTimeFood", function (data){
            setFoodDiaryModule(createListGraphModule(data,"foodRecord","time","calories","foodgroup","Daily Calorie Intake","Day","Calories",'Most recent diet vairety for: '
            ,"foodname"," calories from a ","My Food Diary: "));
        });

        props.socket.on("realTimeExercise", function (data){
            setExerciseDiaryModule(createListGraphModule(data, "exercise","time","exercisedurationmins","exercisetype","Daily exericse duration: ","Day","Exercise duration(minutes)",'Most recent exercise vairety for: '
            ,"exercisename"," min done by ","My Exercise Diary: "));
        });

        return () => {
            props.socket.off("getMyPatientRecordResults");
            props.socket.off("realTimeFingerPrickData");
            props.socket.off("realTimeFood");
            props.socket.off("realTimeExercise");
            props.socket.emit("unsubPatientRecord", {});
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
            listItemArray.push(addItemToBloodSugarList(bloodSugarDataValue, i));
            i++;
        }
        return listItemArray;
    }
    function addItemToBloodSugarList(data,i)
    {
    var date= new Date(data.time)
    if(data.millimolesPerLitre <= 4 || data.millimolesPerLitre >= 8 )
        {
            if(data.millimolesPerLitre <= 3 || data.millimolesPerLitre >= 9 )
            {
                return(<ListGroup.Item variant = "danger" key={i}>{data.millimolesPerLitre}{"mmol/L"} recorded at: {date.toUTCString()} </ListGroup.Item>) 
            }
            else
            {
                return(<ListGroup.Item variant ="warning" key={i}>{data.millimolesPerLitre}{"mmol/L"} recorded at: {date.toUTCString()} </ListGroup.Item>) 
            }
        }
    else
        {
        return(<ListGroup.Item key={i}>{data.millimolesPerLitre}{"mmol/L"} recorded at: {date.toUTCString()} </ListGroup.Item>)   
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

    function  createListGraphModule(dataList,dataSetName,dateName,valueName,groupingName,dTitle,dXaxis,dYaxis,recentTitle,itemName,message,moduleTitle)
    {
        if(dataList != null && dataList != "" && dataList[dataSetName] !=[] && dataList[dataSetName].length != 0){
            var list = createDataList(dataList,dataSetName,valueName,dateName,itemName,message)
            var graphs =   createModuleGraphs(dataList,dataSetName,dateName,valueName,groupingName,dTitle,dXaxis,dYaxis,recentTitle)
           // var bloodSugarGraph = createBloodSugarGraph(dataList)
            return(
            <div>
            <br/>
            <div className = "SubTitle">{moduleTitle}</div>
            <div class = "listGroupExtended ListGroup">
                {list}
            </div>
            <br/>
            <div>
                {graphs}
            </div>

            </div>
            )
        }
        else{
            return(<div></div>)
        }
    }
    function createDataList(dataList,dataName,valueName,dateName,itemName,message)
    {
        var i = 0;
        var listItemArray =[];
        var dataListValues = dataList[dataName].reverse();
        //console.log(bloodSugarData)
        for(let dataListValue of dataListValues){
            listItemArray.push(addItemToDataList(dataListValue,valueName,dateName,itemName,message,i));
            i++;
        }
        return listItemArray;
    }
    function addItemToDataList(data,valueName,dateName,itemName,listMessage,i)
    {
    var date= new Date(data[dateName])
    return(<ListGroup.Item key={i}>{data[valueName]}{listMessage}{data[itemName]} recorded at: {date.toUTCString()} </ListGroup.Item>)   
           
    }

    function createModuleGraphs(data,dataSetName,dateName,valueName,groupingName,dTitle,dXaxis,dYaxis,recentTitle){ 
        var dailyValues = []
        var mostRecentDate= new Date()
        mostRecentDate.setYear(1)
        var  mostRecentData = []
        var values = data[dataSetName].reverse()
        for(let value of values)
        {
            var dateTime= new Date(value[dateName])
            var date = new Date(dateTime).setHours(0,0,0,0)
            var formatedDate = dateTime.toLocaleDateString()
            var index = -1
            var inc = 0
            while(index == -1 && inc < dailyValues.length)
            {
                if(formatedDate == dailyValues[inc].date)
                {
                    index = inc
                }
                else
                {
                    inc++
                }

            }
            if(index == -1)
            {
                dailyValues.push({date: formatedDate,value: value[valueName]})
            }
            else
            {
                dailyValues[index].value += value[valueName]
            }
            if(date > mostRecentDate)
            {
                mostRecentDate = date
                mostRecentData = []
                mostRecentData.push({group: value[groupingName], count: 1})
            }else
            {
                index = -1
                inc = 0
                while(index == -1 && inc < mostRecentData.length){
                    if(mostRecentData[inc].group.localeCompare(value[groupingName])==0)
                    {
                        index = inc
                    }
                    else
                    {
                        inc++
                    }
                }
                if(index == -1)
                {
                    mostRecentData.push({group: value[groupingName], count: 1})
                }
                else
                {
                    mostRecentData[index].count++
                }
            }
           
        }
        var tempDate = new Date(mostRecentDate)
        return (
        <div>
            {createDailyGraph(dailyValues,dTitle,dXaxis,dYaxis)}
            <br/>      
            <i>Please note, you can zoom in and out of the graph and scroll along to view more detail</i>
            <br/>
            <br/>
            {createMostRecentCountGraph(mostRecentData,recentTitle.concat(tempDate.toLocaleDateString()))}
            </div>
        )
            
    }

    function createMostRecentCountGraph(data,graphTitle)
    {
        var graphData = [["Group","Count"]]
        for(let value of data){
            graphData.push([value.group,value.count])
        }
        return (
            <Chart
            width={'100%'}
            height={'500px'}
            chartType="PieChart"
            data = {graphData}
            options = {{title:graphTitle,
            is3D: true }}
            />
        )
    }
    function createDailyGraph(data,graphTitle,xAxisTitle,yAxisTitle){
        var graphData=[]
        graphData.push([xAxisTitle,yAxisTitle])
        //console.log(bloodSugarData)
        for(let value of data)
        {
            graphData.push([value.date,value.value])
        }
        return (
            <Chart
                chartType = "LineChart"
                data={graphData}
                width = "100%"
                height="400px"
                legendToggle
                options={{

                        title: graphTitle,
                    
                    explorer: {axis: 'horizontal', keepInBounds: true},

                    hAxis: {
                      title: xAxisTitle,
                    },
                    vAxis: {
                      title: yAxisTitle,
                    },
                    pointSize: 5
                  }}
            />
        )
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
                    {exerciseDiaryModule}
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