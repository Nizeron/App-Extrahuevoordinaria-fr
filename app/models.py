from django.db import models

from django.contrib.auth.models import User

class Progreso(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    botellas = models.IntegerField(default=0)
    desbloqueables = models.JSONField(default=list)

    def __str__(self):
        return f"{self.user.username} - {self.botellas} botellas"
# Create your models here.
#branch

#Crea base de datos 
class Guardado(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, related_name = 'Guardado')
    nombre_partida = models.CharField(max_length=100, default='Auto-guardado')
    puntos = models.IntegerField(default=0)
    def __str__(self):
        return f"{self.usuario.username}-{self.puntos} puntos"