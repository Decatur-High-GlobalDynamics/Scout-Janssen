from django.forms import ModelForm, TextInput, Form
from .models import Report

class ScoutingForm(ModelForm):
    class Meta:
        model = Report
        fields = ['scouter']