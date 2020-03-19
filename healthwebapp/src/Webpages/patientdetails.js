import * as React from "react";
import { ListGroup } from "react-bootstrap";
import '../css/PatientDetails.css';
import SocketContext from '../components/socket'
import { Chart } from "react-google-charts"

function DisplayPatientDetailsWithoutSocket(props) { //Main function that creates and returns html page to be exported to react view
    const [patientDoctor, setPatientDoctor] = React.useState(""); //stores details of a patient's doctor
    const [patientDetails, setPatientDetails] = React.useState(""); //stores the demographic details of a patient
    const [bloodSugarModule, setBloodSugarModule] = React.useState(""); //stores the html section for the patient's blood sugar data
    const [foodDiaryModule, setFoodDiaryModule] = React.useState("");//stores the html section for the patient's food diary data
    const [exerciseDiaryModule, setExerciseDiaryModule] = React.useState("");//stores the html section for the patient's exercise data
    const [pageTitle, setPageTitle] = React.useState("");
    const [enabledModulesList, setEnabledModules] = React.useState("")
    React.useEffect(() => {
        if (props.appProps.isDoctor) { //Checks if user requesting record is a patient or doctor
            props.socket.emit("getMyPatientRecord", { selectedPatientID: props.appProps.currentSelectedPatient })//requests details for patient record from the back end server
        }//if user is a doctor, we need to pass user ID of selected patient to the database when making the data request
        else {
            props.socket.emit("getMyPatientRecord", {});//requests details for patient record from the back end server
        } //if user is a patient, the server  already knows their patient ID so we don't need to pass it to the server
        props.socket.on("getMyPatientRecordResults", function (data) { //listener for patiient details information back from back end server
            setPatientDetails(data.patientDetails);//stores patient demographic details from server
            setEnabledModules(createEnabledModuleList(data.patientDetails.enabledModules))
            setPageTitle(createPageTitle(data.patientDetails));//creates page title (varies if doctor request or patient request)
            if (data.registeredDoctor == null) { //handles null values if patient has no registered doctors
                setPatientDoctor({ forename: "No doctor is registered,", surname: " please select a doctor using the change my doctor page", email: "N/A" })
            }
            else {
                setPatientDoctor(data.registeredDoctor);//stores doctor details from server
            }
            setBloodSugarModule(createBloodSugarModule(data.bloodSugarReadings)); //creates and stores html section for blood sugar section
            setFoodDiaryModule(createListGraphModule(data.foodDiary   //creates and stores html section for food diary section
                , "foodRecord", "time", "calories", "foodgroup", "Daily Calorie Intake", "Day", "Calories", 'Most recent diet vairety for: '
                , "foodname", " calories from a ", "My Food Diary: "
            ));
            setExerciseDiaryModule(createListGraphModule(data.exercise //creates and stores html section for exercise section
                , "exercise", "time", "exercisedurationmins", "exercisetype", "Daily exericse duration: ", "Day", "Exercise duration(minutes)", 'Most recent exercise vairety for: '
                , "exercisename", " min done by ", "My Exercise Diary: "
            )
            );
        });

        props.socket.on("realTimeFingerPrickData", function (data) { //refreshes blood sugar section if any changes are made to the data on the database 
            //console.log(Date.now());
            setBloodSugarModule(createBloodSugarModule(data));
            //console.log(Date.now());
        });

        props.socket.on("realTimeFood", function (data) { //refreshes food diary section if any changes are made to the data on the database
            //console.log(Date.now());
            setFoodDiaryModule(createListGraphModule(data, "foodRecord", "time", "calories", "foodgroup", "Daily Calorie Intake", "Day", "Calories", 'Most recent diet vairety for: '
                , "foodname", " calories from a ", "My Food Diary: "));
            //console.log(Date.now());
        });

        props.socket.on("realTimeExercise", function (data) { //refreshes exercise section if any changes are made to the data on the database
            //console.log(Date.now());
            setExerciseDiaryModule(createListGraphModule(data, "exercise", "time", "exercisedurationmins", "exercisetype", "Daily exericse duration: ", "Day", "Exercise duration(minutes)", 'Most recent exercise vairety for: '
                , "exercisename", " min done by ", "My Exercise Diary: "));
            //console.log(Date.now());
        });

        return () => {
            props.socket.off("getMyPatientRecordResults"); //turns off listener sockets for receiving data
            props.socket.off("realTimeFingerPrickData");//turns off listener sockets for receiving data
            props.socket.off("realTimeFood");//turns off listener sockets for receiving data
            props.socket.off("realTimeExercise");//turns off listener sockets for receiving data
            props.socket.emit("unsubPatientRecord", {}); //stops server from sending refresh data
        };
    }, []);

    //creates text for enabled modules
    function createEnabledModuleList(data){
        //initialise moduleList to empty sting
        let moduleList = "" 
        //for each module in enabledModules, check if enabled is true
        for(let module of data)
        {
            if(module.enabled)
            {
                moduleList = moduleList.concat(module.moduleName, "; ")
            }
        }
        //if moduleList is still an empty string, set module list to display relavant message to user stating that they have no modules enabled
        if (moduleList == "")
        {
            moduleList = "No data modules are currently enabled."
        }
        return moduleList
    }

    function createBloodSugarModule(dataList) { //creates html section for blood sugar data
        if (dataList !== null && dataList !== "" && dataList.fingerPrick !== [] && dataList.fingerPrick.length !== 0) { //checks data is not null
            var bloodSugarList = createBloodSugarList(dataList) //creates and stores list of readings to be used in html section
            var bloodSugarGraph = createBloodSugarGraph(dataList) //creats and stores graph to be used in html section
            return (
                <div>
                    <div className="SubTitle">My blood sugar readings: </div>
                    <div class="listGroupExtended ListGroup">
                        {bloodSugarList}
                    </div>
                    <br />
                    {bloodSugarGraph}
                    <i>Please note, you can zoom in and out of the graph and scroll along to view more detail</i>
                    <br />
                </div>
            )
        }
        else {//if data is null, returns no data
            return (<div></div>)
        }
    }

    function createBloodSugarGraph(bloodSugarData) { //creates and returns graph for blood sugar data
        var graphData = [] //stores data for graph
        graphData.push(["DateTime", "mmol/L"])//push axis names into data for graph
        var bloodSugarDataValues = bloodSugarData.fingerPrick;
        for (let bloodSugarDataValue of bloodSugarDataValues) {
            graphData.push(formatBloodSugarDataForGraph(bloodSugarDataValue)) //for all values, pushes and formats there data into the graphData
        }
        return (
            <Chart
                chartType="LineChart"
                data={graphData}
                width="100%"
                height="400px"
                legendToggle
                options={{

                    title: 'Blood sugar levels over time:',

                    explorer: { axis: 'horizontal', keepInBounds: true },

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
    function formatBloodSugarDataForGraph(data) {
        var date = new Date(data.time) //formats date for blood sugar graph
        return ([date, data.millimolesPerLitre])
    }
    function createBloodSugarList(bloodSugarData) { //creates list of blood sugar data values
        var i = 0;//incremented to give list objects unique key values
        var listItemArray = [];//used to store list values
        var bloodSugarDataValues = bloodSugarData.fingerPrick.reverse(); //orders data so most recent data appears at the top of the list
        for (let bloodSugarDataValue of bloodSugarDataValues) {
            listItemArray.push(addItemToBloodSugarList(bloodSugarDataValue, i));//formats and pushs values into list
            i++; //increments unique key
        }
        return listItemArray; //returns list values
    }
    function addItemToBloodSugarList(data, i) {
        var date = new Date(data.time) //formats date
        if (data.millimolesPerLitre <= 4 || data.millimolesPerLitre >= 8) { //checks if data is within warning and danger range of values
            if (data.millimolesPerLitre <= 3 || data.millimolesPerLitre >= 9) {//checks if data is within danger range, if it is, returns danger formatting
                return (<ListGroup.Item variant="danger" key={i}>{data.millimolesPerLitre}{"mmol/L"} recorded at: {date.toUTCString()} </ListGroup.Item>)
            }
            else {//returns warning formatting 
                return (<ListGroup.Item variant="warning" key={i}>{data.millimolesPerLitre}{"mmol/L"} recorded at: {date.toUTCString()} </ListGroup.Item>)
            }
        }
        else {//returns defualt formatting
            return (<ListGroup.Item key={i}>{data.millimolesPerLitre}{"mmol/L"} recorded at: {date.toUTCString()} </ListGroup.Item>)
        }
    }
    function createPageTitle(patientData) {//creates title for patient details
        if (props.appProps.isDoctor) {//if doctor made request, use patients name as the page title
            var title = ""
            return title.concat(patientData.forename, " ", patientData.surname, "'s patient record")
        }
        else {// if patient made request, just returns "my patient record" as the title
            return "My patient record"
        }
    }


    //Multipurpose function used to create graphs for exercise and food diary sections
    function createListGraphModule(dataList, dataSetName, dateName, valueName, groupingName, dTitle, dXaxis, dYaxis, recentTitle, itemName, message, moduleTitle) {
        if (dataList !== null && dataList !== "" && dataList[dataSetName] !== [] && dataList[dataSetName].length !== 0) { //checks if passed in data set is null
            var list = createDataList(dataList, dataSetName, valueName, dateName, itemName, message) //creates and stores list to be used in html section
            var graphs = createModuleGraphs(dataList, dataSetName, dateName, valueName, groupingName, dTitle, dXaxis, dYaxis, recentTitle) //creates and stores graphs to be used in html section 
            return (//returns html section
                <div>
                    <br />
                    <div className="SubTitle">{moduleTitle}</div>
                    <div class="listGroupExtended ListGroup">
                        {list}
                    </div>
                    <br />
                    <div>
                        {graphs}
                    </div>

                </div>
            )
        }
        else {//if data is null, return empty section
            return (<div></div>)
        }
    }
    function createDataList(dataList, dataName, valueName, dateName, itemName, message) {//creates a bootstrap list of data
        var i = 0; //stores uniques key for list values
        var listItemArray = []; //stores list values
        var dataListValues = dataList[dataName].reverse(); //order list values so must recent values appear at top of list
        for (let dataListValue of dataListValues) {
            listItemArray.push(addItemToDataList(dataListValue, valueName, dateName, itemName, message, i));//fprmats and pushes item to list
            i++;//increments unique key
        }
        return listItemArray;
    }
    function addItemToDataList(data, valueName, dateName, itemName, listMessage, i) { //formats list value
        var date = new Date(data[dateName]) //formats date
        return (<ListGroup.Item key={i}>{data[valueName]}{listMessage}{data[itemName]} recorded at: {date.toUTCString()} </ListGroup.Item>)

    }

    function createModuleGraphs(data, dataSetName, dateName, valueName, groupingName, dTitle, dXaxis, dYaxis, recentTitle) {
        var dailyValues = [] //stores daily values to be used in daily line graph
        var mostRecentDate = new Date() //stores most recent date
        mostRecentDate.setYear(1) //recent date defaults to earliest possible date in java script
        var mostRecentData = [] //stores data for most recent date pie graph
        var values = data[dataSetName].reverse()//reorders data
        for (let value of values) {
            var dateTime = new Date(value[dateName])
            var date = new Date(dateTime).setHours(0, 0, 0, 0)//formats date for daily data comparison and removes time from date
            var formatedDate = dateTime.toLocaleDateString()//formats date to string for daily values display
            var index = -1//sets current index of date value in data list for daily list
            var inc = 0//keeps track of index for checking if current date value is already in daily values list
            while (index === -1 && inc < dailyValues.length) { //loops while index is not found ie index still equals -1 and if inc has gone outside length of daily values list
                if (formatedDate === dailyValues[inc].date) {
                    index = inc //sets index to current inc if date of value already exists in daily values list
                }
                else {
                    inc++ //increments index if date does not match
                }

            }
            if (index === -1) { //if index still equals -1, date of current value is not in daily values and needs add to list
                dailyValues.push({ date: formatedDate, value: value[valueName] })
            }
            else {//if index found, need to add value to total at current index/date
                dailyValues[index].value += value[valueName]
            }
            if (date > mostRecentDate) {//checks if date of current value is higher than most recent date
                mostRecentDate = date //if date is higher than most recent date, set mostRecentDate equal to date
                mostRecentData = [] //clear most Recent data set
                mostRecentData.push({ group: value[groupingName], count: 1 }) //push group name with count 1 into data set
            } else {
                index = -1
                inc = 0
                while (index === -1 && inc < mostRecentData.length) { //loop searchs to see if group name is already in data set
                    if (mostRecentData[inc].group.localeCompare(value[groupingName]) === 0) {
                        index = inc
                    }
                    else {
                        inc++
                    }
                }
                if (index === -1) { //if not in data set (i.e. index equals -1), push group name with count 1 into data set
                    mostRecentData.push({ group: value[groupingName], count: 1 })
                }
                else { //if group name is in most recent data set, increment count by 1 at index (where group name was found)
                    mostRecentData[index].count++
                }
            }

        }
        var tempDate = new Date(mostRecentDate) //used for formatting date for most recent data set title
        return ( //returns html container which has function calls that creates graphs
            <div>
                {createDailyGraph(dailyValues, dTitle, dXaxis, dYaxis)}
                <br />
                <i>Please note, you can zoom in and out of the graph and scroll along to view more detail</i>
                <br />
                <br />
                {createMostRecentCountGraph(mostRecentData, recentTitle.concat(tempDate.toLocaleDateString()))}
            </div>
        )

    }

    function createMostRecentCountGraph(data, graphTitle) {
        var graphData = [["Group", "Count"]]//creates pie chart data with labels for data columns
        for (let value of data) {
            graphData.push([value.group, value.count])//pushes values into pie chart date
        }
        return ( //returns pie chart
            <Chart
                width={'100%'}
                height={'500px'}
                chartType="PieChart"
                data={graphData}
                options={{
                    title: graphTitle,
                    is3D: true
                }}
            />
        )
    }
    function createDailyGraph(data, graphTitle, xAxisTitle, yAxisTitle) {
        var graphData = [] //stores data for line graph
        graphData.push([xAxisTitle, yAxisTitle]) //pushes axis titles into line graph data
        for (let value of data) {
            graphData.push([value.date, value.value]) // pushes data into line graph
        }
        return (//returns line graph of daily values
            <Chart
                chartType="LineChart"
                data={graphData}
                width="100%"
                height="400px"
                legendToggle
                options={{

                    title: graphTitle,

                    explorer: { axis: 'horizontal', keepInBounds: true },

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
    function handleNullDemographics(data) { //handles null demographic data values
        if (data === null || data == "") {
            return "Not stated"
        }
        else {
            return data
        }
    }
    function handleNullDate(date) { //formates dates to string for date of birth and handles null values
        if (date != null) {
            return new Date(patientDetails.DoB).toLocaleDateString()
        }
        else {
            return null
        }
    }
    //returns html to be used for react export
    return (<div className="PatientDetails">
        <div className="PatientDetailsContainer">
            <div className="Title">{pageTitle}</div>
            <div className="Paragraph">
                <div className="SubTitle">Profile: </div>
                <div>Name: {patientDetails.forename} {patientDetails.surname}</div>
                <div>Email: {patientDetails.email}</div>
                <div>Sex: {handleNullDemographics(patientDetails.sex)}</div>
                <div>Date of Birth: {handleNullDemographics(handleNullDate(patientDetails.DoB))}</div>
                <div>Telephone No: {handleNullDemographics(patientDetails.telephone)}</div>
                <div>Mobile No: {handleNullDemographics(patientDetails.mobile)}</div>
                <div>Address: {handleNullDemographics(patientDetails.address)}</div>
                <div>NHS Number: {handleNullDemographics(patientDetails.NHSnumber)}</div>
                <div>Enabled data modules: {enabledModulesList}</div>
                <br />
                <div className="SubTitle">Registered doctor's details: </div>
                <div>Registered doctor: {patientDoctor.forename} {patientDoctor.surname} </div>
                <div>Doctor's email: {patientDoctor.email}</div>
                <br />
                {bloodSugarModule}
                {foodDiaryModule}
                {exerciseDiaryModule}
            </div>
        </div>
    </div>)


}
const PatientDetails = props => ( //Calls function to create html page to be exported
    <SocketContext.Consumer>
        {socket => <DisplayPatientDetailsWithoutSocket {...props} socket={socket} />}
    </SocketContext.Consumer>
)
export default PatientDetails; //Exports patients details page to be displayed when react-rooter directs to this page