
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import Progreso

def index(request):
    return render(request, 'app/index.html')

@login_required
def juego(request):
    return render(request, 'app/juego.html')

def lista_items(request):
    items=Progreso.objects.all()
    return render(request,'items/game.html',{'items':items})

# Comentario prueba
