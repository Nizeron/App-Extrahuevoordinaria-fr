from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import ProgresoJugador

@receiver(post_save, sender=User)
def crear_progreso_usuario(sender, instance, created, **kwargs):
    if created:
        ProgresoJugador.objects.create(user=instance)
