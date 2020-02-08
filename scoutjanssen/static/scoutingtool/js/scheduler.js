const event_key = "2019gagr"
const headers = new Headers();
headers.append('X-TBA-Auth-Key', 'qg4OFGslC8z4zpEdaR8qPA79OUCBCi6dpE1tWLDEZqHARJLhu1GL7s8Aqq84vvJP')
const init = {
    method: 'GET',
    headers: headers,
}
async function rqAPI(url, func) {
    const request = new Request(url, init)
    response = await fetch(request);
    func();
}

let scouterNames = ["Hayden", "Carter", "Charlotte", "Owen", "Otto", "Davis", "Rohan", "Keon", "Max", "Madeline", "Brooke", "David", "Will", "Yana"]
//shuffle(scouterNames) We want to store into db before this
let scouters = [];
class Scout {
    constructor(name){
        this.name = name;
        this.matches = [];
        this.rating = 0;
    }
}
class Match {
    constructor(number, comp_level, set){
        this.number = number;
        this.comp_level = comp_level;
        this.set = set;
        this.scouters = [];
        this.teams = (matches[number-1].alliances.blue.team_keys.concat(matches[number-1].alliances.red.team_keys))
    }
}
for(i in scouterNames){
    scouters.push(new Scout(scouterNames[i]))
}

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}
// [1, 2, 3, 4, 5, 6, 7, 8, 9]
//Take 1-6 and assign them matches 1
//Shift left 1
//Take 1-6 assign 2...
//Repeat till 16 iterations
//Reshuffle
//Start again
let matches = []
let compactMatches = [];
rqAPI('https://www.thebluealliance.com/api/v3/event/' + event_key + '/matches/simple', () => {
    response.json().then((value) => {
        matches = value;
        for(x in matches){
            compactMatches.push(new Match(matches[x].match_number, matches[x].comp_level, matches[x].set_number))
        }
        //console.log("Matches Length: " + compactMatches.length);
        for(x in compactMatches){
            if(compactMatches[x].comp_level == "qm"){
                //console.log(compactMatches[x])
                for(let i = 0; i < 6; i++){
                    scouters[i].matches.push({match: compactMatches[x], robot: (i+1)})
                    compactMatches[x].scouters.push({name: scouters[i].name, robot: i+1});
                }
                firstElement = scouters.shift();
                scouters.push(firstElement);
            }
        }
        tableCreate(scouters);
    });
});


function tableCreate(scouters) {
    var body = document.getElementsByTagName('body')[0];
    var tbl = document.createElement('table');
    tbl = document.getElementsByClassName('table')[0];
    tbl.style.width = '100%';
    tbl.style.border = "1px";
    let name;
    let color = 'darkGrey';
    for (l in scouters) { //For every scouter
        name = scouters[l].name;
        var tr = document.createElement('tr');
        var names = document.createElement('td');
        var data = document.createElement('td');
        names.appendChild(document.createTextNode(name));
        let matchString = []
        for (p in scouters[l].matches) { //For every match in scouter
            //console.log(compactMatches[p].scouters[1]["robot"]) //The index the scouter is in in the compactMatches[p].scouters array is the robot number
            let teamName = (scouters[l].matches[p].match.teams[scouters[l].matches[p].robot-1]).slice(3);
            let actualMatch = scouters[l].matches[p].match.number + ":" + teamName;
            matchString.push(" " + actualMatch);
        }
        //console.log(scouters[l].error)
        //console.log(matchString)
        matchString = matchString.sort((a, b) => {
            let aStop = a.indexOf(":");
            let bStop = b.indexOf(":");
            let match = ((a.slice(0, aStop)) - (b.slice(0, bStop)))
            return match
        });
        if(color == 'darkGrey'){
            data.classList.add("darkGrey");
            color = 'lightGrey'
        }
        else {
            color = 'darkGrey'
            data.classList.add("lightGrey"); //This is a stupid way to do this but i'm lazy
        }
        var textData = (matchString.toString());
        data.appendChild(document.createTextNode(textData));
        names.classList.add("bordered");
        tr.appendChild(names);
        tr.appendChild(data);
        tbl.appendChild(tr);
    }

    //console.log(document.getElementsByTagName('body')[0]);
    //body.appendChild(tbl)
}

