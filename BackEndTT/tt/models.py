from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


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
    ubicacion = models.ForeignKey(Ubicacion,on_delete=models.SET(None))

    def as_dict(self):
        return {
            "nombre": self.nombre,
            "ubicacion": str(self.ubicacion)
            # other stuff
        }

    def __str__(self):
        return self.nombre

class SubDepartamento(models.Model):
    nombre = models.CharField(max_length=60)
    depto = models.ForeignKey(Departamento, on_delete=models.CASCADE)
    ubicacion = models.ForeignKey(Ubicacion, on_delete=models.SET(None))

    def as_dict(self):
        return {
            "nombre": self.nombre,
            "ubicacion": str(self.ubicacion)
            # other stuff
        }

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

    def __str__(self):
        return self.nombre + " - " + self.estado



class Incidencia(models.Model):
    tipoincidencia = models.CharField(max_length=60)

    def __str__(self):
        return str(self.tipoincidencia)

class Satisfaccion(models.Model):
    confiabilidad = models.IntegerField()
    responsabilidad = models.IntegerField()
    seguridad = models.IntegerField()
    infrayservicios = models.IntegerField()

class Orden(models.Model):
    nofolio = models.CharField(max_length=30, primary_key=True)
    estado = models.IntegerField()
    start = models.DateField()
    end = models.DateField(null=True, blank=True)
    depto = models.ForeignKey(Departamento, on_delete=models.CASCADE)
    subdepto = models.ForeignKey(SubDepartamento, on_delete=models.CASCADE, null=True, blank=True)
    trabajo = models.ForeignKey(TipoTrabajo, on_delete=models.CASCADE)
    incidencia = models.ForeignKey(Incidencia, on_delete=models.SET(None), null=True, blank=True)
    instalacionsoft = models.ForeignKey(InstalacionSoft, on_delete=models.CASCADE, null=True, blank=True)
    survey = models.OneToOneField(
        Satisfaccion,
        on_delete=models.SET(None),
        null = True, blank = True
    )
    equipo = models.ForeignKey('Equipo', on_delete=models.CASCADE)

    def as_dict(self):
        return {
            "nofolio": int(self.nofolio),
            "estado": self.estado,
            "start": self.start.strftime("%m/%d/%Y, %H:%M:%S"),
            "end": self.end.strftime("%m/%d/%Y, %H:%M:%S") if self.end is not None else None,
            "depto": self.depto.as_dict(),
            "subdepto": self.subdepto.as_dict() if self.subdepto is not None else None,
            "trabajo": str(self.trabajo),
            "incidencia": str(self.incidencia),
            "instalacionsoft": self.instalacionsoft,
            "equipo": str(self.equipo),
            # other stuff
        }

    def __str__(self):
        return str(self.nofolio)

class Descripcion(models.Model):
    descripcion = models.CharField(max_length=200)
    who = models.IntegerField()
    orden = models.ForeignKey(Orden, on_delete=models.CASCADE)

    def __str__(self):
        return "DESC Orden "+str(self.orden)

class Empleado(models.Model):
    # user = models.OneToOneField(User, on_delete=models.CASCADE)
    idEmpleado = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=60)
    ap = models.CharField(max_length=60)
    am = models.CharField(max_length=60)
    email = models.CharField(max_length=60)
    password = models.CharField(max_length=60)
    numero = models.CharField(max_length=10)
    uuid = models.CharField(max_length=100)
    ext = models.CharField(max_length=5,null=True, blank=True)
    estado = models.BooleanField()
    observaciones = models.CharField(max_length=200,null=True, blank=True)
    tipo = models.ForeignKey(TipoUsuario, on_delete=models.CASCADE)
    trabajos = models.ForeignKey(TipoTrabajo,on_delete=models.SET(None), null=True, blank=True)
    departamento = models.ForeignKey(Departamento, on_delete=models.SET(None), null=True, blank=True)
    subdepartamento = models.ForeignKey(SubDepartamento,on_delete=models.SET(None), null=True, blank=True)
    ordenes = models.ManyToManyField(Orden, blank=True)

    def as_dict(self):
        return {
            "idEmpleado": self.idEmpleado,
            "nombre": self.nombre,
            "ap": self.ap,
            "am": self.am,
            "email": self.email,
            "password": self.password,
            "numero": self.numero,
            "ext": self.ext,
            "estado": self.estado,
            "tipo": str(self.tipo),
            "trabajos": str(self.trabajos),
            "departamento": str(self.departamento),
            "subdepartamento": str(self.subdepartamento),
            # "ordenes": [thing.as_dict() for thing in self.ordenes.all()],
            # other stuff
        }


    def __str__(self):
        return "Tipo: "+self.tipo.nombre+", Nombre: "+self.nombre

# @receiver(post_save, sender=User)
# def create_user_profile(sender, instance, created, **kwargs):
#     if created:
#         Empleado.objects.create(user=instance)
#
# @receiver(post_save, sender=User)
# def save_user_profile(sender, instance, **kwargs):
#     instance.empleado.save()

class Marca(models.Model):
    nombre = models.CharField(max_length=60)

    def __str__(self):
        return self.nombre

class Equipo(models.Model):
    idEquipo = models.IntegerField(primary_key=True)
    modelo = models.CharField(max_length=60,blank = True,null=True)
    mac = models.CharField(max_length=17,blank = True,null=True)
    ns = models.CharField(max_length=60,blank = True,null=True)
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
    depto = models.ForeignKey(Departamento,on_delete=models.SET(None),blank = True,null=True)
    empleado = models.ForeignKey(Empleado,on_delete=models.SET(None), blank = True,null=True)
    marca = models.ForeignKey(Marca, on_delete=models.SET(None),blank = True,null=True)

    def __str__(self):
        return "Tipo: "+self.tipo_equipo.nombre+(", Numero de serie: "+ self.ns if self.ns is not None else ", Cambs: "+self.cambs)


