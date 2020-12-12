from django.shortcuts import render, redirect
from .models import *
from django.db import models
from .forms import ScoutingForm, ScouterForm
import datetime
import requests
from django.core import serializers
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.models import User
from collections import deque
import random
import csv

# TheBlueAlliance Authentication Key for the API
headers = {'X-TBA-Auth-Key': 'qg4OFGslC8z4zpEdaR8qPA79OUCBCi6dpE1tWLDEZqHARJLhu1GL7s8Aqq84vvJP'}

#Current event key based on the first object in the CurrentScouting table.
event_key = CurrentScouting.objects.filter(pk = 1).values_list('event_id')[0][0]

# Create your views here.

def schedule(request): #User view for schedules
    schedules = Schedule.objects.all()
    if(not request.user.is_authenticated):
        return redirect('https://frc4026.com/accounts/google/login/')
    return render(request, 'scoutingtool/scheduler.html', {'schedules' : schedules})

def scouterOverride(request):
    if(not request.user.is_authenticated):
        return redirect('https://frc4026.com/accounts/google/login/')
    if request.user.groups.filter(name = "Scout").exists() and request.method == 'POST':
        form = ScouterForm(request.POST)
        response = HttpResponseRedirect('https://frc4026.com/scout/')
        if form.is_valid():
            response.set_cookie('scouter_id_override', form.cleaned_data['scouter_id_override'])
            return response
        else:
            return redirect('https://frc4026.com/scout/')
    else:
        return redirect('permissions/error/scout/')
    

def submitReport(request): #Main scouting form view
    if(not request.user.is_authenticated):
        return redirect('https://frc4026.com/accounts/google/login/')
    form_class = ScoutingForm
    scouter_override_form_class = ScouterForm
    if request.user.groups.filter(name = "Scout").exists():
        if(request.method == 'POST'): #If we get a POST request to this website (which is what happens when someone submits a form), use the ScoutingForm ModelForm. 
            form = ScoutingForm(request.POST)
            if form.is_valid():
                s = form.save(commit=False) #Don't commit so we can change info about it the report.
                scouter_override_cookie = request.COOKIES.get('scouter_id_override')
                if(scouter_override_cookie):
                    s.scouter =  scouter_override_cookie
                else:
                    s.scouter = request.user.username
                s = form.save() #Commit form to database.
                data = Report.objects.all()
                '''
                    When submitted, show currently submitted scouter reports. We should change this. Kind of odd. 
                    At the time, this was the best way to keep track of all of the reports.
                '''
                return render(request, 'scoutingtool/displaytestdata.html', { 
                    'data':data,
                })
            else:
                return render(request, 'scoutingtool/newform.html', {'form': form, }) #Pretty sure if this condition is hit, this will error. Someone should fix that.
        else:
            scouter_override_cookie = request.COOKIES.get('scouter_id_override')
            if(scouter_override_cookie):
                schedule = Schedule.objects.filter(scouter__iexact = scouter_override_cookie)
            else:
                schedule = Schedule.objects.filter(scouter__iexact = request.user.username)
            schedule = schedule[0]
            return render(request, 'scoutingtool/newform.html', {'form': form_class, 'schedule':schedule, 'scouter_override_form': scouter_override_form_class})
    else:
        return redirect('permissions/error/scout/')

def removeDuplicates(request):
    if(not request.user.is_authenticated):
        return redirect('https://frc4026.com/accounts/google/login/')
    real_report_ids = Report.objects.distinct("match_id").distinct("team_id").values('id')
    bad_reports = Report.objects.exclude(id__in = real_report_ids)
    bad_reports.delete()
    return render(request, 'scoutingtool/', {})

def scoutPermissionFail(request):
    return render(request, 'scoutingtool/scoutPermissionFail.html')
   
def syncDb(request):
    if(not request.user.is_authenticated):
        return redirect('https://frc4026.com/accounts/google/login/')
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
    if(not request.user.is_authenticated):
        return redirect('https://frc4026.com/accounts/google/login/')
    d = datetime.date(2020, 3, 6)
    event = Event(name = event_key, start_date = d, end_date = d, year = 2019)
    event.save()
    return render(request, 'scoutingtool/selectScout.html', {})

def report(request):
    if(not request.user.is_authenticated):
        return redirect('https://frc4026.com/accounts/google/login/')
    return render(request, 'scoutingtool/statsReport.html', {})

def exportDb(request):
    if(not request.user.is_authenticated):
        return redirect('https://frc4026.com/accounts/google/login/')
    data = serializers.serialize("json", Report.objects.all());
    return HttpResponse(data)

def teamPage(request, number):
    if(not request.user.is_authenticated):
        return redirect('https://frc4026.com/accounts/google/login/')
    teamInfo = Report.objects.filter(team_id = number)
    #print("Reports found with team " + str(number) + ": " + str(teamInfo.count()))
    return render(request, 'scoutingtool/teamPage.html', {'teamInfo' : teamInfo})

def matchPage(request, number):
    if(not request.user.is_authenticated):
        return redirect('https://frc4026.com/accounts/google/login/')
    matchInfo = Match.objects.filter(number = number).filter(event_id=CurrentScouting.objects.filter(pk = 1).values_list('event_id')[0])
    event = CurrentScouting.objects.filter(pk = 1).values_list('event_id')[0]
    match_id = Match.objects.filter(number = number).filter(event_id=event).values_list('id')[0][0]
    team1 = matchInfo[0].team1_id
    team = Team.objects.filter(number = team1)
    match = Match.objects.filter(number = number).filter(event_id=CurrentScouting.objects.filter(pk = 1).values_list('event_id')[0])
    team2 = matchInfo[0].team2_id
    team3 = matchInfo[0].team3_id
    team4 = matchInfo[0].team4_id
    team5 = matchInfo[0].team5_id
    team6 = matchInfo[0].team6_id
    reportsRobots = Report.objects.filter(match_id = match_id).values()
    return render(request, 'scoutingtool/matchPage.html', {
        'matchInfo' : matchInfo, 
        'reportsRobots': reportsRobots 
        })
    
def index(request):
    return render(request, 'scoutingtool/index.html', {})

def makeSchedule(request):
    if(not request.user.is_authenticated):
        return redirect('https://frc4026.com/accounts/google/login/')
    event_key = CurrentScouting.objects.filter(pk = 1).values_list('event_id')[0]
    matches = Match.objects.filter(event_id = event_key).values_list('number', flat=True)
    matches = list(matches)
    scouterNames = list(User.objects.filter(groups__name="Scout"))
    scouters = {}
    random.shuffle(scouterNames)
    for name in scouterNames:
        scouters[name] = {}
    for match in range(len(matches)):
        for i in range(6):
            team_id = Match.objects.filter(event_id = event_key).filter(number = matches[match]).values_list('team' + str(i + 1) + "_id", flat=True)[0]
            data = {"bot": team_id}
            scouters[scouterNames[i]][str(matches[match])] = data
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


def help(request):
    if(not request.user.is_authenticated):
        return redirect('https://frc4026.com/accounts/google/login/')
    return render(request, 'scoutingtool/help.html', {})

def graphs(request):
    if(not request.user.is_authenticated):
        return redirect('https://frc4026.com/accounts/google/login/')
    return render(request, 'scoutingtool/allTheTeamsReport.html', {})

def export_to_csv(request):
    model_class = Report

    meta = model_class._meta
    field_names = [field.name for field in meta.fields]

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename={}.csv'.format(meta)
    writer = csv.writer(response)

    writer.writerow(field_names)
    for obj in model_class.objects.all():
        row = writer.writerow([getattr(obj, field) for field in field_names])
    if(not request.user.is_authenticated):
        return redirect('https://frc4026.com/accounts/google/login/')
    return response