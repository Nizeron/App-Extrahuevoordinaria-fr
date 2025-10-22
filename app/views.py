
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

def index(request):
    return render(request, 'app/index.html')

@login_required
def juego(request):
    return render(request, 'app/juego.html')

# Comentario prueba
