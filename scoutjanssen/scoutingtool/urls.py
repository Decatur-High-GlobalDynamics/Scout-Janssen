from django.urls import path

from . import views

urlpatterns = [
    path('match/<int:match>/', views.form, name='form'),
]