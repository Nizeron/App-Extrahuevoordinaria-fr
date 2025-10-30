from django.urls import path
from .views import juego_view, guardar_progreso

urlpatterns = [
    path('game/', views.juego_view, name='juego'),
    path('guardar/', views.guardar_progreso, name='guardar_progreso'),
    path('testing/',views.testing, name='test_lista_items'),
    path('game/',views.items_juego,name='items'),
    path('', juego_view, name='juego'),           # /game/ → entra al template actual
    path('guardar/', guardar_progreso, name='guardar_progreso'),
]
