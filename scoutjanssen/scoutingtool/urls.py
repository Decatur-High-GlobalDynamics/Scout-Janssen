from django.urls import path

from . import views

urlpatterns = [
    path('', views.submitReport, name="submitReport"),
    path('scouter/', views.scouter, name='scouter'),
    path('syncDb/', views.syncDb, name='syncDb'),
    path('makeEvent/', views.makeEvent, name="makeEvent"),
]