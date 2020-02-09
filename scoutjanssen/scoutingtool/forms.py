from django import forms
from .models import Report

class ScoutingForm(forms.ModelForm):
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

class ScouterForm(forms.Form):
    scouter_id = forms.CharField(label='scouter_id', max_length=20)