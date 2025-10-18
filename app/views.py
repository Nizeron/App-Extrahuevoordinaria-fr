
from django.shortcuts import render
from django.http import JsonResponse
from .models import Progreso
from django.contrib.auth.decorators import login_required

def index(request):
    return render(request, 'app/index.html')

@login_required
def juego(request):
    return render(request, 'app/juego.html')

@login_required
def guardar_progreso(request):
    if request.method == 'POST':
        botellas = int(request.POST.get('botellas', 0))
        desbloqueables = request.POST.getlist('desbloqueables[]')
        progreso, created = Progreso.objects.get_or_create(user=request.user)
        progreso.botellas = botellas
        progreso.desbloqueables = desbloqueables
        progreso.save()
        return JsonResponse({'status': 'ok'})
    return JsonResponse({'status': 'error'})

@login_required
def obtener_progreso(request):
    progreso, created = Progreso.objects.get_or_create(user=request.user)
    return JsonResponse({
        'botellas': progreso.botellas,
        'desbloqueables': progreso.desbloqueables
    })

# Create your views here.
