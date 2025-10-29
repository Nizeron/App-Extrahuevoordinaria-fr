from django.urls import path
from . import views

urlpatterns = [
    path('game/', views.juego_view, name='juego'),
    path('guardar/', views.guardar_progreso, name='guardar_progreso'),
    path('testing/',views.lista_items, name='lista_items')
]
