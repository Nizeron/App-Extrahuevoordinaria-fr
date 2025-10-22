from django.db import models

from django.contrib.auth.models import User

class Progreso(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    botellas = models.IntegerField(default=0)
    desbloqueables = models.JSONField(default=list)

    def __str__(self):
        return f"{self.user.username} - {self.botellas} botellas"
# Create your models here.

# Create your models here.