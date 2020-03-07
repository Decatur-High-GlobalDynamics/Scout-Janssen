var reports;
var reportsOfTeam;
var varNames;
var statFormulas = [];
var ws;
var averages = {};
var matchData = {};
var teams;
var teamData;
var chart;
var pieChart = false;

function getTeamNum(){
    return location.href.substring(location.href.indexOf("#") + 1);
}

function run(teamNum){
    averages = {};
    matchData = {};
    reportsOfTeam = getReportsOfOneBot(teamNum, reports);
    varNames = Object.keys(reportsOfTeam[0]);
    reportsOfTeam = addOtherBotsToData(reports, reportsOfTeam);
    varNames.push("robots");
    var varNamesToDisplay = "";
    for(i of varNames){
        varNamesToDisplay += "<div class='highlightOnHover' draggable='true' ondragstart='dragStart(event)'>" + i + "</div>";
    }
    for(var i = 0; i < statFormulas.length; i++){
        evalStats(statFormulas[i].formula, statFormulas[i].name, reportsOfTeam);
    }

    return {averages: averages, matchData: matchData};
}

function dragStart(event) {
    //console.log(event);
    event.dataTransfer.setData("Text", "{" + event.target.innerText + "}");
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("Text");
    event.target.value += (data);
}

function addStat(){
    var text = document.getElementById("createStatsBox").value;
    document.getElementById("createStatsBox").value = "";
    var averageNames = Object.keys(averages);
    //console.log(varNames);
    for(var i = 0; i < varNames.length; i++){
        text = text.split("{" + varNames[i] + "}");
        var newText = "";
        for(var j = 0; j < text.length; j++){
            newText += text[j]
            if(j != text.length - 1) newText += "reportsOfTeam[i]['" + varNames[i] + "']";
        }
        text = newText;
    }

    console.log(averageNames);

    for(var i = 0; i < averageNames.length; i++){
        text = text.split("{" + averageNames[i] + "}");
        var newText = "";
        for(var j = 0; j < text.length; j++){
            newText += text[j]
            if(j != text.length - 1) newText += 'averages["' + averageNames[i] + '"]';
        }
        text = newText;
    }

    //console.log(text);
    statFormulas.push({name: document.getElementById("statsTitleBox").value, formula: text});
    ws.send(JSON.stringify(statFormulas[statFormulas.length - 1]));
}

function replaceAll(s, s1, s2){
    while(s != s.replace(s1, s2)){
        s = s.replace(s1, s2);
    }
    return s; 
}

function evalStats(formula, name, teamReports){
    var matchStats = [];
    var avg = 0;
    for(var i = 0; i < teamReports.length; i++){
        matchStats[i] = [reportsOfTeam[i].match, eval(formula)];
    }

    matchData[name] = [];

    for(var i = 0; i < matchStats.length; i++){
        matchData[name][matchStats[i][0]] = matchStats[i][1];
        avg += matchStats[i][1];
    }

    avg /= matchStats.length;

    averages[name] = avg;

    return;
}

//If "Position" changes, change this
function getTeamsOfMatch(reports, matchNumber){
    var robotsInMatch = [];
    for(var i = 0; i < reports.length; i++){
        if(reports[i].match == matchNumber){
            robotsInMatch[reports[i].position] = reports[i];
        }
    }

    for(var i = 1; i <= 6; i++){
        if(!robotsInMatch[i]){
            robotsInMatch[i] = makeNullReport();
        }
    }

    return robotsInMatch;
}

function makeNullReport(){
    var report = {};
    for(var i = 0; i < varNames.length; i++){
        report[varNames[i]] = NaN;
    }

    return report;
}

function addOtherBotsToData(reports, teamReports){
    for(var i = 0; i < teamReports.length; i++){
        teamReports[i]["robots"] = (getTeamsOfMatch(reports, teamReports[i].match));
    }

    return teamReports;
}

function cleanData(data){
    for(i in data){
        for(j of Object.keys(data[i])){
            if(data[i][j] == "true"){
                data[i][j] = 1;
            }
            else if(data[i][j] == "false"){
                data[i][j] = 0;
            }
            else{
                data[i][j] *= 1;
            }
        }
    }
    return data;
}

function startWSStuff(){
    ws = new WebSocket(getWSUrl());

    ws.onmessage = (message) => {
        statFormulas = JSON.parse(message.data);
        doTheRest();
    }
}

async function start(){
    reports = cleanData(await getReports());

    startWSStuff();
}

function doTheRest(){

    var selectVarBox = document.getElementById("selectVar");

    selectVarBox.innerHTML = "";

    teams = [];

    teamData = [];

    for(i of reports){
        if(!teams.includes(i.team)){
            teams.push(i.team);
            teamData[i.team] = run(i.team);
        }
    }

    var statNames = [];

    for(var i = 0; i < statFormulas.length; i++){
        statNames.push(statFormulas[i].name);
    }

    for(i of statNames){
        selectVarBox.innerHTML += "<option value='" + i + "'>" + i + "</option>";
    }

    console.log(teams);

    updateTable();
}

function updateTable(){
    var table = document.getElementById("dataTable");
    table.innerHTML = "";

    var sortingValName = document.getElementById("selectVar").value;

    teams = teams.sort((a, b) =>{
        return teamData[b]["averages"][sortingValName] - teamData[a]["averages"][sortingValName];
    });

    console.log(sortingValName);

    for(var i = 0; i < teams.length; i++){
        table.innerHTML += "<tr><td>" + teams[i] + "</td><td>" + teamData[teams[i]]["averages"][sortingValName] + "</td></tr>";
    }

    graphData();
}

function graphData(){

    var sortingValName = document.getElementById("selectVar").value;

    var teamNums = [];

    var teamAvgs = [];

    for(var i = 0; i < teams.length; i++){
        teamNums.push(teams[i]);
        teamAvgs.push(teamData[teams[i]]["averages"][sortingValName]);
    }

    var ctx = document.getElementById('chart').getContext('2d');

    var backColors = [];
    var borderColors = [];

    for(i in teamNums){
        var s;
        switch(i % 3){
            case 0:
                s = "10, 255";
                break;
            case 1:
                s = "255, 10";
                break;
            case 2:
                s = "255, 255";
                break;
        }

        backColors.push("rgba(0, " + s + ", 0.2)");
        borderColors.push("rgba(0, " + s + ", 1)");
    }

    if(chart == undefined){
        chart = new Chart(ctx, {
            type: (pieChart?"pie":"bar"),
            data: {
                labels: teamNums,
                datasets: [{
                    label: sortingValName,
                    data: teamAvgs,
                    backgroundColor: backColors,
                    borderColor: borderColors,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    } else {
        chart.data.datasets[0].data = teamAvgs;
        chart.data.datasets[0].label = sortingValName;
        chart.data.labels = teamNums;
        chart.update();
    }
}

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

if(getCookie("scouter_id") == undefined){
    alert("Please sign in.");
    window.location = "https://frc4026.com/scout/scouter";
}

if(getCookie("scouter_id") == "Zach"){
    pieChart = true;
}

start();
