from django.contrib import admin
from django.urls import include, path
from django.contrib.auth import views as auth_views
from . import views
from app.views import juego_view   # ✅ Importas la vista correcta

urlpatterns = [
    path('admin/', admin.site.urls),

    # Página principal
    path('', views.homepage, name='home'),

    # Incluye rutas de la app del juego
    path('game/', include('app.urls')),

    # Otras páginas
    path('about/', views.about),
    path('sesion/', views.start_page, name='start'),

    # Autenticación
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='/'), name='logout'),
    path('register/', views.register, name='register'),

    # ✅ Rutas para niveles, usando la vista correcta desde la APP
    path('game.html', juego_view),
    path('game_1.html', juego_view, name='game1'),
    path('game_2.html', juego_view, name='game2'),
    path('game_3.html', juego_view, name='game3'),
    path('game_4.html', juego_view, name='game4'),
    path('game_5.html', juego_view, name='game5'),
    path('game_6.html', juego_view, name='game6'),
]
