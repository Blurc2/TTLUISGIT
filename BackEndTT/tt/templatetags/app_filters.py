from django import template
import datetime
from datetime import date, timedelta

register = template.Library()

@register.filter(name='getgap')
def getgap(value,arg):
    val="{0:.2f}".format(float(value)-float(arg))
    if  float(val) < 0:
        val = 0
    return val
@register.filter(name='lessdec')
def lessdec(value):
    val = "{0:.2f}".format(float(value))
    if  float(val) < 0:
        val = 0
    return val

@register.filter(name='getVisitasRecomendadas')
def getVisitasRecomendadas(value):
    nueva_cad = value.replace("(","")
    nueva_cad = nueva_cad.split(")")
    nueva_cad = nueva_cad[0:len(nueva_cad)-1]
    sumador = 0;
    for visita in nueva_cad:
        sumador += int(visita)
    return sumador * 52

@register.filter(name='porcentajeVisitas')
def porcentajeVisitas(value, arg):
    return "{0:.2f}".format((int(getVisitasRecomendadas(value)) * 100) / int(arg))

@register.filter(name='porcentajeVisitas')
def porcentajeVisitas(value, arg):
    return "{0:.2f}".format((int(getVisitasRecomendadas(value)) * 100) / int(arg))

@register.filter(name='mayus')
def mayus(value):
    return value.upper()

@register.filter(name='isDoc')
def isDoc(value):
    return value == "Docente"

@register.filter(name='isTec')
def isTec(value):
    return value == "Tecnico"

@register.filter(name='getyear')
def getyear(value):
    now = datetime.datetime.now()
    return  now.year