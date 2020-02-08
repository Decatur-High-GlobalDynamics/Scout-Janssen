//Takes one bot's match
function calcBotUnreliantMatch(info){

  info.totalHatches = (1 * info["HA"]) + (1 * info["HT"]);
  info.totalCargo = 0 + info["CA"] + info["CT"];
  info.totalHatchPoints = info.totalHatches * 2;
  info.totalCargoPoints = info.totalCargo * 3;
  info.totalCyclePoints = 0 + (info["HT"] * 2) + (info["CT"]);
  info.totalAutoPoints = (info["jumpLevel"] * 3) + (info["HA"] * 2) + (info["CA"] * 3);
  info.climbPoints = 0;
  switch(info["climbLevel"]){
    case 0:
      info.climbPoints = 0;
      break;
    case 1:
      info.climbPoints = 3;
      break;
    case 2:
      info.climbPoints = 6;
      break;
    case 3:
      info.climbPoints = 12;
      break;
  }
  info.climbAssistPoints = (info["habAssistLevel2"] * 3) + (info["habAssistLevel3"] * 9);
  info.totalEndgamePoints = 0 + info.climbPoints + info.climbAssistPoints;
  info.totalOffensePoints = 0 + info.totalAutoPoints + info.totalCyclePoints + info.totalEndgamePoints;

  return info;
}

function getMatchWithNumber(reports, matchNum){
  var newReports = [];
  for(var i = 0; i < reports.length; i++){
    if(reports[i].matchNumber == matchNum){
      newReports.push(reports[i]);
    }
  }

  return newReports;
}

function getBotsInMatch(match){
  var bots = {};
  for(i of match){
      bots["bot" + match[i].position] = i;
  }

  return bots;
}

//Takes array of variables, replaces ? with them
function average(variables, s){
  var sum = 0;
  for(i of variables){
    sum += eval(s.replace("?", i));
  }

  sum /= variables.length;
}

//Takes all matches of one bot as info
function getAllAverageDataOnBot(info){
  var keys = Object.keys(info);
  var subKeys = Object.keys(info[keys[0]]);
  for(var i = 0; i < Object.entries(info[keys[0]]).length; i++){
    var variables = [];
    for(var j = 0; j < Object.entries(info).length; j++){
      variables[j] = info[keys[i]][subKeys[j]];
    }
    info[keys.length] = [];
    info[keys.length][subKeys[i] + "Average"] = average(variables, "?");
  }

  return info;
}

//Takes one bot's match
function calcBotReliantMatch(info){

}

async function getReports(){
  try{
    return (await fetch("http://71.204.66.21/printDB.php/?table=reports")).json();
  } catch(e) {
    return JSON.parse(`[{"id":"1","jumpLevel":"0","HA":"0","CA":"0","HT":"0","CT":"0","highCargo":"false","highHatch":"false","timeOnDefense":"0","timeOnBot1":"0","timeOnBot2":"0","timeOnBot3":"0","climbLevel":"0","timeBroke":"0","mechanicalIssues":"false","connectionIssues":"true","position":"3","teamNumber":"6829","matchNumber":"19","setNumber":"0","compLevel":"qm","notes":"RIP Bot","offensivePenalties":"0","defensivePenalties":"0","HAM":"0","CAM":"0","CTM":"0","HTM":"0","climbAssistCount":"0"},{"id":"5","jumpLevel":"2","HA":"0","CA":"0","HT":"0","CT":"0","highCargo":"false","highHatch":"false","timeOnDefense":"0","timeOnBot1":"0","timeOnBot2":"0","timeOnBot3":"0","climbLevel":"0","timeBroke":"99.75","mechanicalIssues":"false","connectionIssues":"true","position":"2","teamNumber":"4509","matchNumber":"13","setNumber":"0","compLevel":"qm","notes":"RIP Bot","offensivePenalties":"0","defensivePenalties":"0","HAM":"0","CAM":"0","CTM":"1","HTM":"0","climbAssistCount":"0"},{"id":"11","jumpLevel":"2","HA":"0","CA":"0","HT":"2","CT":"0","highCargo":"false","highHatch":"false","timeOnDefense":"0","timeOnBot1":"0","timeOnBot2":"0","timeOnBot3":"0","climbLevel":"0","timeBroke":"84.25","mechanicalIssues":"false","connectionIssues":"true","position":"1","teamNumber":"6829","matchNumber":"15","setNumber":"1","compLevel":"qm","notes":"aaaaaa","offensivePenalties":"0","defensivePenalties":"0","HAM":"0","CAM":"0","CTM":"0","HTM":"0","climbAssistCount":"0"},{"id":"12","jumpLevel":"2","HA":"1","CA":"0","HT":"4","CT":"4","highCargo":"true","highHatch":"true","timeOnDefense":"0","timeOnBot1":"0","timeOnBot2":"0","timeOnBot3":"0","climbLevel":"3","timeBroke":"0","mechanicalIssues":"false","connectionIssues":"false","position":"2","teamNumber":"4910","matchNumber":"16","setNumber":"0","compLevel":"qm","notes":"","offensivePenalties":"0","defensivePenalties":"0","HAM":"0","CAM":"0","CTM":"0","HTM":"0","climbAssistCount":"0"},{"id":"14","jumpLevel":"0","HA":"0","CA":"0","HT":"0","CT":"0","highCargo":"false","highHatch":"false","timeOnDefense":"0","timeOnBot1":"0","timeOnBot2":"0","timeOnBot3":"0","climbLevel":"0","timeBroke":"0","mechanicalIssues":"false","connectionIssues":"true","position":"3","teamNumber":"6829","matchNumber":"19","setNumber":"0","compLevel":"qm","notes":"RIP Bot","offensivePenalties":"0","defensivePenalties":"0","HAM":"0","CAM":"0","CTM":"0","HTM":"0","climbAssistCount":"0"},{"id":"15","jumpLevel":"1","HA":"0","CA":"0","HT":"0","CT":"0","highCargo":"false","highHatch":"false","timeOnDefense":"0","timeOnBot1":"0","timeOnBot2":"0","timeOnBot3":"0","climbLevel":"1","timeBroke":"0","mechanicalIssues":"true","connectionIssues":"false","position":"3","teamNumber":"1002","matchNumber":"18","setNumber":"0","compLevel":"qm","notes":"","offensivePenalties":"0","defensivePenalties":"0","HAM":"0","CAM":"0","CTM":"0","HTM":"0","climbAssistCount":"0"},{"id":"17","jumpLevel":"1","HA":"0","CA":"0","HT":"3","CT":"3","highCargo":"true","highHatch":"true","timeOnDefense":"0","timeOnBot1":"0","timeOnBot2":"0","timeOnBot3":"0","climbLevel":"1","timeBroke":"0","mechanicalIssues":"false","connectionIssues":"false","position":"4","teamNumber":"2974","matchNumber":"1","setNumber":"1","compLevel":"sf","notes":"Nada","offensivePenalties":"0","defensivePenalties":"0","HAM":"1","CAM":"0","CTM":"1","HTM":"2","climbAssistCount":"0"},{"id":"18","jumpLevel":"1","HA":"0","CA":"0","HT":"2","CT":"0","highCargo":"false","highHatch":"false","timeOnDefense":"0","timeOnBot1":"0","timeOnBot2":"0","timeOnBot3":"0","climbLevel":"0","timeBroke":"0","mechanicalIssues":"true","connectionIssues":"false","position":"2","teamNumber":"1102","matchNumber":"1","setNumber":"0","compLevel":"sf","notes":"im a curse","offensivePenalties":"0","defensivePenalties":"0","HAM":"0","CAM":"0","CTM":"0","HTM":"0","climbAssistCount":"0"},{"id":"19","jumpLevel":"0","HA":"0","CA":"0","HT":"4","CT":"0","highCargo":"false","highHatch":"false","timeOnDefense":"0","timeOnBot1":"0","timeOnBot2":"0","timeOnBot3":"0","climbLevel":"1","timeBroke":"0","mechanicalIssues":"true","connectionIssues":"false","position":"1","teamNumber":"1261","matchNumber":"0","setNumber":"1","compLevel":"qm","notes":"cargo grabber was broken ish","offensivePenalties":"0","defensivePenalties":"0","HAM":"0","CAM":"0","CTM":"0","HTM":"0","climbAssistCount":"0"},{"id":"20","jumpLevel":"0","HA":"1","CA":"0","HT":"0","CT":"2","highCargo":"true","highHatch":"true","timeOnDefense":"0","timeOnBot1":"0","timeOnBot2":"0","timeOnBot3":"0","climbLevel":"0","timeBroke":"0","mechanicalIssues":"true","connectionIssues":"false","position":"2","teamNumber":"6829","matchNumber":"3","setNumber":"0","compLevel":"sf","notes":"Problems grabbing cargo","offensivePenalties":"0","defensivePenalties":"0","HAM":"0","CAM":"0","CTM":"0","HTM":"0","climbAssistCount":"0"},{"id":"21","jumpLevel":"1","HA":"0","CA":"0","HT":"4","CT":"3","highCargo":"false","highHatch":"false","timeOnDefense":"0","timeOnBot1":"0","timeOnBot2":"0","timeOnBot3":"0","climbLevel":"1","timeBroke":"0","mechanicalIssues":"false","connectionIssues":"false","position":"4","teamNumber":"2974","matchNumber":"2","setNumber":"1","compLevel":"qm","notes":"Can't do high","offensivePenalties":"0","defensivePenalties":"0","HAM":"0","CAM":"0","CTM":"0","HTM":"0","climbAssistCount":"0"},{"id":"23","jumpLevel":"0","HA":"0","CA":"0","HT":"0","CT":"0","highCargo":"false","highHatch":"false","timeOnDefense":"102.75","timeOnBot1":"0","timeOnBot2":"0","timeOnBot3":"0","climbLevel":"3","timeBroke":"0","mechanicalIssues":"false","connectionIssues":"false","position":"1","teamNumber":"832","matchNumber":"2","setNumber":"2","compLevel":"sf","notes":"","offensivePenalties":"0","defensivePenalties":"0","HAM":"0","CAM":"0","CTM":"0","HTM":"0","climbAssistCount":"0"},{"id":"24","jumpLevel":"0","HA":"0","CA":"0","HT":"0","CT":"0","highCargo":"false","highHatch":"false","timeOnDefense":"0","timeOnBot1":"0","timeOnBot2":"0","timeOnBot3":"0","climbLevel":"0","timeBroke":"0","mechanicalIssues":"false","connectionIssues":"false","position":"0","teamNumber":"0","matchNumber":"8","setNumber":"0","compLevel":"qm","notes":"","offensivePenalties":"0","defensivePenalties":"0","HAM":"0","CAM":"0","CTM":"0","HTM":"0","climbAssistCount":"0"},{"id":"25","jumpLevel":"0","HA":"0","CA":"0","HT":"0","CT":"0","highCargo":"false","highHatch":"false","timeOnDefense":"0","timeOnBot1":"0","timeOnBot2":"0","timeOnBot3":"0","climbLevel":"0","timeBroke":"0","mechanicalIssues":"false","connectionIssues":"false","position":"0","teamNumber":"0","matchNumber":"0","setNumber":"1","compLevel":"qm","notes":"","offensivePenalties":"0","defensivePenalties":"0","HAM":"0","CAM":"0","CTM":"0","HTM":"0","climbAssistCount":"0"}]`);
  }
}

function getReportsOfOneBot(teamNum, reports){
  var rep = [];
  for(i of reports){
    if(i.teamNumber == teamNum){
      rep.push(i);
    }
  }

  return rep;
}

function calcBotStuffReliantOnTeams(info){
  info.defensePointsBotFour = info["badBot1"]["totalCyclePoints"]  * 115 / (115 - info["defTimeOnBotOne"] - info["badBot1"]["timeInable"]);
  info.defensePointsBotFive = info["badBot2"]["totalCyclePoints"]  * 115 / (115 - info["defTimeOnBotTwo"] - info["badBot2"]["timeInable"]);
  info.defensePointsBotSix = info["badBot3"]["totalCyclePoints"]  * 115 / (115 - info["defTimeOnBotThree"] - info["badBot3"]["timeInable"]);

  info.totalDefensePoints = info.defensePointsBotFive + info.defensePointsBotFour + info.defensePointsBotSix;

  info.netOffensePoints = info.totalOffensePoints - info.offensePenalties;

  info.netDefensePoints = info.netDefensePoints - info.defensePenalties;

  info.totalContribution = info.totalOffensePoints + info.totalDefensePoints;

  info.netContribution = info.netDefensePoints + info.netOffensePoints;

  return info;
}

//TODO: duress + points given

/*async function run(teamNumber){
  var data = await getReports();
  var botData = getReportsOfOneBot(teamNumber, data);
  for(i in botData){
    botData[i] = calcBotUnreliantMatch(botData[i]);
  }
  return botData;
}*/