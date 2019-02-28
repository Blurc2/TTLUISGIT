from django.core import serializers
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, get_object_or_404, render_to_response
from django.views.decorators.csrf import csrf_exempt
import json
import time
from .forms import *
from .models import *


def Index(request):
    forml = formlogin()
    form = formregistro()
    if 'NombreUser' in request.session:  # Validamos si es que existe una sesión activa en el navegador
        return render(request, 'tt/index.html', {'form': form, 'forml': forml,'userName':request.session['NombreUser']['tipo']+" : "+request.session['NombreUser']['nombre']+" "+request.session['NombreUser']['ap']+" "+request.session['NombreUser']['am'],'usertype':request.session['NombreUser']['tipo']})
    else:
        return render(request, 'tt/index.html', {'form': form,'forml':forml})


def Registrar(request):
    if request.method == 'POST':
        form = formregistro(request.POST)

        if form.is_valid():
            # print(tipousuario.objects.get(nombre='Docente'))
            try:
                emp = Empleado.objects.create(idEmpleado=form.cleaned_data['idEmpleado'],
                                              nombre=form.cleaned_data['nombre'],
                                              ap=form.cleaned_data['ap'],
                                              am=form.cleaned_data['am'],
                                              email=form.cleaned_data['email'],
                                              password=form.cleaned_data['contra'],
                                              tipo=TipoUsuario.objects.get(nombre='Docente'))
                emp.save()
                return JsonResponse({"code": 1}, content_type="application/json", safe=False)
            except Exception as e:
                print(e)
                return JsonResponse({"code": 2}, content_type="application/json", safe=False)

    return JsonResponse({"code": 0}, content_type="application/json", safe=False)


def IniciarSesion(request):
    if request.method == 'POST':  # Validamos el metodo de envio
        form = formlogin(request.POST)  # Obtenemos los datos del formulario proporcionados por el usuario
        if form.is_valid():  # Validamos que los datos esten en un formato correcto
            email = form.cleaned_data['correo']  # Almacenamos usuario y contraseña en variables
            passs = form.cleaned_data['passs']
            if Empleado.objects.filter(email=email,password=passs).exists():
                us = Empleado.objects.get(email=email,password=passs)
                request.session['NombreUser'] = {'email': us.email, 'pass': us.password,
                                                 'nombre': us.nombre,'ap': us.ap,'am': us.am
                                                 ,'tipo': us.tipo.nombre}  # Creamos una sesión asociada al usuario
                return JsonResponse({'logincode':0,'userName':us.tipo.nombre+" : "+us.nombre+" "+us.ap+" "+us.am,'usertype':us.tipo.nombre}, content_type="application/json", safe=False)
            else:
                return JsonResponse({'logincode':1}, content_type="application/json", safe=False)
        else:  # En caso de que el formulario no sea valido, se procedera a recargar la página para volver a introducir credenciales
            return JsonResponse({'logincode':1}, content_type="application/json", safe=False)
    else:  # Analogamente al else de arriba, por si el metodo de envio no es post
        return JsonResponse({'logincode':1}, content_type="application/json", safe=False)

@csrf_exempt
def CerrarSesion(request):
    try:
        del request.session['NombreUser']
        return JsonResponse({'logincode':2}, content_type="application/json", safe=False)
    except Exception as e:
        print(e)
        return JsonResponse({'logincode': 3}, content_type="application/json", safe=False)
        print("No se pudo cerrar sesión")

@csrf_exempt
def ShowTecnicos(request):
    return JsonResponse(serializers.serialize('json', Empleado.objects.filter(tipo=TipoUsuario.objects.get(nombre='Tecnico'))), content_type="application/json", safe=False)