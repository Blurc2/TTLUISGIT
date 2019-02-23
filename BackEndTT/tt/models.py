from django.db import models

class tipousuario(models.Model):
	nombre=models.CharField(max_length=60)
	def __str__(self):
		return self.nombre

class empleado(models.Model):
	idEmpleado=models.IntegerField(primary_key=True)
	nombre=models.CharField(max_length=60)
	ap=models.CharField(max_length=60)
	am=models.CharField(max_length=60)
	email=models.CharField(max_length=60)
	password=models.CharField(max_length=60)
	tipo=models.ForeignKey(tipousuario, on_delete=models.CASCADE)
	def __str__(self):
		return self.nombre

