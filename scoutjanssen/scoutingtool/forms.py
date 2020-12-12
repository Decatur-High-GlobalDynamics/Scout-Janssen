from django import forms
from .models import Report, Match, Event, CurrentScouting

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
            'park',
            'climbAssist',
            'balanceResponsibility',
            'initiationLine', 
            'timeOnDefense',
            'bot1Defense',
            'bot2Defense',
            'bot3Defense',
            'timeInoperable',
            'notes',
            'estimate3pt',
            'mechanicalIssues',
            'connectionIssues',
            ]
    def __init__(self, *args, **kwargs):
        super(ScoutingForm, self).__init__(*args, **kwargs)
        #eventObject = Event.objects.filter(name = "gagr2019")
        currentEvent = CurrentScouting.objects.filter(pk = 1).values_list('event_id')
        self.fields['match'].queryset = Match.objects.filter(event_id = currentEvent[0]).order_by('number')

class ScouterForm(forms.Form):
    scouter_id_override = forms.CharField(label='scouter_id_override', max_length=20)