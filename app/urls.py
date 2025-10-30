from django.urls import path
from .views import juego_view, guardar_progreso

urlpatterns = [
    path('', juego_view, name='juego'),           # /game/ → entra al template actual
    path('guardar/', guardar_progreso, name='guardar_progreso'),
]
