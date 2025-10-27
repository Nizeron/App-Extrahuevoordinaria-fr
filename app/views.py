
from django.shortcuts import render
from django.http import JsonResponse
from .models import Items
from django.contrib.auth.decorators import login_required

def index(request):
    return render(request, 'app/index.html')

@login_required
def juego(request):
    return render(request, 'app/juego.html')

def items(request):
    return render(request, 'app/items_layout.html')
def item_list(request):
    ites=Items.objects.all()
    return render(request,'app/items_layout.html',{'items':items})
# Comentario prueba
