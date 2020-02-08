from django.forms import ModelForm, TextInput, Form
from .models import Report

class ScoutingForm(ModelForm):
    class Meta:
        model = Report
        fields = [
            'scouter', 
            'team',
            'match',
            'onePointMadeTele',
            'onePointMissedTele',
            'twoPointMadeTele',
            'twoPointMissedTele',
            'onePointMadeAuto',
            'onePointMissedAuto',
            'twoPointMadeAuto',
            'twoPointMissedAuto',
            'wheelTurn',
            'wheelColor',
            'climb',
            'climbAssist',
            'balanceResponsibility',
            'initiationLine', 
            'timeOnDefense',
            'bot1Defense',
            'bot2Defense',
            'bot3Defense',
            'timeInoperable',
            'notes',
            'estimate3pt'
            
            ]