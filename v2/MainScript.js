// New version 11 Feb to incorporate difference voltage readings into histogram.

var DEBUG = true;
var hostIP = 'http://10.0.0.120:80/';

var selectedChart = -1;
var dataSensorNum = [10, 32];
var dataTypeLetter = ['T', 'V'];
var dataTypeName = ['Temperature', 'Voltage'];
var testBool = true;
var drawCanvas = false;
var blinkLightState = 0;
var lastMonitorChangedState = 1;
var units = ['K', 'V'];
var sensorNames = [
    ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10'],
    ['Pancake 1', 'Pancake 2', 'Pancake 3', 'Pancake 4', 'Pancake 5', 'Pancake 6', 'Pancake 7', 'Pancake 8', 'Pancake 9', 'Pancake 10', 'Pancake 11', 'Pancake 12', 'Pancake 13', 'Pancake 14', 'Pancake 15', 'Pancake 16', 'Pancake 17', 'Pancake 18', 'Pancake 19', 'Pancake 20', 'Pancake 21', 'Pancake 22', 'Pancake 23', 'Bus 1 to out', 'Bus 2 to 1', 'Bus 3 to 2', 'Bus 4 to 3', 'Bus 5 to 4', 'Bus input to 5', 'Passthrough input', 'passthrough output', 'Input to output']
];

//Overview timeSeries list
var tsOverview = [];
//Overview charts list
var scOverview = [];
//Full timeSeries
var tsFull = [];
//Full charts
var scFull = [];

var lineVisible = [];

var dataObject;

var bar_chart; //histogram on tab 2
var readings = [100, 19, 3, 8, 50, 1, 1, 1, 1, 1, 1, 1]; //histogram values



/*
 * Creates the timelines and initialises the data structures to the correct size.
 */
function createTimeline() {
    if (DEBUG) {
        //dataObject = JSON.parse('{"P":[-4.2],"T":[2.0,-5.5,8.5,3.4,-7.5,9.7,-0.5,4.3,-3.1,-0.2],"V":[0.2,-0.5,-0.4,0.1,-0.0,0.3,-0.2,-0.2,-0.3,-0.5,-0.1,0.3,0.0,-0.0,-0.2,-0.1,0.4,0.3,0.2,0.3,-0.1,0.1,0.3,0.2,0.4,0.3,-0.1,0.3,0.1,0.5,0.2,0.2],"C":-1.6,"MonitorChanged":1}');
        
        
        try{
            
        dataObject = {
            "P":[0.1],
            "T":[290.3,290.0,290.613,292.842,290.594,290.38,292.665,297.174,290.25,294.662],
            "V":[5.72205e-06,-5.34058e-05,-3.8147e-06,3.24249e-05,-2.47955e-05,2.09808e-05,-6.86646e-05,-5.72205e-05,0.035696,0.0224705,0.0450497,0.0245552,0.0611916,0.0538864,0.132149,0.129751,0.298416,0.311102,0.295141,0.297434,0.296476,0.311373,0,0.313499,0,0.32012,0.297449,0.304031,0.298059,0.319498,0.299763,0.323925],
            "Vdiff":[0.000113735,0.000108719,0.0674551,0.0153595,0.0035331,0.00798257,0.386008,0.0494435,0.0119316,0.0324072,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1.96406e-41,6.61413e-41,6.54687e-41,2.01002e-41,6.59395e-41,1.99769e-41,6.62085e-41,6.61637e-41,1.9109e-06,6.47432e-27,-2.41191e-35,7.11861e-15,-2.78076e-17],
            "C":10000,
            "MonitorChanged":1
            }
        /*
            //JSON.parse(JSON.stringify(yourjson).replace(/null/g, '""'))
            var nan = NaN;
            dataObject = {
                "P":[4.29],
                "T":[nan,nan,262.003,244.964,247.022,305.716,nan,nan,nan,243.779],
                "V":[0.000398636,-0.00251007,-0.000352859,0.00069046,0.00079155,0.00106812,-0.000419617,-0.00165558,-0.000175476,-0.0012188,0.00219154,-0.00250244,0.000448227,-0.00069809,0.000429153,0.00156593,0.000175476,-0.000429153,-7.62939e-06,-0.00215149,-0.000236511,-0.000183105,-0.000152588,0.00247955,0.000343323,0.000204086,7.62939e-05,0.00247383,-0.00209427,-4.00543e-05,-0.00426483,-6.86646e-05],
                "Vdiff":[0.00362333,0.00127239,0.000117798,0.00579506,0.00119518,0.00126205,0.00111961,0.00187477,5.57709e-05,0.000144043,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2.07406e-41,-6.71334e-41,6.66247e-41,2.08807e-41,-2.09172e-41,2.10027e-41,6.66738e-41,6.70283e-41,6.6444e-41,-2.01139,-1.08616e-19,6.71334e-41,2.07771e-41],
                "C":0,
                "MonitorChanged":1
                };
          */ 

            
 
        //var filtered = dataObject.filter(e => e != 'nan');
        //console.log(filtered);
    }
            catch(e){
            console.log(e);
        }
        
        //console.log(dataObject);
    }

    console.log("commented out ajaxSetup for debug purposes");
    /*
    $.ajaxSetup({
        headers: {
            "accept": "application/json"
                // "Access-Control-Allow-Origin": "*"
        },
        beforeSend: function(xhr) {
            if (xhr.overrideMimeType) {
                xhr.overrideMimeType('application/json');
            }

        }
    });*/

    var milPerpx = 2880; //Set a default graph scrolling rate

    //Loop over the 3 overview time series and create the graphs
    for (let i = 0; i < 2; i++) {
        tsOverview[i] = new TimeSeries(); //Only one timer series per graph for the overview page
        //show time values on bottom chart
        if(i==1)
            scOverview[i] = new SmoothieChart({ labels:{fontSize:15},responsive: true,interpolation:'linear', 
            grid: { millisPerLine:  2000, verticalSections:2},
            millisPerPixel: 20,
            timestampFormatter:SmoothieChart.timeFormatter}
            );
        else
            scOverview[i] = new SmoothieChart({ labels:{fontSize:15},responsive: true,interpolation:'linear',
            grid: { millisPerLine:  2000, verticalSections:2},
            millisPerPixel: 20});
        scOverview[i].addTimeSeries(tsOverview[i], { strokeStyle: 'rgba(0, 140, 50, 1)', lineWidth: 3 });
        scOverview[i].streamTo(document.getElementById("OV" + dataTypeLetter[i] + "canvas"), 500);
    }

    for (var dataType = 0; dataType < 2; dataType++) {
        tsFull[dataType] = [];
        lineVisible[dataType] = [];
    }

    var minYValue = [0, -5]; //The min and max value ranges for the different data types
    var maxYValue = [320, 20];

    for (dataType = 0; dataType < 2; dataType++) {
        //Create a SmoothieChart for each sensor type 
        scFull[dataType] = new SmoothieChart({labels:{fontSize:15},
            grid: { millisPerLine: 60 * milPerpx * 24, verticalSections: 10 },
            responsive: true,
            millisPerPixel: milPerpx * 24,
            timestampFormatter: SmoothieChart.timeFormatter,
            maxValue: maxYValue[dataType],
            minValue: minYValue[dataType]
        });
        //Create and add all the time series to the charts
        for (sensorNum = 0; sensorNum < dataSensorNum[dataType]; sensorNum++) {
            tsFull[dataType][sensorNum] = new TimeSeries();
            scFull[dataType].addTimeSeries(tsFull[dataType][sensorNum], { strokeStyle: getLineColour(sensorNum), lineWidth: 3 });
            lineVisible[dataType][sensorNum] = 1;
            /*
            if (DEBUG) {
                switch (dataType) { //TODO: remove
                    case 0:
                        dataObject[dataTypeLetter[dataType]][sensorNum] = 100;
                        break;
                    case 1:
                        //dataObject[dataTypeLetter[dataType]][sensorNum] = 40;
                        break;
                    case 2:
                        dataObject[dataTypeLetter[dataType]][sensorNum] = 2;
                        break;
                    default:
                        break;
                }
                dataObject.C = 120;
            }
            */

        }
        //Attach the chart to the correct canvas
        scFull[dataType].streamTo(document.getElementById("Full" + dataTypeLetter[dataType] + "canvasB"), 500);
    }
    updateTimeScale(); //Update the speed and scale of the graphs

    setInterval(updateData, 2000); //Update graph once a second

    setInterval(updateDataGraphs, 2000); //TODO: change this?

    setInterval(updateMonitor, 300000);

    updateMonitor();

    createHistogram();
}

/*
 * Adjusts the speed and scale of the canvas grid.
 */
function updateTimeScale() {
    for (dataType = 0; dataType < 2; dataType++) {
        // var num = parseFloat(document.getElementById("time2Config").value);
        var min = 20;
        scFull[dataType].options.millisPerPixel = min * 48;
        scFull[dataType].options.grid.millisPerLine = min * 48 * 100;
    }
    // document.getElementById("SwitchTime").innerHTML = document.getElementById("time1Config").value + "m - " + document.getElementById("time2Config").value + "m";
}

function pressButton(button) {
    // alert(`button ${button} Has been pressed`);
    $.post(hostIP + "/B" + button);
}


function toggleLineButton(str) {
    var x = parseInt(str.charAt(0));
    var y = parseInt(str.substring(1));
    if (lineVisible[x][y] == 1) {
        lineVisible[x][y] = 0;
        scFull[x].seriesSet[y].options.strokeStyle = 'rgba(255, 0, 0, 0)';
        document.getElementById(x+'button' + y + 'Div').style.color = 'rgb(150,150,150)';
    } else {
        lineVisible[x][y] = 1;
        scFull[x].seriesSet[y].options.strokeStyle = getLineColour(y);
        document.getElementById(x+'button' + y + 'Div').style.color = getLineColour(y);
    }

}

function showAllLines() {
    for (let sensorNum = 0; sensorNum < dataSensorNum[selectedChart]; sensorNum++) {
        lineVisible[selectedChart][sensorNum] = 1;
        let lineColour = getLineColour(sensorNum);
        scFull[selectedChart].seriesSet[sensorNum].options.strokeStyle = lineColour;
        document.getElementById(selectedChart+'button' + sensorNum + 'Div').style.color = lineColour;
        // document.getElementById("b" + sensorNum).checked = true;
    }
    // document.getElementById("showAll").checked = false;
}

function showNoLines() {
    for (let sensorNum = 0; sensorNum < dataSensorNum[selectedChart]; sensorNum++) {
        lineVisible[selectedChart][sensorNum] = 0;
        scFull[selectedChart].seriesSet[sensorNum].options.strokeStyle = 'rgba(255, 0, 0, 0)';
        document.getElementById(selectedChart+'button' + sensorNum + 'Div').style.color = 'rgb(150,150,150)';
        // document.getElementById("b" + sensorNum).checked = false;

    }
    // document.getElementById("showNone").checked = false;
}

function getLineColour(sensorNum) {
    var colours = ["7, 104, 31", "9, 145, 43", "12, 179, 54", "19, 207, 66", "70, 224, 109", "152, 218, 132", "203, 223, 166", "219, 230, 163", "206, 228, 100", "150, 150, 200"];
    if (sensorNum > 9) {
        sensorNum = 9;
    }
    return 'rgb(' + colours[sensorNum] + ')';
}
/*
 * Creates the buttons that control the visibility of each sensor.
 * Overwrites the buttons that are already there so can be called if the number of sensors changes.
 */
function setButtons() {
    var x = '';
        
        for (var sensorNum = 0; sensorNum < dataSensorNum[selectedChart]; sensorNum++) {
            x += '<div id = "'+selectedChart+'button' + sensorNum + 'Div" class = "buttonDiv" ';
            x += "onclick='toggleLineButton(" + '"' + selectedChart + sensorNum + '"' + ")' >"

            x += sensorNames[selectedChart][sensorNum];
            x += '<span id = "'+selectedChart+'button' + sensorNum + 'Value" class = buttonValue>0</span>'
            x += '</div>';
        }
        if(selectedChart==0){
            document.getElementById("TGraphButtons").innerHTML = x;
        }
        else if(selectedChart==1){
            document.getElementById("VGraphButtons").innerHTML = x;
        }

        
        
        for (let sensorNum = 0; sensorNum < dataSensorNum[selectedChart]; sensorNum++) {
            if (lineVisible[selectedChart][sensorNum] == 1) {
                document.getElementById(selectedChart+"button" + sensorNum + "Div").style.color = getLineColour(sensorNum);
            } else {
                document.getElementById(selectedChart+"button" + sensorNum + "Div").style.color = 'rgb(150,150,150)';
            }
        }
    
    updateButtonText();
}

/*
 * Hides all the overview graphs and shows the selected full graph
 */
function showMore(type) {
    /*if (type == 'P') {
        document.getElementById("graphFullP").style.visibility = 'visible';
        selectedChart = 0;
    } else */
    document.getElementById("axisControls").style.display = 'block';
    if (type == 'T') {
        document.getElementById("graphFullT").style.visibility = 'visible';
        selectedChart = 0;
       
        $("ul.axisLimits li:nth-child(1)").show();
        $("ul.axisLimits li:nth-child(2)").show();
        $("ul.axisLimits li:nth-child(3)").hide();
        $("ul.axisLimits li:nth-child(4)").hide();

    } else if (type == 'V') {
        document.getElementById("graphFullV").style.visibility = 'visible';
        selectedChart = 1;
        $("ul.axisLimits li:nth-child(1)").hide();
        $("ul.axisLimits li:nth-child(2)").hide();
        $("ul.axisLimits li:nth-child(3)").show();
        $("ul.axisLimits li:nth-child(4)").show();
    } else {
        //Error
        return;
    }
    //document.getElementById("axisControls").style.display = 'none';
    
    //document.getElementById("OVPgraph").style.visibility = 'hidden';
    document.getElementById("OVTgraph").style.visibility = 'hidden';
    document.getElementById("OVVgraph").style.visibility = 'hidden';

    document.getElementById("optionsG").style.display = 'block';
    updateTimePeriod();
    setButtons();
}


/*
 * Hides all the full graphs and shows the overview graphs
 */
function showLess() {
    //document.getElementById("OVPgraph").style.visibility = 'visible';
    document.getElementById("OVTgraph").style.visibility = 'visible';
    document.getElementById("OVVgraph").style.visibility = 'visible';
    //document.getElementById("axisControls").style.display = 'block';
    document.getElementById("axisControls").style.display = 'none';

    //document.getElementById("graphFullP").style.visibility = 'hidden';
    document.getElementById("graphFullT").style.visibility = 'hidden';
    document.getElementById("graphFullV").style.visibility = 'hidden';

    selectedChart = -1;
    document.getElementById("GraphButtons").innerHTML = "";
    document.getElementById("optionsG").style.display = 'none';
    updateTimePeriod();
}

function updateData() {
    //var nan = -1;
    if (!DEBUG) {
        $.get("http://10.0.0.120/data/json?P=R0,1&T=R1,10&V=R11,32&Vdiff=R51,62&C=R43&MonitorChanged=C500", function(data) {
        //$.get("http://10.0.0.120/data/json?P=R0,1&T=R1,10&V=R11,32&C=R43&MonitorChanged=C500", function(data) { //Get the data from the host arduino and save it to the dataObject object
            dataObject = JSON.parse(data);
            plotData();
            checkMonitorChanged();
            tick(); //update histogram
        });
    } else {
        getFakeData();
        plotData();
        checkMonitorChanged();
        tick(); //update histogram
    }


}

function plotData() {
    // Loop over all sensors
    for (let dataType = 0; dataType < 2; dataType++) {
        if (dataTypeLetter[dataType] == 'P') { //Plot the data on the overview graphs
            tsOverview[dataType].append(new Date().getTime(), Math.log10(dataObject[dataTypeLetter[dataType]][0])); //Update the overview series
        } else {
            var y = dataObject[dataTypeLetter[dataType]][0];
            //console.log(y);
            tsOverview[dataType].append(new Date().getTime(), dataObject[dataTypeLetter[dataType]][0]); //Update the overview series
        }
    }

    document.getElementById("currentDisplay").innerText = dataObject.C.toFixed(2) + "A"; //Update the current display
    updateButtonText();
    if (drawCanvas) {
        drawUICanvas();
    }
}

function checkMonitorChanged() {
    if (dataObject.MonitorChanged != lastMonitorChangedState) {
        lastMonitorChangedState = dataObject.MonitorChanged;
        updateMonitor();
    }
    
}

function updateMonitor() {
    if(!DEBUG){
    $.get("http://10.0.0.120/data/json?Header=SS72,1&lineTxt=SL2&lightState=D81", function(data) { //Get the data from the host arduino and save it to the dataObject object
        console.log(data);
        blinkLightState = data.lightState;
        $("#uiHeader").text(data.Header);
        $("#uiTextL0").text(data.lineTxt);

        if (data.lineTxt.length > 0) {
            drawCanvas = false;
            $("#UItxt").hide();
            $("#uiCanvas").hide();
        } else {
            drawCanvas = true;
            $("#UItxt").show();
            $("#uiCanvas").show();
        }
    });
    }
}


function updateDataGraphs() {
    for (let dataType = 0; dataType < 2; dataType++) {
        for (sensorNum = 0; sensorNum < dataSensorNum[dataType]; sensorNum++) {
            if(dataObject[dataTypeLetter[dataType]][sensorNum]){
                if (dataTypeLetter[dataType] == 'P') {
                    tsFull[dataType][sensorNum].append(new Date().getTime(), Math.log10(dataObject[dataTypeLetter[dataType]][sensorNum]));
                } else {
                    tsFull[dataType][sensorNum].append(new Date().getTime(), dataObject[dataTypeLetter[dataType]][sensorNum]);
                }
            }
        }
    }
}

function updateButtonText() {
    for (let sensorNum = 0; sensorNum < dataSensorNum[selectedChart]; sensorNum++) {
        if (selectedChart == 0) {
            document.getElementById(selectedChart+'button' + sensorNum + 'Value').innerText = dataObject[dataTypeLetter[selectedChart]][sensorNum].toExponential(2) + units[selectedChart];
        } else {
            document.getElementById(selectedChart+'button' + sensorNum + 'Value').innerText = dataObject[dataTypeLetter[selectedChart]][sensorNum].toFixed(1) + units[selectedChart];
        }
    }
}



/*
 * Goes over all the charts/canvas and sets the visibility.
 * The visibility is determined by the switch in the top right corner
 */
function updateTimePeriod() {
    if (selectedChart >= 0) {
        document.getElementById("Full" + dataTypeLetter[selectedChart] + "canvasB").style.visibility = 'visible';
    } else {
        for (let i = 0; i < 2; i++) {
            document.getElementById("Full" + dataTypeLetter[i] + "canvasB").style.visibility = 'hidden';
        }
    }

}

function drawUICanvas() {
    testBool = !testBool;
    var c = document.getElementById("uiCanvas");
    w = c.width;
    h = c.height;
    var ctx = c.getContext("2d");
    ctx.strokeStyle = "#FFF";
    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    ctx.moveTo(30, h / 2);
    ctx.lineTo(170, h / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(30, h / 2, 10, 0, 2 * Math.PI);
    if (blinkLightState > 1) {
        ctx.fillStyle = "rgb(10, 139, 21)";
    } else if (blinkLightState == 1) {
        if (testBool) {
            ctx.fillStyle = "rgb(10, 139, 21)";
        } else {
            ctx.fillStyle = "#202020";
        }
    } else {
        ctx.fillStyle = "#202020";
    }
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(100, h / 2, 10, 0, 2 * Math.PI);
    if (blinkLightState > 3) {
        ctx.fillStyle = "rgb(10, 139, 21)";
    } else if (blinkLightState == 3) {
        if (testBool) {
            ctx.fillStyle = "rgb(10, 139, 21)";
        } else {
            ctx.fillStyle = "#202020";
        }
    } else {
        ctx.fillStyle = "#202020";
    }
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(170, h / 2, 10, 0, 2 * Math.PI);
    if (blinkLightState > 5) {
        ctx.fillStyle = "rgb(10, 139, 21)";
    } else if (blinkLightState == 5) {
        if (testBool) {
            ctx.fillStyle = "rgb(10, 139, 21)";
        } else {
            ctx.fillStyle = "#202020";
        }
    } else {
        ctx.fillStyle = "#202020";
    }
    ctx.fill();
    ctx.stroke();
}


function ee() {
    // document.getElementById("allGraphWrapper").style.backgroundColor = "indianred";
    for (let dataType = 0; dataType < 2; dataType++) {
        for (let sensorNum = 0; sensorNum < dataSensorNum[dataType]; sensorNum++) {
            let lineColour = "#5CCDCD";
            scFull[dataType].seriesSet[sensorNum].options.strokeStyle = lineColour;
            // document.getElementById('button' + sensorNum + 'Div').style.color = lineColour;
            // document.getElementById("b" + sensorNum).checked = true;
        }
    }
    $("body").css("background-color", "indianred");
    $(".header").css("background-color", "#a24d4d");
    $(".userInterface").css("background-color", "indianred");
    $("#allGraphWrapper").css("background-color", "indianred");

}


// Used for testing
function getFakeData() {
    for (dataType = 0; dataType < 2; dataType++) {
        for (sensorNum = 0; sensorNum < dataSensorNum[dataType]; sensorNum++) {
            switch (dataTypeLetter[dataType]) {
                case 'P':
                    dataObject.P[sensorNum] = Math.pow(Math.log10(dataObject.P[sensorNum]) + (Math.random() * 10 - 5), 10);
                    break;
                case 'T':
                    dataObject.T[sensorNum] += Math.random() *2 -1;
                    break;
                case 'V':
                    dataObject.V[sensorNum] += Math.random() * 1 - 0.5;
                    break;
                default:
                    break;
            }
        }
    }
    dataObject.C += Math.random() * 1 - 0.5;
}


function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        //tabcontent[i].style.display = "none";
        tabcontent[i].style.visibility = "hidden";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    //document.getElementById(tabName).style.display = "block";
    document.getElementById(tabName).style.visibility = "visible";
    evt.currentTarget.className += " active";
    if(tabName=='TgraphTab'){
        selectedChart=0;
    }
    else if(tabName=='VgraphTab'){
        selectedChart=1;
    }
    setButtons();

}


/*
function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks, graphs;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      //tabcontent[i].style.display = "none";
      tabcontent[i].style.visibility = "hidden";
    }

    //need to change the visibility of the graphs, rather than display, so that the graphs keep updating even when hidden.
    showLess();
    graphs = document.getElementsByClassName("OVGraph");
    for( i = 0; i<graphs.length; i++){
        graphs[i].style.visibility = "hidden";
    }

  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    //document.getElementById(tabName).style.display = "block";
    document.getElementById(tabName).style.visibility = "visible";
    evt.currentTarget.className += " active";

    // Make graphs visible if first tab is selected.
    if(tabName=="graphTab"){
       showLess();
    }

  } 
  */


  function setAxes(){
      
      //pmin = document.getElementById("Pmin").value;
      //pmax = document.getElementById("Pmax").value;
      tmin = document.getElementById("Tmin").value;
      tmax = document.getElementById("Tmax").value;
      vmin = document.getElementById("Vmin").value;
      vmax = document.getElementById("Vmax").value;
      //console.log(pmin+" "+pmax+" "+tmin+" "+tmax+" "+vmin+" "+vmax);
      //console.log(scOverview[0].options.maxValue);
      //scOverview[0].options.minValue = pmin;
      //scOverview[0].options.maxValue = pmax;
      scFull[0].options.minValue = tmin;
      scFull[0].options.maxValue = tmax;
      scFull[1].options.minValue = vmin;
      scFull[1].options.maxValue = vmax;
      //console.log(scOverview[0].options.maxValue);
  }


  function createHistogram(){
    var bar_ctx = document.getElementById('bar-chart').getContext('2d');

    var blue_red_gradient = bar_ctx.createLinearGradient(0, 0, 0, 400);
    blue_red_gradient.addColorStop(0, 'red');
    blue_red_gradient.addColorStop(1, 'blue');

    


    bar_chart = new Chart(bar_ctx, {
        type: 'bar',
        data: {
            labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
            datasets: [{
                label: 'Difference Signal',
                data: readings,
                backgroundColor: blue_red_gradient,
                hoverBackgroundColor: blue_red_gradient,
                hoverBorderWidth: 2,
                hoverBorderColor: 'purple',
            }]
        },
        

        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'white'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255,1)'
                    }

                },
                x: {
                    grid: {
                        color: 'white'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255,1)'
                    }
                }
            },
            color: 'white',
            maintainAspectRatio: false,
            responsive: false,
            
                animation: {
                    duration: 0 // general animation time
                },
                hover: {
                    animationDuration: 0 // duration of animations when hovering an item
                },
                responsiveAnimationDuration: 0 // animation duration after a resize
            
        }

    });

  }




  function tick() {
    for (var i = 0; i < 12; i++) {
        if(DEBUG){
            readings[i] = Math.random() * 100
        }else{
            readings[i] = dataObject['Vdiff'][i]*1E3;
        }    
    }
    bar_chart.update()
}
