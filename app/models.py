from django.db import models

from django.contrib.auth.models import User

class Progreso(models.Model):
    nombre = models.CharField(max_length=20, null=True,blank=True)
    costo = models.IntegerField(default=0,null=True,blank=True)
    about = models.TextField(default=20)
    incremento = models.IntegerField(default=0,null=True,blank=True)

