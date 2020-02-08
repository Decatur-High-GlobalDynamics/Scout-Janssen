from django.shortcuts import render
from .models import *
from .forms import ScoutingForm
# Create your views here.

def form(request, match):
    context = {'match': match}
    return render(request, 'scoutingtool/form.html', context);

def newform(request, match):
    scouting_form = ScoutingForm()
    context = {
        'match' : match,
        'form' : scouting_form,
        }
    }
    return render(request, 'scoutingtool/form.html', context);

@require_POST
def submitReport(request):
    form = ScoutingForm(request.POST)
    if form.is_valid():
        new_form = ScoutingForm.save()

    return redirect('index')