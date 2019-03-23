import datetime

from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, get_object_or_404, render_to_response
from django.views.decorators.csrf import csrf_exempt
import json
import time
from django.core.mail import send_mail
from .forms import *
from .models import *


@csrf_exempt
def Index(request):
    forml = formlogin()
    form2 = formDepartamento()
    deplist = []
    emplist = []
    typeequipolist = []
    typeworklist = []


    emplist.append(("Selecciona a que empleado pertenece", "Selecciona a que empleado pertenece asdasf"))
    for dep in Departamento.objects.all().values('nombre'):
        deplist.append((dep['nombre'], dep['nombre']))
    for typework in TipoTrabajo.objects.all().values('nombre'):
        typeworklist.append((typework['nombre'], typework['nombre']))
    for emp in Empleado.objects.all().values('nombre', 'pk'):
        emplist.append(("Id Empleado: " + str(emp['pk']) + ", Nombre: " + emp['nombre'],
                        "Id Empleado: " + str(emp['pk']) + ", Nombre: " + emp['nombre']))
    for typeequipo in TipoEquipo.objects.all().values('nombre'):
        typeequipolist.append((typeequipo['nombre'],
                               typeequipo['nombre']))
    formequipo = formEquipo(deplist, emplist, typeequipolist)
    form = formregistro(deplist, (), typeworklist)

    formorden = formOrden(typeworklist)
    # formequipo.fields['departamento'].choices = deplist
    # formequipo.fields['empleados'].choices = emplist
    if 'NombreUser' in request.session:  # Validamos si es que existe una sesión activa en el navegador
        return render(request, 'tt/index.html',
                      {'form': form, 'forml': forml, 'formdep': form2, 'formequipo': formequipo, 'formorden': formorden,
                       'userName': request.session['NombreUser']['tipo'] + " : " +
                                   request.session['NombreUser']['nombre'] + " " +
                                   request.session['NombreUser']['ap'] + " " +
                                   request.session['NombreUser']['am'],
                       'usertype': request.session['NombreUser']['tipo']})
    else:
        return render(request, 'tt/index.html',
                      {'form': form, 'forml': forml, 'formdep': form2, 'formequipo': formequipo,
                       'formorden': formorden})


@csrf_exempt
def Registrar(request):
    if request.method == 'POST':
        deplist = []
        subdeplist = []
        typeworklist = []
        for dep in Departamento.objects.all().values('nombre'):
            deplist.append((dep['nombre'], dep['nombre']))
        for subdep in SubDepartamento.objects.all().values('nombre'):
            subdeplist.append((subdep['nombre'], subdep['nombre']))
        for typework in TipoTrabajo.objects.all().values('nombre'):
            typeworklist.append((typework['nombre'], typework['nombre']))
        subdeplist.append(("Ninguno", "Ninguno"))
        form = formregistro(deplist, subdeplist, typeworklist, request.POST)

        if form.is_valid():
            # print(tipousuario.objects.get(nombre='Docente'))
            print(form.cleaned_data['tipoEmpleado'])
            print(form.cleaned_data['idEmpleado'])
            try:

                if (form.cleaned_data['tipoEmpleado'] == "DOCENTE"):
                    if (Empleado.objects.filter(email=form.cleaned_data['email']).exists() or Empleado.objects.filter(
                            pk=form.cleaned_data['idEmpleado']).exists()):
                        return JsonResponse({"code": 2}, content_type="application/json", safe=False)
                    emp = Empleado.objects.create(idEmpleado=form.cleaned_data['idEmpleado'],
                                                  nombre=form.cleaned_data['nombre'],
                                                  ap=form.cleaned_data['ap'],
                                                  am=form.cleaned_data['am'],
                                                  email=form.cleaned_data['email'],
                                                  password=form.cleaned_data['contra'],
                                                  numero=form.cleaned_data['telefono'],
                                                  ext=form.cleaned_data['extension'],
                                                  estado=False,
                                                  departamento=Departamento.objects.get(
                                                      nombre=form.cleaned_data['depto']),
                                                  subdepartamento=None if (form.cleaned_data[
                                                                               'subdepto'] == "Ninguno") else SubDepartamento.objects.get(
                                                      nombre=form.cleaned_data['subdepto']),
                                                  tipo=TipoUsuario.objects.get(nombre='Docente'))
                    emp.save()
                elif (form.cleaned_data['tipoEmpleado'] == "TECNICO"):
                    if (Empleado.objects.filter(email=form.cleaned_data['email']).exists() or Empleado.objects.filter(
                            pk=form.cleaned_data['idEmpleado']).exists()):
                        return JsonResponse({"code": 2}, content_type="application/json", safe=False)
                    print(form.cleaned_data['tipotecnico'])
                    emp = Empleado.objects.create(idEmpleado=form.cleaned_data['idEmpleado'],
                                                  nombre=form.cleaned_data['nombre'],
                                                  ap=form.cleaned_data['ap'],
                                                  am=form.cleaned_data['am'],
                                                  email=form.cleaned_data['email'],
                                                  password=form.cleaned_data['contra'],
                                                  numero=form.cleaned_data['telefono'],
                                                  ext=form.cleaned_data['extension'],
                                                  tipo=TipoUsuario.objects.get(nombre='Tecnico'),
                                                  estado=True,
                                                  departamento=None,
                                                  subdepartamento=None,
                                                  trabajos=TipoTrabajo.objects.get(
                                                      nombre=form.cleaned_data['tipotecnico'])
                                                  )
                    emp.save()
                elif (form.cleaned_data['tipoEmpleado'] == "TECNICOUPDATE"):
                    emp = Empleado.objects.filter(idEmpleado=form.cleaned_data['idEmpleado']).update(
                        nombre=form.cleaned_data['nombre'],
                        ap=form.cleaned_data['ap'],
                        am=form.cleaned_data['am'],
                        email=form.cleaned_data['email'],
                        password=form.cleaned_data['contra'],
                        numero=form.cleaned_data['telefono'],
                        ext=form.cleaned_data['extension'],
                        departamento=None,
                        subdepartamento=None,
                        trabajos=TipoTrabajo.objects.get(nombre=form.cleaned_data['tipotecnico'])
                    )

                return JsonResponse({"code": 1}, content_type="application/json", safe=False)
            except Exception as e:
                print(e)
                return JsonResponse({"code": 0}, content_type="application/json", safe=False)

    return JsonResponse({"code": 0}, content_type="application/json", safe=False)


@csrf_exempt
def ValidarDocente(request):
    # print(request.GET.get('action', None))
    # print(request.GET.get('correo', None))
    try:
        if (request.GET.get('action', None) == "OK"):

            send_mail(
                'UDI, Estado de solicitud de registro',
                'Saludos.\nLa verificación de registro fue exitosa, ya puedes iniciar sesión.\nURL: 127.0.0.1:8000/index.',
                'from@example.com',
                [request.GET.get('correo', None)],
                fail_silently=False,
            )
            Empleado.objects.filter(idEmpleado=request.GET.get('idEmp', None)).update(estado=True)
        elif (request.GET.get('action', None) == "ERROR"):

            send_mail(
                'UDI, Estado de solicitud de registro',
                'Saludos.\nLamentablemente la verificación de registro fue denegada, llame al teléfono de atención correspondiente a la Unidad de Informática ESCOM.\nURL: 127.0.0.1:8000/index.',
                'from@example.com',
                [request.GET.get('correo', None)],
                fail_silently=False,
            )
            Empleado.objects.filter(idEmpleado=request.GET.get('idEmp', None)).delete()
        return JsonResponse({"code": 0}, content_type="application/json", safe=False)
    except Exception as e:
        return JsonResponse({"code": -1}, content_type="application/json", safe=False)


@csrf_exempt
def AddDepartment(request):
    if request.method == 'POST':
        form = formDepartamento(request.POST)

        if form.is_valid():
            # print(tipousuario.objects.get(nombre='Docente'))
            print(form.cleaned_data['option'])
            print(form.cleaned_data['pkdep'])
            try:

                if (form.cleaned_data['option'] == "create"):
                    if (Departamento.objects.filter(nombre=form.cleaned_data['nombredep']).exists()):
                        return JsonResponse({"code": 2}, content_type="application/json", safe=False)
                    if (Ubicacion.objects.filter(edificio=form.cleaned_data['edificio'], piso=form.cleaned_data['piso'],
                                                 sala=form.cleaned_data['sala']).exists()):
                        dep = Departamento.objects.create(nombre=form.cleaned_data['nombredep'],
                                                          ubicacion=Ubicacion.objects.get(
                                                              edificio=form.cleaned_data['edificio'],
                                                              piso=form.cleaned_data['piso'],
                                                              sala=form.cleaned_data['sala']))
                    else:
                        ubi = Ubicacion.objects.create(
                            edificio=form.cleaned_data['edificio'],
                            piso=form.cleaned_data['piso'],
                            sala=form.cleaned_data['sala'])
                        ubi.save()

                        dep = Departamento.objects.create(nombre=form.cleaned_data['nombredep'],
                                                          ubicacion=ubi)
                    dep.save()
                elif (form.cleaned_data['option'] == "update"):
                    if (Ubicacion.objects.filter(edificio=form.cleaned_data['edificio'], piso=form.cleaned_data['piso'],
                                                 sala=form.cleaned_data['sala']).exists()):
                        dep = Departamento.objects.filter(pk=form.cleaned_data['pkdep']).update(
                            nombre=form.cleaned_data['nombredep'],
                            ubicacion=Ubicacion.objects.get(
                                edificio=form.cleaned_data['edificio'],
                                piso=form.cleaned_data['piso'],
                                sala=form.cleaned_data['sala'])
                        )
                    else:
                        ubi = Ubicacion.objects.create(
                            edificio=form.cleaned_data['edificio'],
                            piso=form.cleaned_data['piso'],
                            sala=form.cleaned_data['sala'])
                        ubi.save()

                        dep = Departamento.objects.filter(pk=form.cleaned_data['pkdep']).update(
                            nombre=form.cleaned_data['nombredep'],
                            ubicacion=ubi)

                elif (form.cleaned_data['option'] == "createsub"):
                    if (SubDepartamento.objects.filter(nombre=form.cleaned_data['nombredep']).exists()):
                        return JsonResponse({"code": 2}, content_type="application/json", safe=False)
                    print(form.cleaned_data['depname'])
                    if (
                            Ubicacion.objects.filter(edificio=form.cleaned_data['edificio'],
                                                     piso=form.cleaned_data['piso'],
                                                     sala=form.cleaned_data['sala']).exists()):
                        dep = SubDepartamento.objects.create(nombre=form.cleaned_data['nombredep'],
                                                             depto=Departamento.objects.get(
                                                                 nombre=form.cleaned_data['depname']),
                                                             ubicacion=Ubicacion.objects.get(
                                                                 edificio=form.cleaned_data['edificio'],
                                                                 piso=form.cleaned_data['piso'],
                                                                 sala=form.cleaned_data['sala']))
                    else:
                        ubi = Ubicacion.objects.create(
                            edificio=form.cleaned_data['edificio'],
                            piso=form.cleaned_data['piso'],
                            sala=form.cleaned_data['sala'])
                        ubi.save()

                        dep = SubDepartamento.objects.create(nombre=form.cleaned_data['nombredep'],
                                                             ubicacion=ubi)
                    dep.save()
                elif (form.cleaned_data['option'] == "updatesub"):
                    if (
                            Ubicacion.objects.filter(edificio=form.cleaned_data['edificio'],
                                                     piso=form.cleaned_data['piso'],
                                                     sala=form.cleaned_data['sala']).exists()):
                        dep = SubDepartamento.objects.filter(pk=form.cleaned_data['pkdep']).update(
                            nombre=form.cleaned_data['nombredep'],
                            ubicacion=Ubicacion.objects.get(
                                edificio=form.cleaned_data['edificio'],
                                piso=form.cleaned_data['piso'],
                                sala=form.cleaned_data['sala'])
                        )
                    else:
                        ubi = Ubicacion.objects.create(
                            edificio=form.cleaned_data['edificio'],
                            piso=form.cleaned_data['piso'],
                            sala=form.cleaned_data['sala'])
                        ubi.save()

                        dep = SubDepartamento.objects.filter(pk=form.cleaned_data['pkdep']).update(
                            nombre=form.cleaned_data['nombredep'],
                            ubicacion=ubi)

                return JsonResponse({"code": 1}, content_type="application/json", safe=False)
            except Exception as e:
                print(e)
                return JsonResponse({"code": 0}, content_type="application/json", safe=False)

    return JsonResponse({"code": 0}, content_type="application/json", safe=False)


@csrf_exempt
def AddEquip(request):
    if request.method == 'POST':
        deplist = []
        emplist = []
        typeequipolist = []
        deplist.append(("Selecciona a que departamento pertenece", "Selecciona a que departamento pertenece"))
        emplist.append(("Selecciona a que empleado pertenece", "Selecciona a que empleado pertenece"))
        for dep in Departamento.objects.all().values('nombre'):
            print(dep)
            deplist.append((dep['nombre'], dep['nombre']))
        for emp in Empleado.objects.all().values('nombre', 'pk'):
            emplist.append(("Id Empleado: " + str(emp['pk']) + ", Nombre: " + emp['nombre'],
                            "Id Empleado: " + str(emp['pk']) + ", Nombre: " + emp['nombre']))
        for typeequipo in TipoEquipo.objects.all().values('nombre'):
            typeequipolist.append((typeequipo['nombre'],
                                   typeequipo['nombre']))
        form = formEquipo(deplist, emplist, typeequipolist, request.POST)

        if form.is_valid():
            # print(tipousuario.objects.get(nombre='Docente'))
            print(form.cleaned_data['option'])
            print(form.cleaned_data['fmarca'])
            try:

                if form.cleaned_data['option'] == "create":
                    if Equipo.objects.filter(ns=form.cleaned_data['fns']).exists():
                        return JsonResponse({"code": 2}, content_type="application/json", safe=False)
                    else:
                        if Marca.objects.filter(nombre=form.cleaned_data['fmarca']).exists():

                            equipo = Equipo.objects.create(idEquipo=form.cleaned_data['idequipo'],
                                                           modelo=form.cleaned_data['fmodelo'],
                                                           mac=form.cleaned_data['fmac'],
                                                           ns=form.cleaned_data['fns'],
                                                           ip=form.cleaned_data['fip'],
                                                           cambs=form.cleaned_data['fcambs'],
                                                           sistema_operativo=form.cleaned_data['fsistema_operativo'],
                                                           procesador=form.cleaned_data['fprocesador'],
                                                           num_puertos=form.cleaned_data['fnum_puertos'],
                                                           memoria_ram=form.cleaned_data['fmemoria_ram'],
                                                           disco_duro=form.cleaned_data['fdisco_duro'],
                                                           idf=form.cleaned_data['fidf'],
                                                           caracteristicas=form.cleaned_data['fcaracteristicas'],
                                                           observaciones=form.cleaned_data['fobservaciones'],
                                                           marca=Marca.objects.get(nombre=form.cleaned_data['fmarca']),
                                                           depto=Departamento.objects.get(
                                                               nombre=form.cleaned_data['departamento']),
                                                           empleado=Empleado.objects.get(
                                                               pk=form.cleaned_data['empleados'][13:14]),
                                                           tipo_equipo=TipoEquipo.objects.get(
                                                               nombre=form.cleaned_data['tipoequipo'])
                                                           )
                            equipo.save()
                        else:
                            marca = Marca.objects.create(
                                nombre=form.cleaned_data['fmarca'])
                            marca.save()
                            equipo = Equipo.objects.create(modelo=form.cleaned_data['fmodelo'],
                                                           mac=form.cleaned_data['fmac'],
                                                           ns=form.cleaned_data['fns'],
                                                           ip=form.cleaned_data['fip'],
                                                           cambs=form.cleaned_data['fcambs'],
                                                           sistema_operativo=form.cleaned_data['fsistema_operativo'],
                                                           procesador=form.cleaned_data['fprocesador'],
                                                           num_puertos=form.cleaned_data['fnum_puertos'],
                                                           memoria_ram=form.cleaned_data['fmemoria_ram'],
                                                           disco_duro=form.cleaned_data['fdisco_duro'],
                                                           idf=form.cleaned_data['fidf'],
                                                           caracteristicas=form.cleaned_data['fcaracteristicas'],
                                                           observaciones=form.cleaned_data['fobservaciones'],
                                                           marca=marca,
                                                           depto=Departamento.objects.get(
                                                               nombre=form.cleaned_data['departamento']),
                                                           empleado=Empleado.objects.get(
                                                               pk=form.cleaned_data['empleados'][13:14]),
                                                           tipo_equipo=TipoEquipo.objects.get(
                                                               nombre=form.cleaned_data['tipoequipo']))
                            equipo.save()
                elif form.cleaned_data['option'] == "update":
                    if Marca.objects.filter(nombre=form.cleaned_data['fmarca']).exists():

                        equipo = Equipo.objects.filter(pk=form.cleaned_data['idequipo']).update(
                            modelo=form.cleaned_data['fmodelo'],
                            mac=form.cleaned_data['fmac'],
                            ns=form.cleaned_data['fns'],
                            ip=form.cleaned_data['fip'],
                            cambs=form.cleaned_data['fcambs'],
                            sistema_operativo=form.cleaned_data['fsistema_operativo'],
                            procesador=form.cleaned_data['fprocesador'],
                            num_puertos=form.cleaned_data['fnum_puertos'],
                            memoria_ram=form.cleaned_data['fmemoria_ram'],
                            disco_duro=form.cleaned_data['fdisco_duro'],
                            idf=form.cleaned_data['fidf'],
                            caracteristicas=form.cleaned_data['fcaracteristicas'],
                            observaciones=form.cleaned_data['fobservaciones'],
                            marca=Marca.objects.get(nombre=form.cleaned_data['fmarca']),
                            depto=Departamento.objects.get(
                                nombre=form.cleaned_data['departamento']),
                            empleado=Empleado.objects.get(
                                pk=form.cleaned_data['empleados'][13:14]),
                            tipo_equipo=TipoEquipo.objects.get(
                                nombre=form.cleaned_data['tipoequipo'])
                        )
                    else:
                        marca = Marca.objects.create(
                            nombre=form.cleaned_data['fmarca'])
                        marca.save()
                        equipo = Equipo.objects.filter(pk=form.cleaned_data['idequipo']).update(
                            modelo=form.cleaned_data['fmodelo'],
                            mac=form.cleaned_data['fmac'],
                            ns=form.cleaned_data['fns'],
                            ip=form.cleaned_data['fip'],
                            cambs=form.cleaned_data['fcambs'],
                            sistema_operativo=form.cleaned_data['fsistema_operativo'],
                            procesador=form.cleaned_data['fprocesador'],
                            num_puertos=form.cleaned_data['fnum_puertos'],
                            memoria_ram=form.cleaned_data['fmemoria_ram'],
                            disco_duro=form.cleaned_data['fdisco_duro'],
                            idf=form.cleaned_data['fidf'],
                            caracteristicas=form.cleaned_data['fcaracteristicas'],
                            observaciones=form.cleaned_data['fobservaciones'],
                            marca=marca,
                            depto=Departamento.objects.get(
                                nombre=form.cleaned_data['departamento']),
                            empleado=Empleado.objects.get(
                                pk=form.cleaned_data['empleados'][13:14]),
                            tipo_equipo=TipoEquipo.objects.get(
                                nombre=form.cleaned_data['tipoequipo'])
                        )

                return JsonResponse({"code": 1}, content_type="application/json", safe=False)
            except Exception as e:
                print(e)
                return JsonResponse({"code": 0}, content_type="application/json", safe=False)

    return JsonResponse({"code": 0}, content_type="application/json", safe=False)


@csrf_exempt
def IniciarSesion(request):
    if request.method == 'POST':  # Validamos el metodo de envio
        form = formlogin(request.POST)  # Obtenemos los datos del formulario proporcionados por el usuario
        if form.is_valid():  # Validamos que los datos esten en un formato correcto
            email = form.cleaned_data['correo']  # Almacenamos usuario y contraseña en variables
            passs = form.cleaned_data['passs']
            print(email)
            print(passs)
            if Empleado.objects.filter(email=email, password=passs).exists():
                us = Empleado.objects.get(email=email, password=passs)
                if (us.estado == False):
                    return JsonResponse({'logincode': -1}, content_type="application/json", safe=False)
                request.session['NombreUser'] = {'email': us.email, 'pass': us.password,
                                                 'nombre': us.nombre, 'ap': us.ap, 'am': us.am
                    , 'tipo': us.tipo.nombre,
                                                 'pk': us.idEmpleado}  # Creamos una sesión asociada al usuario
                return JsonResponse(
                    {'logincode': 0, 'userName': us.tipo.nombre + " : " + us.nombre + " " + us.ap + " " + us.am,
                     'usertype': us.tipo.nombre}, content_type="application/json", safe=False)
            else:
                return JsonResponse({'logincode': 1}, content_type="application/json", safe=False)
        else:  # En caso de que el formulario no sea valido, se procedera a recargar la página para volver a introducir credenciales
            return JsonResponse({'logincode': 1}, content_type="application/json", safe=False)
    else:  # Analogamente al else de arriba, por si el metodo de envio no es post
        return JsonResponse({'logincode': 1}, content_type="application/json", safe=False)


@csrf_exempt
def CerrarSesion(request):
    try:
        del request.session['NombreUser']
        return JsonResponse({'logincode': 2}, content_type="application/json", safe=False)
    except Exception as e:
        print(e)
        return JsonResponse({'logincode': 3}, content_type="application/json", safe=False)
        print("No se pudo cerrar sesión")


@csrf_exempt
def ShowTecnicos(request):
    return JsonResponse(
        serializers.serialize('json', Empleado.objects.filter(tipo=TipoUsuario.objects.get(nombre='Tecnico'))),
        content_type="application/json", safe=False)


@csrf_exempt
def ShowRegisters(request):
    return JsonResponse(
        serializers.serialize('json',
                              Empleado.objects.filter(tipo=TipoUsuario.objects.get(nombre='Docente'), estado=False)),
        content_type="application/json", safe=False)


@csrf_exempt
def ShowDepartments(request):
    query = Departamento.objects.all().values('nombre', 'pk', 'ubicacion__edificio', 'ubicacion__piso',
                                              'ubicacion__sala')
    return HttpResponse(json.dumps(list(query), cls=DjangoJSONEncoder), content_type="application/json")
    # return JsonResponse(serializers.serialize('json', Departamento.objects.all().values('nombre')), content_type="application/json",
    #                     safe=False)


@csrf_exempt
def ShowSubDepartments(request):
    print(request.GET.get('nombreDep', None))
    query = SubDepartamento.objects.filter(
        depto=Departamento.objects.get(nombre=request.GET.get('nombreDep', None))).values('nombre', 'pk',
                                                                                          'ubicacion__edificio',
                                                                                          'ubicacion__piso',
                                                                                          'ubicacion__sala')
    return HttpResponse(json.dumps(list(query), cls=DjangoJSONEncoder), content_type="application/json")
    # return JsonResponse(
    #     serializers.serialize('json', SubDepartamento.objects.filter(
    #         depto=Departamento.objects.get(nombre=request.GET.get('nombreDep', None)))),
    #     content_type="application/json", safe=False)


@csrf_exempt
def ShowEquipment(request):
    print(request.GET.get('nombreDep', None))
    query = Equipo.objects.all().values('modelo', 'pk',
                                        'mac',
                                        'ns',
                                        'ip',
                                        'cambs',
                                        'sistema_operativo',
                                        'procesador',
                                        'num_puertos',
                                        'memoria_ram',
                                        'disco_duro',
                                        'idf',
                                        'caracteristicas',
                                        'observaciones',
                                        'tipo_equipo__nombre',
                                        'depto__nombre',
                                        'empleado__pk',
                                        'empleado__nombre',
                                        'marca__nombre')
    return HttpResponse(json.dumps(list(query), cls=DjangoJSONEncoder), content_type="application/json")

    # return JsonResponse(
    #     serializers.serialize('json', Equipo.objects.all().values('nombre', 'pk',
    #                                                               'ubicacion__edificio',
    #                                                               'ubicacion__piso',
    #                                                               'ubicacion__sala')),
    #     content_type="application/json", safe=False)


@csrf_exempt
def DelTecnicos(request):
    try:
        print(request.GET.get('idEmp', None))
        Empleado.objects.get(idEmpleado=request.GET.get('idEmp', None)).delete()
        return JsonResponse({"code": 1}, content_type="application/json", safe=False)
    except Exception as e:
        print(e)
        return JsonResponse({"code": 2}, content_type="application/json", safe=False)


@csrf_exempt
def DelEquipment(request):
    try:
        print(request.GET.get('idEmp', None))
        Equipo.objects.get(pk=request.GET.get('idEquipo', None)).delete()
        return JsonResponse({"code": 1}, content_type="application/json", safe=False)
    except Exception as e:
        print(e)
        return JsonResponse({"code": 2}, content_type="application/json", safe=False)


@csrf_exempt
def DelDepartment(request):
    try:
        print(request.GET.get('nombre', None))

        Departamento.objects.get(nombre=request.GET.get('nombre', None)).delete()
        return JsonResponse({"code": 1}, content_type="application/json", safe=False)
    except Exception as e:
        print(e)
        return JsonResponse({"code": 2}, content_type="application/json", safe=False)


@csrf_exempt
def DelSubDepartment(request):
    try:
        print(request.GET.get('nombre', None))
        SubDepartamento.objects.get(nombre=request.GET.get('nombre', None)).delete()
        return JsonResponse({"code": 1}, content_type="application/json", safe=False)
    except Exception as e:
        print(e)
        return JsonResponse({"code": 2}, content_type="application/json", safe=False)


@csrf_exempt
def getSubDepartments(request):
    print(request.GET.get('depto', None))
    return JsonResponse(
        serializers.serialize('json',
                              SubDepartamento.objects.filter(depto__nombre=request.GET.get('depto', None))),
        content_type="application/json", safe=False)


@csrf_exempt
def getUserInfo(request):
    # print(request.GET.get('depto', None))
    folio = -1
    if(Orden.objects.all().count() == 0):
        folio = 1
    else:
        folio = Orden.objects.all().count()+1
    query = Empleado.objects.filter(pk=request.session['NombreUser']['pk']).values('pk',
                                                                                'nombre',
                                                                                'ap',
                                                                                'am',
                                                                                'departamento__nombre',
                                                                                'subdepartamento__nombre')
    return HttpResponse(json.dumps({'data': list(query), 'folio': folio,'fecha':datetime.datetime.now().date()}, cls=DjangoJSONEncoder), content_type="application/json")
