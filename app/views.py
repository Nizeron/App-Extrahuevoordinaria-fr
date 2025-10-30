from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import ensure_csrf_cookie
from django.shortcuts import render
from django.http import JsonResponse
from .models import ProgresoJugador, Items
import json

# Orden obligatorio de niveles (1→6)
ORDEN_MEJORAS = ["carbono", "solar", "buses", "techos", "agua", "luces"]

@login_required
@ensure_csrf_cookie        # asegura el CSRF para la primera carga 
def juego_view(request):
    progreso, _ = ProgresoJugador.objects.get_or_create(user=request.user)
    items=Items.objects.all()
        ctx = {
        "puntos": progreso.puntos,
        "click_power": progreso.click_power,
        'items':items,
    }
    return render(request, 'game.html', progreso.template_actual,ctx)#renderiza template actual


@login_required
def guardar_progreso(request):

    if request.method != "POST":
        return JsonResponse({"error": "Método no permitido"}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON inválido"}, status=400)

    progreso, _ = ProgresoJugador.objects.get_or_create(user=request.user)

    # Actualiza puntos / click_power si vienen
    if "puntos" in data:
        try:
            progreso.puntos = int(data["puntos"])
        except (TypeError, ValueError):
            pass

    if "click_power" in data:
        try:
            progreso.click_power = int(data["click_power"])
        except (TypeError, ValueError):
            pass

    # Avance de nivel SOLO si la mejora comprada es la siguiente en el orden
    mejora = data.get("mejora")
    if mejora:
        mejoras = dict(progreso.mejoras_desbloqueadas or {})
        # cuántas mejoras válidas ya tiene (en orden)
        ya = [m for m in ORDEN_MEJORAS if mejoras.get(m)]
        nivel_actual = len(ya)  # 0..6
        # siguiente mejora esperada (si aún falta alguna)
        if nivel_actual < len(ORDEN_MEJORAS):
            siguiente = ORDEN_MEJORAS[nivel_actual]
            if mejora == siguiente and not mejoras.get(mejora, False):
                # se desbloquea por PRIMERA vez la mejora correcta
                mejoras[mejora] = True
                progreso.mejoras_desbloqueadas = mejoras
                nuevo_nivel = nivel_actual + 1  # 1..6
                progreso.template_actual = f"game_{nuevo_nivel}.html"

    progreso.save()

    return JsonResponse({
        "status": "ok",
        "puntos": progreso.puntos,
        "click_power": progreso.click_power,
        "template_actual": progreso.template_actual
    })

def testing(request):
    items=Items.objects.all()
    return render(request,'testing.html',{'items':items})

