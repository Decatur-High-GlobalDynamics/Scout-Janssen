let scouters = [];
let matches = [];

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

function Match(blue, red, num, comp_level, time) {
    this.time = time;
    this.comp_level = comp_level;
    this.number = num;
    this.robots = blue.concat(red);
    this.filled = false;
    this.scouters = [];
}
function Scout(name, error, rank, matches) {
    this.name = name;
    this.error = error;
    this.rank = rank;
    this.matches = matches;
}


async function createMatches(event_key) {
    let createdMatches = [];
    await rqAPI('https://www.thebluealliance.com/api/v3/event/' + event_key + '/matches/simple', function () {
        response.json().then(function (value) {
            for (x in value) {
                let match = new Match(value[x].alliances.blue.team_keys, value[x].alliances.red.team_keys, value[x].match_number, value[x].comp_level, value[x].time);
                createdMatches.push(match);
            }
        });
    });
    return createdMatches;
    
}
async function addScout(name) {
    let scout = new Scout(name, 0, 100, []);
    scouters.push(scout);
    let canScout = true;
    let todo = [];
    let delay = 5;
    let offset = 0;
    for (var i = 0; i < matches.length; i++) {
        if (canScout) {
            if (matches[i].filled == false) {
                if (tooManySimiliar(scout, matches[i])) {
                    todo.push(i);
                }
                else {
                    if (matches[i - 3] != undefined) {
                        if (cm(matches[i - 1], scout.matches[2 + offset]) && cm(matches[i - 2], scout.matches[1 + offset]) && cm(matches[i - 3], scout.matches[0 + offset])) {
                            canScout = false;
                        }
                    }
                    scout.matches.push(matches[i]);
                    matches[i].scouters.push(scout);
                    if (matches[i].scouters.length == 6) {
                        matches[i].filled = true;
                    }
                }
            }
        }
        else {
            todo.push(i);
            delay--;
            if (delay == 0) {
                delay = 5;
                canScout = true;
                offset += 5;
            }
        }
    }
    todoFunction(scout, todo);

    console.log(todo)
}

function todoFunction(scout, todo) {
    for (y in todo) {
        //console.log(todo)
        if (matches[todo[y]].scouters.includes(scout)) {
            //Scouter is already scouting match
        }
        else {
            scout.matches.push(matches[todo[y]]);
            //console.log(scout.name + " scouting " + matches[y].number)
            matches[todo[y]].scouters.push(scout);
            if (matches[todo[y]].scouters.length == 6) {
                matches[todo[y]].filled = true;
            }
            todo.splice(y, 1);
        }
    }
}


function cm(m1, m2) {
    if (m1 == m2) {
        return true;
    }
    else {
        return false;
    }
}

function tooManySimiliar(scout, match) {
    let currMatch = match;
    let prevMatch = scout.matches[scout.matches.length - 1];
    let sameScouters = 0;
    if (prevMatch != undefined) {
        for (var a = 0; a < prevMatch.scouters.length; a++) {
            if (prevMatch.scouters[a] == currMatch.scouters[a]) {
                sameScouters++;
            }
        }
        if (sameScouters >= (Math.floor(Math.random() * 4))) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}


async function go() {
    var promise1 = new Promise(function (resolve, reject) {
        matches = createMatches("2019gagr");
        setTimeout(function () {
            resolve(matches);
        }, 300);
    });
    promise1.then(function (value) {
        matches = value.sort(function (a, b) { return a.time - b.time })
        console.log(matches);
        let people = ["Carter", "Hayden", "Max", "Keon", "Cory Xli", "Owen", "Scott", "Madeline", "Jacob", "Rohan", "Rohan 2"];
        people = shuffle(people);
        for (w in people) {
            addScout(people[w]);
        }
        tableCreate(scouters);
    })

}
go();





function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function tableCreate(scouters) {
    var body = document.getElementsByTagName('body')[0];
    var tbl = document.createElement('table');
    tbl.style.width = '100%';
    tbl.setAttribute('border', '1');
    let name;
    for (l in scouters) {
        name = scouters[l].name;
        var tr = document.createElement('tr');
        var names = document.createElement('td');
        var data = document.createElement('td');
        names.appendChild(document.createTextNode(name));
        let matchString = []
        for (p in scouters[l].matches) {
            matchString.push(scouters[l].matches[p].number + " " + scouters[l].matches[p].comp_level)
        }
        console.log(scouters[l].error)
        var textData = ("Matches: " + matchString.toString());
        data.appendChild(document.createTextNode(textData));
        tr.appendChild(names);
        tr.appendChild(data);
        tbl.appendChild(tr);
    }

    console.log(document.getElementsByTagName('body')[0]);
    body.appendChild(tbl)
}