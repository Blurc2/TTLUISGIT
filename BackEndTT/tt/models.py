from django.db import models


class TipoUsuario(models.Model):
    nombre = models.CharField(max_length=60)

    def __str__(self):
        return self.nombre


class TipoTrabajo(models.Model):
    nombre = models.CharField(max_length=60)

    def __str__(self):
        return self.nombre


class TipoEquipo(models.Model):
    nombre = models.CharField(max_length=60)

    def __str__(self):
        return self.nombre

class GruposTrabajo(models.Model):
    nombre = models.CharField(max_length=60,primary_key=True)

class Ubicacion(models.Model):
    class Meta:
        unique_together = (('edificio', 'piso','sala'),)
    edificio = models.IntegerField()
    piso = models.IntegerField()
    sala = models.IntegerField()

    def __str__(self):
        return "Edificio "+str(self.edificio)+" Piso "+str(self.piso)+" sala "+str(self.sala)
    # depto = models.ForeignKey(Departamento, on_delete=models.CASCADE,blank = True,null=True)
    # depto = models.ForeignKey(SubDepartamento, on_delete=models.CASCADE,blank = True,null=True)

class Departamento(models.Model):
    nombre = models.CharField(max_length=60)
    grupoTrabajo = models.ManyToManyField(GruposTrabajo,blank=True,null=True)
    ubicacion = models.ForeignKey(Ubicacion, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre

class SubDepartamento(models.Model):
    nombre = models.CharField(max_length=60)
    depto = models.ForeignKey(Departamento, on_delete=models.CASCADE)
    ubicacion = models.ForeignKey(Ubicacion, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre


# class Mobiliario(models.Model):
#     nombre = models.CharField(max_length=40)
#     caracteristicas = models.CharField(max_length=200)
#     observaciones = models.CharField(max_length=200)
#     depto = models.ForeignKey(Departamento, on_delete=models.CASCADE)
#
#     def __str__(self):
#         return self.nombre

class InstalacionSoft(models.Model):
    nombre = models.CharField(max_length=60)
    descripcion = models.CharField(max_length=200)
    estado = models.CharField(max_length=20)


class Incidencia(models.Model):
    tipoincidencia = models.CharField(max_length=60)

class Satisfaccion(models.Model):
    confiabilidad = models.IntegerField()
    responsabilidad = models.IntegerField()
    seguridad = models.IntegerField()
    infrayservicios = models.IntegerField()

class Orden(models.Model):
    nofolio = models.CharField(max_length=30, primary_key=True)
    estado = models.IntegerField()
    descripcion = models.CharField(max_length=200)
    start = models.DateField()
    end = models.DateField()
    depto = models.ForeignKey(Departamento, on_delete=models.CASCADE)
    trabajo = models.ForeignKey(TipoTrabajo, on_delete=models.CASCADE)
    incidencia = models.ForeignKey(Incidencia, on_delete=models.CASCADE)
    instalacionsoft = models.ForeignKey(InstalacionSoft, on_delete=models.CASCADE)
    survey = models.OneToOneField(
        Satisfaccion,
        on_delete=models.CASCADE,
    )
    equipo = models.ForeignKey('Equipo', on_delete=models.CASCADE)


class Empleado(models.Model):
    idEmpleado = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=60)
    ap = models.CharField(max_length=60)
    am = models.CharField(max_length=60)
    email = models.CharField(max_length=60)
    password = models.CharField(max_length=60)
    numero = models.IntegerField()
    ext = models.IntegerField(null=True, blank=True)
    estado = models.BooleanField()
    tipo = models.ForeignKey(TipoUsuario, on_delete=models.CASCADE)
    trabajos = models.ForeignKey(TipoTrabajo, on_delete=models.CASCADE, null=True, blank=True)
    ordenes = models.ManyToManyField(Orden, blank=True)

    def __str__(self):
        return "Tipo: "+self.tipo.nombre+", Nombre: "+self.nombre

class Marca(models.Model):
    nombre = models.CharField(max_length=60)

    def __str__(self):
        return self.nombre

class Equipo(models.Model):
    idEquipo = models.IntegerField(primary_key=True)
    modelo = models.CharField(max_length=60,blank = True,null=True)
    mac = models.CharField(max_length=60,blank = True,null=True)
    ns = models.CharField(max_length=60)
    ip = models.CharField(max_length=60,blank = True,null=True)
    cambs = models.CharField(max_length=60,blank = True,null=True)
    sistema_operativo = models.CharField(max_length=60,blank = True,null=True)
    procesador = models.CharField(max_length=60,blank = True,null=True)
    num_puertos = models.CharField(max_length=60,blank = True,null=True)
    memoria_ram = models.CharField(max_length=60,blank = True,null=True)
    disco_duro = models.CharField(max_length=60,blank = True,null=True)
    idf = models.CharField(max_length=60,blank = True,null=True)
    caracteristicas = models.CharField(max_length=200,blank = True,null=True)
    observaciones = models.CharField(max_length=200,blank = True,null=True)
    tipo_equipo = models.ForeignKey(TipoEquipo, on_delete=models.CASCADE)
    depto = models.ForeignKey(Departamento, on_delete=models.CASCADE,blank = True,null=True)
    empleado = models.ForeignKey(Empleado, on_delete=models.CASCADE,blank = True,null=True)
    marca = models.ForeignKey(Marca, on_delete=models.CASCADE,blank = True,null=True)

    def __str__(self):
        return "Tipo: "+self.tipo_equipo.nombre+", Numero de serie: "+self.ns


