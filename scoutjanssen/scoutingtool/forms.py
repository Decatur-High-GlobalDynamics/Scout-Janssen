from django.forms import ModelForm, TextInput
from .models import Report

class ScoutingForm(ModelForm):
    class Meta:
        model = Report
        fields = ['__all__']
        exclude = ['last_modified']
        widgets = {
        'text' : forms.TextInput(
            
        )
