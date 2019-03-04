from django.db import models

class TipoUsuario(models.Model):
	nombre=models.CharField(max_length=60)
	def __str__(self):
		return self.nombre

class TipoTrabajo(models.Model):
	nombre=models.CharField(max_length=60)
	def __str__(self):
		return self.nombre

class TipoEquipo(models.Model):
	nombre=models.CharField(max_length=60)
	def __str__(self):
		return self.nombre

class Departamento(models.Model):
	laboratorio=models.CharField(max_length=60)
	nombre = models.CharField(max_length=60)
	def __str__(self):
		return self.nombre

class Ubicacion(models.Model):
	edificio = models.IntegerField()
	piso = models.IntegerField()
	sala = models.IntegerField()
	depto = models.ForeignKey(Departamento, on_delete=models.CASCADE)


class Mobiliario(models.Model):
	nombre = models.CharField(max_length=40)
	caracteristicas = models.CharField(max_length=200)
	observaciones = models.CharField(max_length=200)
	depto = models.ForeignKey(Departamento, on_delete=models.CASCADE)
	def __str__(self):
		return self.nombre

class SubDepartamento(models.Model):
	nombre = models.CharField(max_length=60)
	depto = models.ForeignKey(Departamento, on_delete=models.CASCADE)
	def __str__(self):
		return self.nombre

class Equipo(models.Model):
	idEquipo = models.IntegerField(primary_key=True)
	modelo = models.CharField(max_length=60)
	mac = models.CharField(max_length=60)
	ns = models.CharField(max_length=60)
	ip = models.CharField(max_length=60)
	cambs = models.CharField(max_length=60)
	sistema_operativo = models.CharField(max_length=60)
	procesador = models.CharField(max_length=60)
	num_puertos = models.CharField(max_length=60)
	memoria_ram = models.CharField(max_length=60)
	disco_duro = models.CharField(max_length=60)
	idf = models.CharField(max_length=60)
	caracteristicas = models.CharField(max_length=200)
	observaciones = models.CharField(max_length=200)
	tipo_equipo = models.ForeignKey(TipoEquipo, on_delete=models.CASCADE)
	ubicacion = models.ForeignKey(Ubicacion, on_delete=models.CASCADE)


class Marca(models.Model):
	nombre=models.CharField(max_length=60)
	equipo = models.ForeignKey(Equipo, on_delete=models.CASCADE)


class InstalacionSoft(models.Model):
	nombre=models.CharField(max_length=60)
	descripcion=models.CharField(max_length=200)
	estado=models.CharField(max_length=20)

class Incidencia(models.Model):
	tipoincidencia=models.CharField(max_length=60)

class GruposTrabajo(models.Model):
	nombre=models.CharField(max_length=60)
	equipo = models.ForeignKey(Departamento, on_delete=models.CASCADE)

class Orden(models.Model):
	estado = models.IntegerField()
	descripcion = models.CharField(max_length=200)
	start = models.DateField()
	end = models.DateField()
	depto = models.ForeignKey(Departamento, on_delete=models.CASCADE)
	trabajo = models.ForeignKey(TipoTrabajo, on_delete=models.CASCADE)
	incidencia = models.ForeignKey(Incidencia, on_delete=models.CASCADE)
	instalacionsoft = models.ForeignKey(InstalacionSoft, on_delete=models.CASCADE)
	equipo = models.ForeignKey(Equipo, on_delete=models.CASCADE)

class Empleado(models.Model):
	idEmpleado=models.IntegerField(primary_key=True)
	nombre=models.CharField(max_length=60)
	ap=models.CharField(max_length=60)
	am=models.CharField(max_length=60)
	email=models.CharField(max_length=60)
	password=models.CharField(max_length=60)
	tipo=models.ForeignKey(TipoUsuario, on_delete=models.CASCADE)
	trabajos = models.ForeignKey(TipoTrabajo, on_delete=models.CASCADE)
	ordenes = models.ManyToManyField(Orden, blank=True)
	def __str__(self):
		return self.nombre

class Satisfaccion(models.Model):
	idSatisfaccion = models.IntegerField(primary_key=True)
	confiabilidad=models.IntegerField()
	responsabilidad=models.IntegerField()
	seguridad=models.IntegerField()
	infrayservicios=models.IntegerField()
	empleado = models.ForeignKey(Empleado, on_delete=models.CASCADE)