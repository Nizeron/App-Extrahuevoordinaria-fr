
from django.shortcuts import render
from django.http import JsonResponse
from .models import Guardado
from django.contrib.auth.decorators import login_required

def index(request):
    return render(request, 'app/index.html')

@login_required
def juego(request):
    return render(request, 'app/game.html')

# Comentario prueba
@login_required
def guardar_puntos(request):
    if request.method == 'POST':
        try:
            puntos = int(request.POST.get('puntos', 0))
            guardado = Guardado.objects.get(usuario=request.user)
            guardado.puntos = puntos
            guardado.save()
            return JsonResponse({'ok': True, 'puntos': guardado.puntos})
        except Guardado.DoesNotExist:
            return JsonResponse({'ok': False, 'error': 'Guardado no encontrado'})
    return JsonResponse({'ok': False, 'error': 'Método no permitido'})