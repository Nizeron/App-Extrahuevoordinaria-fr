from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import ensure_csrf_cookie
from django.shortcuts import render
from django.http import JsonResponse
from .models import ProgresoJugador, Items
import json

@login_required
@ensure_csrf_cookie        # asegura el CSRF para la primera carga
def juego_view(request):
    progreso, _ = ProgresoJugador.objects.get_or_create(user=request.user)
    items=Items.objects.all()
    return render(request, 'game.html', {
        "puntos": progreso.puntos,
        "click_power": progreso.click_power,
        'items':items,
    })


@login_required
def guardar_progreso(request):

    if request.method != "POST":
        return JsonResponse({"error": "Método no permitido"}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON inválido"}, status=400)

    progreso, _ = ProgresoJugador.objects.get_or_create(user=request.user)

    # ✅ puntos
    if "puntos" in data:
        try:
            progreso.puntos = int(data["puntos"])
        except ValueError:
            pass

    # ✅ click_power
    if "click_power" in data:
        try:
            progreso.click_power = int(data["click_power"])
        except ValueError:
            pass

    # ✅ template_actual (solo texto)
    if "template_actual" in data:
        progreso.template_actual = str(data["template_actual"])

    progreso.save()

    return JsonResponse({
        "status": "ok",
        "puntos": progreso.puntos,
        "click_power": progreso.click_power,
    })

def testing(request):
    items=Items.objects.all()
    return render(request,'testing.html',{'items':items})

