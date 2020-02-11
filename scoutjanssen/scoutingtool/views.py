from django.shortcuts import render, redirect
from .models import *
from django.db import models
from .forms import ScoutingForm, ScouterForm
import datetime
import requests

# Create your views here.

def form(request, match):
    context = {'match': match}
    return render(request, 'scoutingtool/form.html', context);

def schedule(request, id=0):
    context = {'id': id}
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
        
def syncDb(request):
    headers = {'X-TBA-Auth-Key': 'qg4OFGslC8z4zpEdaR8qPA79OUCBCi6dpE1tWLDEZqHARJLhu1GL7s8Aqq84vvJP'}
    event_key = '2019gagr'
    response = requests.get('https://www.thebluealliance.com/api/v3/event/' + event_key + '/teams', headers=headers)
    data = response.json()
    for i in range(len(data)):
        number = (data[i]['team_number'])
        name = (data[i]['nickname'])
        p = Team(number = number, name = name,)
        #p.events.add("GRITS")
        p.save();
    return render(request, 'scoutingtool/selectScout.html', {})

def makeEvent(request):
    d = datetime.date(2019, 11, 2)
    event = Event(name = "GRITS", start_date = d, end_date = d, year = 2019)
    event.save()
    return render(request, 'scoutingtool/selectScout.html', {})