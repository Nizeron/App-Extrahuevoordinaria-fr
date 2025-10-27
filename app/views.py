
from django.shortcuts import render
from django.http import JsonResponse
from .models import Items
from django.contrib.auth.decorators import login_required

def index(request):
    return render(request, 'app/index.html')

@login_required
def juego(request):
    return render(request, 'app/juego.html')
def item_lsit(request):
    items=Items.objects.all()
    return render(request, 'app/item_layout.html')

# Comentario prueba
