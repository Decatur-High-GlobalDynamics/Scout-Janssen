from django.urls import path

from . import views

urlpatterns = [
    path('match/<int:match>/', views.form, name='form'),
    path('', views.submitReport, name="submitReport"),
    path('schedule/<int:id>', views.schedule, name='schedule'),
    path('scouter/', views.scouter, name='scouter'),
]