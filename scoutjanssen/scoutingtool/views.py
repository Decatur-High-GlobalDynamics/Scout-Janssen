from django.shortcuts import render, redirect
from .models import *
from django.db import models
from .forms import ScoutingForm, ScouterForm
import datetime
import requests
from django.core import serializers
from django.http import HttpResponse
from collections import deque
import random


headers = {'X-TBA-Auth-Key': 'qg4OFGslC8z4zpEdaR8qPA79OUCBCi6dpE1tWLDEZqHARJLhu1GL7s8Aqq84vvJP'}
event_key = CurrentScouting.objects.filter(pk = 1).values_list('event_id')[0][0]

# Create your views here.
def schedule(request):
    context = {'scouter': request.COOKIES["scouter_id"]}
    return render(request, 'scoutingtool/scheduler.html', context)

def submitReport(request):
    form_class = ScoutingForm
    if "scouter_id" in request.COOKIES:
        if(request.method == 'POST'):
            form = ScoutingForm(request.POST)
            if form.is_valid():
                s = form.save(commit=False)
                s.scouter = request.COOKIES["scouter_id"]
                s = form.save()
                data = Report.objects.all()
                return render(request, 'scoutingtool/displaytestdata.html', {
                    'data':data,
                })
            else:
                return render(request, 'scoutingtool/newform.html', {'form': form,})
        else: 
            scouterCookie = request.COOKIES["scouter_id"]
            schedule = Schedule.objects.filter(scouter = scouterCookie)
            #schedule = request.COOKIES["scouter_id"]
            schedule = schedule[0].data
            return render(request, 'scoutingtool/newform.html', {'form': form_class, 'schedule':schedule})
    else:
        return redirect('scouter')


def scouter(request):
    form = ScouterForm(event_key)
    if "scouter_id" in request.COOKIES:
        response = render(request, 'scoutingtool/selectScout.html', {
            'scouter_id': "true",
        })
    else:
        response = render(request, 'scoutingtool/selectScout.html', {
            'scouter_id': "false",
        })
    if(request.method == 'POST'):
        form = ScouterForm(request.POST)
        if form.is_valid():
            new_scouter_id = request.POST.get('scouter_id', '')
            response = redirect('submitReport')
            response.set_cookie(key='scouter_id', value=new_scouter_id)
            return response
        else:
            return render(request, 'scoutingtool/selectScout.html', {})
    else:
        return response

   
def syncDb(request):
    #GET TEAMS
    response = requests.get('https://www.thebluealliance.com/api/v3/event/' + event_key + '/teams', headers=headers)
    data = response.json()
    for i in range(len(data)):
        number = (data[i]['team_number'])
        name = (data[i]['nickname'])
        if(len(name) > 10):
            name = (name[0:15] + "...") 
        p = Team(number = number, name = name,)
        #p.events.add("GRITS")
        p.save()

    #GET MATCHES
    response = requests.get('https://www.thebluealliance.com/api/v3/event/' + event_key + '/matches', headers=headers)
    data = response.json()
    event = event_key;
    for i in range(len(data)):
        match_number = None;
        if(data[i]['comp_level'] == "qm"):
            keys = data[i]['alliances']['red']['team_keys'] + data[i]['alliances']['blue']['team_keys']
            match_number = data[i]['match_number']
            for x in range(len(keys)):
                keys[x] = keys[x][3:]
            p = Match(number = match_number, event = Event.objects.filter(name = event_key)[0], team1 = Team.objects.filter(number = keys[0])[0], team2 = Team.objects.filter(number = keys[1])[0], team3 = Team.objects.filter(number = keys[2])[0], team4 = Team.objects.filter(number = keys[3])[0], team5 = Team.objects.filter(number = keys[4])[0], team6 = Team.objects.filter(number = keys[5])[0])
            p.save()


    for match in Match.objects.all():
        if Match.objects.filter(number=match.number).filter(event_id=CurrentScouting.objects.filter(pk = 1).values_list('event_id')[0]).count() > 1:
            match.delete()

    return render(request, 'scoutingtool/selectScout.html', {})

def makeEvent(request):
    d = datetime.date(2019, 11, 2)
    event = Event(name = event_key, start_date = d, end_date = d, year = 2019)
    event.save()
    return render(request, 'scoutingtool/selectScout.html', {})

def report(request):
    return render(request, 'scoutingtool/statsReport.html', {})

def exportDb(request):
    data = serializers.serialize("json", Report.objects.all());
    return HttpResponse(data)

def teamPage(request, number):
    teamInfo = Report.objects.filter(team_id = number)
    #print("Reports found with team " + str(number) + ": " + str(teamInfo.count()))
    return render(request, 'scoutingtool/teamPage.html', {'teamInfo' : teamInfo})

def matchPage(request, number):
    matchInfo = Match.objects.filter(number = number).filter(event_id=CurrentScouting.objects.filter(pk = 1).values_list('event_id')[0])
    return render(request, 'scoutingtool/matchPage.html', {'matchInfo' : matchInfo})

def index(request):
    return render(request, 'scoutingtool/index.html', {})

def makeSchedule(request):
    event_key = CurrentScouting.objects.filter(pk = 1).values_list('event_id')[0];
    matches = Match.objects.filter(event_id = event_key).values_list('number', flat=True)
    matches = list(matches)
    scouterNames = ["Hayden", "Carter", "Charlotte", "Owen", "Otto", "Davis", "Rohan", "Keon", "Max", "Madeline", "Brooke", "David", "Will", "Yana"]
    scouters = {}
    random.shuffle(scouterNames)
    for name in scouterNames:
        scouters[name] = {}
    for match in range(len(matches)):
        for i in range(6):
            data = {"bot": i}
            scouters[scouterNames[i]][match] = data
            #for match, push scouter data to scouting array
        scouterNames = deque(scouterNames)
        scouterNames.rotate(1)
        if(isinstance((match/16), int)):
            random.shuffle(scouterNames)
    for name in scouterNames:
        schedule = Schedule(scouter = name, data = scouters[name])
        schedule.save()
    return render(request, 'scoutingtool/index.html', {})
        
        

    #[1, 2, 3, 4, 5, 6, 7, 8, 9]
    #Take 1-6 and assign them matches 1
    #Shift scouters left 1
    #make 1-6 assign 2...
    #Repeat till 16 iterations
    #Reshuffle
    #Start again