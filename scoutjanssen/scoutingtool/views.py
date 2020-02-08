from django.shortcuts import render, redirect
from .models import *
from .forms import ScoutingForm
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
    if(request.method == 'POST'):
        form = ScoutingForm(request.POST)
        if form.is_valid():
            s = form.save()
            data = Report.objects.all()

            return render(request, 'scoutingtool/displaytestdata.html', {
                'data':data
            })
    else:
        form_class = ScoutingForm   
    return render(request, 'scoutingtool/newform.html', {
        'form': form_class,
    })