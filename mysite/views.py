from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required


def homepage(request):
    return render(request, 'home.html')
def about(request):
    return render(request, 'about.html')
def game(request):
    return render(request, "juego.html")
def item_test(request):
    return render(request,"items_layout.html")


#Inicio de sesion
def start_page(request):
    return render(request, 'start.html')

from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm

def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():  # Valida username y contraseña
            form.save()      # Crea el usuario en auth_user
            return redirect('/game/')  # Redirige a la página de inicio del juego
    else:
        form = UserCreationForm()  # Muestra formulario vacío

    return render(request, 'register.html', {'form': form})

@login_required
def game(request):
    return render(request, "game.html")
