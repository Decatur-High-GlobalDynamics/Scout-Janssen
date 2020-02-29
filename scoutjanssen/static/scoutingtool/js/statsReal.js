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

async function rqAPI(url, func){
  const init = {
    method: 'GET',
  }
  const request = new Request(url, init)
  let response = await fetch(request);
  func(response);
}

async function getReports(){
  var reports;
  var newReports = [];
  await rqAPI('https://frc4026.com/scout/json', async (response) => {
    response.json().then(async (value) => {
      for(var i = 0; i < value.length; i++){
        newReports.push(value[i].fields);
      }
      console.log(newReports)
      return newReports;
    })
  });
}

function getReportsOfOneBot(teamNum, reports){
  var rep = [];
  for(i of reports){
    if(i.team == teamNum){
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