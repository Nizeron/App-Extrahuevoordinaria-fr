from django.db import models
from django.contrib.auth.models import User

class ProgresoJugador(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    puntos = models.IntegerField(default=0)
    click_power = models.IntegerField(default=1)
    template_actual = models.CharField(max_length=100, default='game.html')
    mejoras_desbloqueadas = models.JSONField(default=dict)

    def __str__(self):
        return f"{self.user.username} - {self.puntos} pts - {self.click_power}/click"
