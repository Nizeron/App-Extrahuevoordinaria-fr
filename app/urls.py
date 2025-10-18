from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('juego/', views.juego, name='juego'),
    path('guardar-progreso/', views.guardar_progreso, name='guardar_progreso'),
    path('obtener-progreso/', views.obtener_progreso, name='obtener_progreso'),
]
