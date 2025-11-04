from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import ensure_csrf_cookie
from django.shortcuts import render
from django.http import JsonResponse
from .models import ProgresoJugador, Items
import json

@login_required
@ensure_csrf_cookie        # asegura el CSRF para primera carga
def juego_view(request):
    progreso, _ = ProgresoJugador.objects.get_or_create(user=request.user)
    items=Items.objects.all()
    print(items)
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

    # puntos
    if "puntos" in data:
        try:
            progreso.puntos = int(data["puntos"])
        except ValueError:
            pass

    # click_power
    if "click_power" in data:
        try:
            progreso.click_power = int(data["click_power"])
        except ValueError:
            pass

    # template_actual (solo texto)
    if "template_actual" in data:
        progreso.template_actual = str(data["template_actual"])

    progreso.save()

    return JsonResponse({
        "status": "ok",
        "puntos": progreso.puntos,
        "click_power": progreso.click_power,
    })
@login_required
def guardar_comprado(request):
    print("llegó ", request.body)
    if request.method =='POST':
        try:
            data=json.loads(request.body)
        except ValueError:
            pass
    item = Items.objects.get(nombre= data['item'])
    print(item)
    if 'cantidad' in data:
        try:
            item.cantidad=int(data['cantidad'])
        except ValueError:
            pass
    item.save()
    return JsonResponse({
        'cantidad':item.cantidad,
        })

@login_required
def guardar_bonos(request):
    if request.method =='POST':
        print('bono:',request.body)
        data=json.loads(request.body)
        item=Items.objects.get(name=data['bonos'])
        if 'bonos' in data:
            item.bono=int(data['bono'])
    item.save()
    return


def testing(request):
    items=Items.objects.all()
    return render(request,'testing.html',{'items':items})
