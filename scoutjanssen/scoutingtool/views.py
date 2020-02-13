from django.shortcuts import render, redirect
from .models import *
from django.db import models
from .forms import ScoutingForm, ScouterForm
import datetime
import requests

# Create your views here.
def schedule(request):
    context = {'scouter': request.COOKIES["scouter_id"]}
    return render(request, 'scoutingtool/scheduler.html', context)

def newform(request, match):

    scouting_form = ScoutingForm(initial={'notes': ''})
    context = {
        'match' : match,
        'form' : scouting_form,
    }
    return render(request, 'scoutingtool/form.html', context);

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
            return render(request, 'scoutingtool/newform.html', {'form': form_class,})
    else:
        return redirect('scouter')


def scouter(request):
    form = ScouterForm()
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




headers = {'X-TBA-Auth-Key': 'qg4OFGslC8z4zpEdaR8qPA79OUCBCi6dpE1tWLDEZqHARJLhu1GL7s8Aqq84vvJP'}
event_key = '2019gagr'      
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
        print(data[i])
        if(data[i]['comp_level'] == "qm"):
            keys = data[i]['alliances']['red']['team_keys'] + data[i]['alliances']['blue']['team_keys']
            match_number = data[i]['match_number']
            for x in range(len(keys)):
                keys[x] = keys[x][3:]
            p = Match(number = match_number, event = Event.objects.filter(name = event_key)[0], team1 = Team.objects.filter(number = keys[0])[0], team2 = Team.objects.filter(number = keys[1])[0], team3 = Team.objects.filter(number = keys[2])[0], team4 = Team.objects.filter(number = keys[3])[0], team5 = Team.objects.filter(number = keys[4])[0], team6 = Team.objects.filter(number = keys[5])[0])
            p.save()


    return render(request, 'scoutingtool/selectScout.html', {})

def makeEvent(request):
    d = datetime.date(2019, 11, 2)
    event = Event(name = event_key, start_date = d, end_date = d, year = 2019)
    event.save()
    return render(request, 'scoutingtool/selectScout.html', {})