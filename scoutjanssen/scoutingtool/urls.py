from django.urls import path

from . import views

urlpatterns = [
    path('', views.submitReport, name="submitReport"),
    path('scouter/', views.scouter, name='scouter'),
    path('syncDb/', views.syncDb, name='syncDb'),
    path('makeEvent/', views.makeEvent, name="makeEvent"),
    path('report/', views.report, name="report"),
    path('json/', views.exportDb, name="exportDb"),
    path('team/<int:number>/', views.teamPage, name="teamPage"),
    path('match/<int:number>/', views.matchPage, name="matchPage"),
    path('makeSchedule/', views.makeSchedule, name="makeSchedule"),
    path('csv', views.export_to_csv, name="Export to CSV"),
    path('help/', views.help, name="Help Page"),
    path('graphs/', views.graphs, name="AllTheTeamsStatsReport"),
    path('removeDuplicates/', views.removeDuplicates, name="Remove Duplicate Reports")
]