from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, get_object_or_404, render_to_response
import json
import time
from .forms import *
from .models import *


def Index(request):
    form = formregistro()
    return render(request, 'tt/index.html', {'form': form})


def Registrar(request):
    if request.method == 'POST':
        form = formregistro(request.POST)

        if form.is_valid():
            print(tipousuario.objects.get(nombre='Docente'))
            emp = empleado.objects.create(idEmpleado=form.cleaned_data['idEmpleado'],
                                          nombre=form.cleaned_data['nombre'],
                                          ap=form.cleaned_data['ap'],
                                          am=form.cleaned_data['am'],
                                          email=form.cleaned_data['email'],
                                          password=form.cleaned_data['contra'],
                                          tipo=tipousuario.objects.get(nombre='Docente'))
            emp.save()
        return JsonResponse({"code": 1}, content_type="application/json", safe=False)
    return JsonResponse({"code": 0}, content_type="application/json", safe=False)

# def CerrarSesion(request):
#    try:
#        del request.session['NombreUser']
#        form = formlogin()
#        return render(request, 'gepp/login.html', {'form': form})
#    except KeyError:
#        print("No se pudo cerrar sesión")
