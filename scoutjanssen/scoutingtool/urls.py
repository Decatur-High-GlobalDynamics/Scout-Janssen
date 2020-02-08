from django.urls import path

from . import views

urlpatterns = [
    path('match/<int:match>/', views.form, name='form'),
    path('submit/', views.submitReport, name="submitReport"),
    path('', views.form, name='form'),
    path('schedule/<int:id>', views.schedule, name='schedule'),
]