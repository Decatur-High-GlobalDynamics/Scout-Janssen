let event_key = "2019gagr";
let team_key = "";
var packet = [];
async function go() {
    //headers
    const headers = new Headers();
    headers.append('X-TBA-Auth-Key', 'qg4OFGslC8z4zpEdaR8qPA79OUCBCi6dpE1tWLDEZqHARJLhu1GL7s8Aqq84vvJP')
    const init = {
        method: 'GET',
        headers: headers,
    }
    //Create request w/ url and function
    async function rqAPI(url, func) {
        const request = new Request(url, init)
        response = await fetch(request);
        func();
    }
    rqAPI('https://www.thebluealliance.com/api/v3/event/' + event_key + "/matches", function () {
        packet = [];
        response.json().then(function (value) {
            for (var i = 0; i < value.length; i++) {
                var match = new Match(value[i].match_number, value[i].alliances.blue.team_keys, value[i].alliances.red.team_keys, value[i].comp_level);
                packet.push(match);
            }
            packet.sort((a, b) => (b.num > a.num) ? -1 : 1);
            var bArr = [];
            var rArr = [];
            for (var i = 0; i < packet.length; i++) {
                //Change data before adding it to Red teams and Blue teams here
                bArr[i] = [];
                rArr[i] = [];
                for (var x = 0; x < packet[i].ba.length; x++) {
                    bArr[i].push(packet[i].ba[x].replace("frc", "")); //self deprecating comment 
                    rArr[i].push(packet[i].ra[x].replace("frc", ""));
                }


                if (packet[i].c_a === "qm") {
                    createRow("matchqm" + packet[i].num);
                    createColumn(packet[i].num, "matchqm" + packet[i].num);
                    createColumn(bArr[i][0] + ", " + bArr[i][1] + ", " + bArr[i][2], "matchqm" + packet[i].num);
                    createColumn(rArr[i][0] + ", " + rArr[i][1] + ", " + rArr[i][2], "matchqm" + packet[i].num);
                }
            }

        })
        createRow("Matches");
        createHead("Match:", "Matches");
        createHead("Blue Teams:", "Matches");
        createHead("Red Teams:", "Matches");
        createHead("Scores:", "Matches");
        createHead("Match Time:", "Matches");
    });

    function createRow(id = "") {
        let tr = document.createElement("tr");
        tr.appendChild(document.createTextNode(""));
        document.getElementById("TBATable").appendChild(tr);
        tr.id = id;
    }
    function createColumn(data, row, id = "") {
        let td = document.createElement("td");
        td.appendChild(document.createTextNode(data));
        document.getElementById(row).appendChild(td);
    }
    function createHead(data, row, id = "") {
        let th = document.createElement("th");
        th.appendChild(document.createTextNode(data));
        document.getElementById(row).appendChild(th);
    }
}
go();

function Match(number, blueAlliance, redAlliance, comp_level) {
    this.num = number;
    this.ba = blueAlliance;
    this.ra = redAlliance;
    this.c_a = comp_level;
}