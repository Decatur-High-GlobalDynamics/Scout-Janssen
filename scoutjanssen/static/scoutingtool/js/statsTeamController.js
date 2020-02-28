var reports;
var reportsOfTeam;
var varNames;
var statFormulas = [];
var ws;
var averages = {};

function getTeamNum(){
    console.log(location.href.indexOf("#"));
    return location.href.substring(location.href.indexOf("/#") + 2);
}

async function run(teamNum){
    //console.log(await getReports())
    reports = cleanData(await getReports());
    //console.log(reports);
    reportsOfTeam = getReportsOfOneBot(teamNum, reports);
    console.log(reportsOfTeam);
    varNames = Object.keys(reportsOfTeam[0]);
    reportsOfTeam = addOtherBotsToData(reports, reportsOfTeam);
    if(!(getTeamNum() > 0) || !(reportsOfTeam.length > 0)){
        document.body.innerHTML = "Error! Yell at Keon.";
    }
    varNames.push("robots");
    var varNamesToDisplay = "";
    for(i of varNames){
        varNamesToDisplay += "<div class='highlightOnHover' draggable='true' ondragstart='dragStart(event)'>" + i + "</div>";
    }
    document.getElementById("varnamelist").innerHTML += varNamesToDisplay;
    startWSStuff();
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

function createStatBox(formula, name, teamReports){
    var matchStats = [];
    var avg = 0;
    for(var i = 0; i < teamReports.length; i++){
        matchStats[i] = [reportsOfTeam[i].match, eval(formula)];
    }

    var box = "<div class='statBox'><h2>" + name + "</h2><table>";

    for(var i = 0; i < matchStats.length; i++){
        box += "<tr><td>Match " + matchStats[i][0] + ":</td><td> " + matchStats[i][1] + "</td></tr>";
        avg += matchStats[i][1];
    }

    avg /= matchStats.length;

    box += "<tr><td>Average:</td><td>" + avg + "</td></tr>";

    box += "</table></div>";

    averages[name] = avg;

    return box;
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
        while(document.getElementsByClassName("statBox")[0] != undefined){
            document.getElementsByClassName("statBox")[0].remove();
        }
        for(var i = 0; i < statFormulas.length; i++){
            document.getElementById("statBoxContainer").innerHTML += createStatBox(statFormulas[i].formula, statFormulas[i].name, reportsOfTeam);
        }
    }
}

run(getTeamNum());