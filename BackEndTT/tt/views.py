import ast
import codecs
import datetime
import os

from django.contrib.auth import authenticate, login, logout
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
from django.db.models import Q, Avg
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, get_object_or_404, render_to_response
from django.template.loader import render_to_string
from django.views.decorators.csrf import csrf_exempt
import json
import time
from django.core.mail import send_mail

from .forms import *
from .models import *
from .firebase import Firebase
from weasyprint import HTML, CSS
from weasyprint.fonts import FontConfiguration

firebase = Firebase()


@csrf_exempt
def Index(request):
    forml = formlogin()
    form2 = formDepartamento()
    formrecpass = formRecPass()
    formsurvey = formSurvey()
    formsoft = formSoft()
    deplist = []
    emplist = []
    typeequipolist = []
    typeworklist = []

    #
    # authentication = firebase.instance.getReference()._authenticate('rinnegan', 'luis@gmail.com')
    # firebase.instance.getReference().authentication = authentication
    # print(authentication.extra)

    # result = firebase.instance.getReference().get('/users', None)
    # print(result)

    for dep in Departamento.objects.all().values('nombre'):
        deplist.append((dep['nombre'], dep['nombre']))
    for typework in TipoTrabajo.objects.all().values('nombre'):
        typeworklist.append((typework['nombre'], typework['nombre']))
    for emp in Empleado.objects.filter(tipo = 3).values('nombre', 'pk'):
        emplist.append(("No. Empleado: " + str(emp['pk']) + ", Nombre: " + emp['nombre'],
                        "No. Empleado: " + str(emp['pk']) + ", Nombre: " + emp['nombre']))
    for typeequipo in TipoEquipo.objects.all().values('nombre'):
        typeequipolist.append((typeequipo['nombre'],
                               typeequipo['nombre']))
    emplist.append(("Equipo Libre", "Equipo Libre"))
    formequipo = formEquipo(deplist, emplist, typeequipolist)
    form = formregistro(deplist, (), typeworklist)

    formorden = formOrden(typeworklist, ())
    # formequipo.fields['departamento'].choices = deplist
    # formequipo.fields['empleados'].choices = emplist
    if 'NombreUser' in request.session:  # Validamos si es que existe una sesión activa en el navegador
        ordenes = {}
        if request.session['NombreUser']['tipo'] == "Docente":
            emp = Empleado.objects.filter(pk=request.session['NombreUser']['pk']).values('ordenes__pk')
            print(emp)
            ordenes = Orden.objects.filter(estado__gte=1, survey=None, pk__in=emp).values('pk')
        if request.session['NombreUser']['tipo'] == "Técnico":
            emp = Empleado.objects.filter(pk=request.session['NombreUser']['pk']).values('ordenes__pk')
            print(emp)
            ordenes = Orden.objects.filter(estado=0, pk__in=emp).values('pk')

        return render(request, 'tt/index.html',
                      {'form': form, 'forml': forml, 'formdep': form2, 'formequipo': formequipo, 'formorden': formorden,
                       'formsurvey': formsurvey,
                       'userName': request.session['NombreUser']['tipo'] + " : " +
                                   request.session['NombreUser']['nombre'] + " " +
                                   request.session['NombreUser']['ap'] + " " +
                                   request.session['NombreUser']['am'],
                       'usertype': request.session['NombreUser']['tipo'],
                       'ordenes': list(ordenes),
                       'formrecpass':formrecpass,
                       'formsoft':formsoft})
    else:
        return render(request, 'tt/index.html',
                      {'form': form, 'forml': forml, 'formdep': form2, 'formequipo': formequipo,
                       'formorden': formorden, 'formsurvey': formsurvey,'formrecpass':formrecpass,'formsoft':formsoft })


@csrf_exempt
def Registrar(request):
    if request.method == 'POST':
        deplist = []
        subdeplist = []
        typeworklist = []
        for dep in Departamento.objects.all().values('nombre'):
            deplist.append((dep['nombre'], dep['nombre']))
        for subdep in SubDepartamento.objects.all().values('nombre', 'ubicacion__edificio', 'ubicacion__piso',
                                                           'ubicacion__sala'):
            subdeplist.append((subdep['nombre'] + ", Edificio: " + str(subdep['ubicacion__edificio']) + " Piso: " + str(
                subdep['ubicacion__piso']) + " Sala: " + str(subdep['ubicacion__sala']),
                               subdep['nombre'] + ", Edificio: " + str(subdep['ubicacion__edificio']) + " Piso: " + str(
                                   subdep['ubicacion__piso']) + " Sala: " + str(subdep['ubicacion__sala'])))
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
                            idEmpleado=form.cleaned_data['idEmpleado']).exists()):
                        return JsonResponse({"code": 2}, content_type="application/json", safe=False)
                    emp = Empleado.objects.create(idEmpleado=form.cleaned_data['idEmpleado'],
                                                  nombre=form.cleaned_data['nombre'],
                                                  ap=form.cleaned_data['ap'],
                                                  am=form.cleaned_data['am'],
                                                  email=form.cleaned_data['email'],
                                                  uuid="",
                                                  password=form.cleaned_data['contra'],
                                                  numero=form.cleaned_data['telefono'],
                                                  ext=form.cleaned_data['extension'],
                                                  estado=False,
                                                  adminstate=False,
                                                  observaciones="",
                                                  departamento=Departamento.objects.get(
                                                      nombre=form.cleaned_data['depto']),
                                                  subdepartamento=None if (form.cleaned_data[
                                                                               'subdepto'] == "Ninguno") else SubDepartamento.objects.get(
                                                      nombre=form.cleaned_data['subdepto'].split(",")[0]),
                                                  tipo=TipoUsuario.objects.get(nombre='Docente'))
                    emp.save()
                elif (form.cleaned_data['tipoEmpleado'] == "ADMIN"):
                    if (Empleado.objects.filter(email=form.cleaned_data['email']).exists() or Empleado.objects.filter(
                            idEmpleado=form.cleaned_data['idEmpleado']).exists()):
                        return JsonResponse({"code": 2}, content_type="application/json", safe=False)
                    emp = Empleado.objects.create(idEmpleado=form.cleaned_data['idEmpleado'],
                                                  nombre=form.cleaned_data['nombre'],
                                                  ap=form.cleaned_data['ap'],
                                                  am=form.cleaned_data['am'],
                                                  email=form.cleaned_data['email'],
                                                  uuid="",
                                                  password=form.cleaned_data['contra'],
                                                  numero=form.cleaned_data['telefono'],
                                                  ext=form.cleaned_data['extension'],
                                                  estado=True,
                                                  adminstate=True,
                                                  observaciones="",
                                                  departamento=None,
                                                  subdepartamento=None,
                                                  tipo=TipoUsuario.objects.get(nombre='Administrador'))
                    emp.save()
                elif (form.cleaned_data['tipoEmpleado'] == "DOCENTEADMIN"):
                    if (Empleado.objects.filter(email=form.cleaned_data['email']).exists() or Empleado.objects.filter(
                            idEmpleado=form.cleaned_data['idEmpleado']).exists()):
                        return JsonResponse({"code": 2}, content_type="application/json", safe=False)

                    user = firebase.instance.createuser(form.cleaned_data['email'], form.cleaned_data['contra'])
                    print(user)
                    if (user is not None):
                        emp = Empleado.objects.create(idEmpleado=form.cleaned_data['idEmpleado'],
                                                      nombre=form.cleaned_data['nombre'],
                                                      ap=form.cleaned_data['ap'],
                                                      am=form.cleaned_data['am'],
                                                      email=form.cleaned_data['email'],
                                                      uuid=user['localId'],
                                                      password=form.cleaned_data['contra'],
                                                      numero=form.cleaned_data['telefono'],
                                                      ext=form.cleaned_data['extension'],
                                                      estado=True,
                                                      adminstate=True,
                                                      observaciones="",
                                                      departamento=Departamento.objects.get(
                                                          nombre=form.cleaned_data['depto']),
                                                      subdepartamento=None if (form.cleaned_data[
                                                                                   'subdepto'] == "Ninguno") else SubDepartamento.objects.get(
                                                          nombre=form.cleaned_data['subdepto'].split(",")[0]),
                                                      tipo=TipoUsuario.objects.get(nombre='Docente'))

                        emp2 = Empleado.objects.get(idEmpleado=form.cleaned_data['idEmpleado'])
                        print(emp2.as_dict())
                        firebase.instance.reference.database().child("users").child(user['localId']).set(
                            emp2.as_dict())
                        emp.save()
                elif (form.cleaned_data['tipoEmpleado'] == "TECNICO"):
                    if (Empleado.objects.filter(email=form.cleaned_data['email']).exists() or Empleado.objects.filter(
                            idEmpleado=form.cleaned_data['idEmpleado']).exists()):
                        return JsonResponse({"code": 2}, content_type="application/json", safe=False)
                    print(form.cleaned_data['tipotecnico'])

                    user = firebase.instance.createuser(form.cleaned_data['email'], form.cleaned_data['contra'])
                    print(user)
                    if (user is not None):
                        emp = Empleado.objects.create(idEmpleado=form.cleaned_data['idEmpleado'],
                                                      nombre=form.cleaned_data['nombre'],
                                                      ap=form.cleaned_data['ap'],
                                                      am=form.cleaned_data['am'],
                                                      email=form.cleaned_data['email'],
                                                      password=form.cleaned_data['contra'],
                                                      numero=form.cleaned_data['telefono'],
                                                      ext=form.cleaned_data['extension'],
                                                      uuid=user['localId'],
                                                      tipo=TipoUsuario.objects.get(nombre='Técnico'),
                                                      estado=True,
                                                      adminstate=True,
                                                      observaciones=form.cleaned_data['observaciones'],
                                                      departamento=None,
                                                      subdepartamento=None,
                                                      trabajos=TipoTrabajo.objects.get(
                                                          nombre=form.cleaned_data['tipotecnico'])
                                                      )
                        # empdata = serializers.serialize('json', emp)
                        # print(ast.literal_eval(empdata))
                        emp2 = Empleado.objects.get(idEmpleado=form.cleaned_data['idEmpleado'])
                        print(emp2.as_dict())
                        firebase.instance.reference.database().child("users").child(user['localId']).set(
                            emp2.as_dict())
                    # user = User.objects.create_user(form.cleaned_data['email'], form.cleaned_data['email'],
                    #                                 form.cleaned_data['contra'])
                    # user.save()
                    emp.save()
                elif (form.cleaned_data['tipoEmpleado'] == "TECNICOUPDATE"):

                    emp = Empleado.objects.filter(idEmpleado=form.cleaned_data['idEmpleado'])
                    uuid = emp[0].uuid

                    user = firebase.instance.authuser(emp[0].email, emp[0].password)

                    print(user)
                    if (user is not None):


                        firebase.instance.deleteuser(user['idToken'])
                        user2 = firebase.instance.createuser(form.cleaned_data['email'], form.cleaned_data['contra'])
                        if (user2 is not None):
                            emp.update(
                                nombre=form.cleaned_data['nombre'],
                                ap=form.cleaned_data['ap'],
                                am=form.cleaned_data['am'],
                                email=form.cleaned_data['email'],
                                password=form.cleaned_data['contra'],
                                uuid=user2['localId'],
                                numero=form.cleaned_data['telefono'],
                                ext=form.cleaned_data['extension'],
                                observaciones=form.cleaned_data['observaciones'],
                                departamento=None,
                                subdepartamento=None,
                                trabajos=TipoTrabajo.objects.get(nombre=form.cleaned_data['tipotecnico'])
                            )

                            ordenes = firebase.instance.reference.database().child("users").child(uuid).child("ordenes").get()
                            firebase.instance.reference.database().child("users").child(uuid).remove()
                            emp2 = Empleado.objects.get(idEmpleado=form.cleaned_data['idEmpleado'])
                            print(ordenes.val())
                            firebase.instance.reference.database().child("users").child(user2['localId']).set(emp2.as_dict())
                            if ordenes.val() is not None:
                                firebase.instance.reference.database().child("users").child(user2['localId']).child("ordenes").set(ordenes.val())




                    # emp.save()

                return JsonResponse({"code": 1}, content_type="application/json", safe=False)
            except Exception as e:
                print(e)
                return JsonResponse({"code": 0}, content_type="application/json", safe=False)
        else:
            print(form.errors)

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

            emp = Empleado.objects.filter(idEmpleado=request.GET.get('idEmp', None))
            emp2 = Empleado.objects.get(idEmpleado=request.GET.get('idEmp', None))
            user = firebase.instance.createuser(emp[0].email, emp[0].password)

            print(user)
            if (user is not None):
                # empdata = serializers.serialize('json', emp)
                # print(ast.literal_eval(empdata))
                print(emp2.as_dict())
                emp.update(estado=True,adminstate=True, uuid=user['localId'])
                firebase.instance.reference.database().child("users").child(emp[0].uuid).set(emp2.as_dict())

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
        print(e)
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

        for dep in Departamento.objects.all().values('nombre'):
            print(dep)
            deplist.append((dep['nombre'], dep['nombre']))
        for emp in Empleado.objects.filter(tipo = 3).values('nombre', 'pk'):
            emplist.append(("No. Empleado: " + str(emp['pk']) + ", Nombre: " + emp['nombre'],
                            "No. Empleado: " + str(emp['pk']) + ", Nombre: " + emp['nombre']))
        for typeequipo in TipoEquipo.objects.all().values('nombre'):
            typeequipolist.append((typeequipo['nombre'],
                                   typeequipo['nombre']))
        emplist.append(("Equipo Libre", "Equipo Libre"))
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
                            print("Marca exists")
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
                                                           lastupdate=None,
                                                           idf=form.cleaned_data['fidf'],
                                                           caracteristicas=form.cleaned_data['fcaracteristicas'],
                                                           observaciones=form.cleaned_data['fobservaciones'],
                                                           marca=Marca.objects.get(nombre=form.cleaned_data['fmarca']),
                                                           depto=Departamento.objects.get(
                                                               nombre=form.cleaned_data['departamento']),
                                                           empleado=Empleado.objects.get(
                                                               pk=form.cleaned_data['empleados'].split(":", 1)[
                                                                   1].strip().split(",", 1)[0]) if form.cleaned_data[
                                                                                                       'empleados'] != "Equipo Libre" else None,
                                                           tipo_equipo=TipoEquipo.objects.get(
                                                               nombre=form.cleaned_data['tipoequipo'])
                                                           )
                            equipo.save()
                        else:
                            print("Marca no exists")
                            marca = Marca.objects.create(
                                nombre=form.cleaned_data['fmarca'])
                            marca.save()
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
                                                           marca=marca,
                                                           lastupdate=None,
                                                           depto=Departamento.objects.get(
                                                               nombre=form.cleaned_data['departamento']),
                                                           empleado=Empleado.objects.get(
                                                               pk=form.cleaned_data['empleados'].split(":", 1)[
                                                                   1].strip().split(",", 1)[0]) if form.cleaned_data[
                                                                                                       'empleados'] != "Equipo Libre" else None,
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
                            lastupdate=request.session['NombreUser']['tipo']+" - "+request.session['NombreUser']['nombre']+" "+request.session['NombreUser']['ap']+" "+request.session['NombreUser']['am'],
                            caracteristicas=form.cleaned_data['fcaracteristicas'],
                            observaciones=form.cleaned_data['fobservaciones'],
                            marca=Marca.objects.get(nombre=form.cleaned_data['fmarca']),
                            depto=Departamento.objects.get(
                                nombre=form.cleaned_data['departamento']),
                            empleado=Empleado.objects.get(
                                pk=form.cleaned_data['empleados'].split(":", 1)[1].strip().split(",", 1)[0]) if
                            form.cleaned_data['empleados'] != "Equipo Libre" else None,
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
                            lastupdate=request.session['NombreUser']['tipo'] + " - " + request.session['NombreUser'][
                                'nombre'] + " " + request.session['NombreUser']['ap'] + " " +
                                       request.session['NombreUser']['am'],
                            caracteristicas=form.cleaned_data['fcaracteristicas'],
                            observaciones=form.cleaned_data['fobservaciones'],
                            marca=marca,
                            depto=Departamento.objects.get(
                                nombre=form.cleaned_data['departamento']),
                            empleado=Empleado.objects.get(
                                pk=form.cleaned_data['empleados'].split(":", 1)[1].strip().split(",", 1)[0]) if
                            form.cleaned_data['empleados'] != "Equipo Libre" else None,
                            tipo_equipo=TipoEquipo.objects.get(
                                nombre=form.cleaned_data['tipoequipo'])
                        )

                return JsonResponse({"code": 1}, content_type="application/json", safe=False)
            except Exception as e:
                print(e)
                return JsonResponse({"code": 0}, content_type="application/json", safe=False)

    return JsonResponse({"code": 0}, content_type="application/json", safe=False)


@csrf_exempt
def AddOrder(request):
    if request.method == 'POST':
        typeworklist = []
        equiplist = []

        for typework in TipoTrabajo.objects.all().values('nombre'):
            typeworklist.append((typework['nombre'], typework['nombre']))

        equipo = Equipo.objects.filter(empleado=request.session['NombreUser']['pk']).values('modelo', 'pk',
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
        for equip in equipo:
            if equip['ns'] is not None:
                equiplist.append(("Tipo de equipo: " + equip['tipo_equipo__nombre'] + ", Identificador: " + equip['ns'],
                                  "Tipo de equipo: " + equip['tipo_equipo__nombre'] + ", Identificador: " + equip[
                                      'ns']))
            else:
                equiplist.append(("Tipo de equipo: " + equip['tipo_equipo__nombre'] + ", Identificador: " + equip[
                    'cambs'], "Tipo de equipo: " + equip['tipo_equipo__nombre'] + ", Identificador: " + equip['cambs']))
        print(equiplist)
        form = formOrden(typeworklist, equiplist, request.POST)
        print(form.errors)
        if form.is_valid():
            print(form.cleaned_data['fecha'])

            try:
                if Orden.objects.filter(nofolio=form.cleaned_data['folio']).exists():
                    return JsonResponse({"code": 2}, content_type="application/json", safe=False)
                elif Orden.objects.filter(equipo=Equipo.objects.get(
                        Q(ns=form.cleaned_data['equipo'].split(":", 2)[2].strip()) | Q(
                            cambs=form.cleaned_data['equipo'].split(":", 2)[2].strip())
                ), estado__lt=1).exists():
                    return JsonResponse({"code": 3}, content_type="application/json", safe=False)
                else:
                    orden = Orden.objects.create(nofolio=form.cleaned_data['folio'],
                                                 estado=-1,
                                                 start=datetime.datetime.now().date(),
                                                 end=None,
                                                 depto=Departamento.objects.get(nombre=form.cleaned_data['depto']),
                                                 subdepto=SubDepartamento.objects.get(
                                                     nombre=form.cleaned_data['subdepto']) if (
                                                         form.cleaned_data['subdepto'] != "") else None,
                                                 trabajo=TipoTrabajo.objects.get(
                                                     nombre=form.cleaned_data['tipo_trabajo']),
                                                 incidencia=None,
                                                 survey=None,
                                                 equipo=Equipo.objects.get(
                                                     Q(ns=form.cleaned_data['equipo'].split(":", 2)[2].strip()) | Q(
                                                         cambs=form.cleaned_data['equipo'].split(":", 2)[2].strip())),

                                                 )

                    orden.save()

                    descripcion = Descripcion.objects.create(descripcion=form.cleaned_data['descripcion'], who=0,
                                                             orden=orden)
                    descripcion.save()
                    empleado = Empleado.objects.get(
                        pk=form.cleaned_data['solicitante'].split(":", 1)[1].strip().split(",", 1)[0])
                    empleado.ordenes.add(orden)
                    empleado.save()
                    ordendict = orden.as_dict()
                    print(ordendict)
                    ordendict.update({'descripciones': {'0': form.cleaned_data['descripcion']}})
                    print(ordendict)
                    firebase.instance.reference.database().child("users").child(empleado.uuid).child("ordenes") \
                        .child(str(form.cleaned_data['folio'])).set(ordendict)
                    firebase.instance.reference.database().child("users").child(empleado.uuid).child(
                        "ordenes") \
                        .child(str(form.cleaned_data['folio'])).child("start").set(
                        datetime.datetime.now().strftime("%m/%d/%Y, %H:%M:%S"))

                    firebase.instance.reference.database().child("users").child(empleado.uuid).child("ordenes") \
                        .child(str(form.cleaned_data['folio'])).child("docente").set(
                        empleado.nombre + " " + empleado.ap + " " + empleado.am)


                return JsonResponse({"code": 1}, content_type="application/json", safe=False)
            except Exception as e:
                print(e)
                return JsonResponse({"code": 0}, content_type="application/json", safe=False)

    return JsonResponse({"code": 0}, content_type="application/json", safe=False)


@csrf_exempt
def AssignTec(request):
    if request.method == 'GET':
        try:
            id = request.GET.get('tecnico', None).split(":", 1)[1].strip().split(",", 1)[0]
            print(id)
            print(request.GET.get('folio', None))
            emp = Empleado.objects.get(idEmpleado=id)
            emp.ordenes.add(Orden.objects.get(nofolio=request.GET.get('folio', None)))
            emp.save()

            adm = Empleado.objects.get(idEmpleado=request.session['NombreUser']['pk'])
            adm.ordenes.add(Orden.objects.get(nofolio=request.GET.get('folio', None)))
            adm.save()
            orden = Orden.objects.filter(nofolio=request.GET.get('folio', None))

            desc = Descripcion.objects.get(orden=request.GET.get('folio', None))
            ordendict = orden[0].as_dict()
            print(ordendict)
            ordendict.update({'descripciones': {'0': desc.descripcion}})
            print(ordendict)
            firebase.instance.reference.database().child("users").child(emp.uuid).child(
                "ordenes") \
                .child(str(request.GET.get('folio', None))).set(ordendict)

            emp2 = Empleado.objects.filter(Q(ordenes=request.GET.get('folio', None)) & ~Q(tipo__nombre="Administrador"))
            for e in emp2:

                for e2 in emp2:
                    if e2.tipo.nombre == "Técnico":
                        firebase.instance.reference.database().child("users").child(e.uuid).child(
                            "ordenes") \
                            .child(str(request.GET.get('folio', None))).child("tecnico").set(
                            e2.nombre + " " + e2.ap + " " + e2.am)
                        firebase.instance.reference.database().child("users").child(e.uuid).child(
                            "ordenes") \
                            .child(str(request.GET.get('folio', None))).child("estado").set(0)
                    elif e2.tipo.nombre == "Docente":
                        firebase.instance.reference.database().child("users").child(e.uuid).child(
                            "ordenes") \
                            .child(str(request.GET.get('folio', None))).child("docente").set(
                            e2.nombre + " " + e2.ap + " " + e2.am)
                        firebase.instance.reference.database().child("users").child(e.uuid).child(
                            "ordenes") \
                            .child(str(request.GET.get('folio', None))).child("estado").set(0)

            orden.update(estado=0)
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
            # user = authenticate(username=email, password=passs)

            if Empleado.objects.filter(email=email, password=passs).exists():
                # if user is not None:
                # login(request,user)
                us = Empleado.objects.get(email=email, password=passs)
                if (us.estado == False):
                    return JsonResponse({'logincode': -1}, content_type="application/json", safe=False)
                if (us.adminstate == False):
                    return JsonResponse({'logincode': -2}, content_type="application/json", safe=False)
                ordenes = {}
                if us.tipo.nombre == "Docente":
                    emp = Empleado.objects.filter(pk=us.pk).values('ordenes__pk')
                    print(emp)
                    ordenes = Orden.objects.filter(estado__gte=1, survey=None, pk__in=emp).values('pk')
                if us.tipo.nombre == "Técnico":
                    emp = Empleado.objects.filter(pk=us.pk).values('ordenes__pk')
                    print(emp)
                    ordenes = Orden.objects.filter(estado=0,pk__in=emp).values('pk')

                request.session['NombreUser'] = {'email': us.email, 'pass': us.password,
                                                 'nombre': us.nombre, 'ap': us.ap, 'am': us.am
                    , 'tipo': us.tipo.nombre,
                                                 'pk': us.idEmpleado}  # Creamos una sesión asociada al usuario
                return JsonResponse(
                    {'logincode': 0, 'userName': us.tipo.nombre + " : " + us.nombre + " " + us.ap + " " + us.am,
                     'usertype': us.tipo.nombre, 'ordenes': list(ordenes)}, content_type="application/json", safe=False)
            else:
                return JsonResponse({'logincode': 1}, content_type="application/json", safe=False)
            # else:
            #     return JsonResponse({'logincode': 1}, content_type="application/json", safe=False)
        else:  # En caso de que el formulario no sea valido, se procedera a recargar la página para volver a introducir credenciales
            return JsonResponse({'logincode': 1}, content_type="application/json", safe=False)
    else:  # Analogamente al else de arriba, por si el metodo de envio no es post
        return JsonResponse({'logincode': 1}, content_type="application/json", safe=False)


@csrf_exempt
def CerrarSesion(request):
    try:
        # logout(request)
        del request.session['NombreUser']
        return JsonResponse({'logincode': 2}, content_type="application/json", safe=False)
    except Exception as e:
        print(e)
        return JsonResponse({'logincode': 3}, content_type="application/json", safe=False)
        print("No se pudo cerrar sesión")


@csrf_exempt
def ShowTecnicos(request):
    return JsonResponse(
        serializers.serialize('json', Empleado.objects.filter(tipo=TipoUsuario.objects.get(nombre='Técnico'))),
        content_type="application/json", safe=False)


@csrf_exempt
def ShowRegisters(request):
    return JsonResponse(
        serializers.serialize('json',
                              Empleado.objects.filter(tipo=TipoUsuario.objects.get(nombre='Docente'))),
        content_type="application/json", safe=False)


@csrf_exempt
def ShowOrdersAdmin(request):
    query = Orden.objects.all().order_by('estado').values('nofolio', 'estado',
                                       'start',
                                       'end',
                                       'depto__nombre',
                                       'subdepto__nombre',
                                       'trabajo__nombre',
                                       'incidencia',
                                       'survey',
                                       'equipo__ns',
                                       'equipo__cambs',
                                       'equipo__pk')

    listpks = []
    for val in query:
        listpks.append(val['nofolio'])
    print(listpks)

    ordenes = list(query)
    for order in ordenes:
        descripciones = Descripcion.objects.filter(orden=order['nofolio']).values('descripcion', 'who')
        order['descripciones'] = list(descripciones)
        solicitante = Empleado.objects.filter(ordenes=order['nofolio']).values('nombre',
                                                                               'ap',
                                                                               'am',
                                                                               'pk',
                                                                               'tipo__nombre'
                                                                               )
        order['empleados'] = list(solicitante)
    tecnicos = Empleado.objects.filter(tipo=TipoUsuario.objects.get(nombre="Técnico")).values('nombre',
                                                                                              'ap',
                                                                                              'am',
                                                                                              'pk',
                                                                                              'trabajos__nombre',
                                                                                              'tipo__nombre')
    # return HttpResponse(json.dumps(list(query), cls=DjangoJSONEncoder), content_type="application/json")
    return HttpResponse(json.dumps(
        {'orden': list(query), 'tecnicos': list(tecnicos),'date':datetime.datetime.now().date()},
        cls=DjangoJSONEncoder), content_type="application/json")


@csrf_exempt
def ShowOrdersDoc(request):
    solicitante = Empleado.objects.filter(pk=request.session['NombreUser']['pk']).values('nombre',
                                                                                         'ap',
                                                                                         'am',
                                                                                         'pk',
                                                                                         'tipo__nombre',
                                                                                         'ordenes__nofolio',
                                                                                         'ordenes__estado',
                                                                                         'ordenes__start',
                                                                                         'ordenes__end',
                                                                                         'ordenes__nofolio',
                                                                                         )
    solicitudes = list(solicitante)
    for sol in solicitudes:
        print(sol['ordenes__nofolio'])
        tecnico = Empleado.objects.filter(Q(ordenes=sol['ordenes__nofolio']) & Q(tipo__nombre="Técnico")).values(
            'nombre',
            'ap',
            'am',
            'pk',
            'tipo__nombre')
        sol['tecnico'] = list(tecnico)
    # return HttpResponse(json.dumps(list(query), cls=DjangoJSONEncoder), content_type="application/json")
    return HttpResponse(json.dumps(
        {'solicitante': list(solicitante)},
        cls=DjangoJSONEncoder), content_type="application/json")


@csrf_exempt
def finishOrder(request):
    try:
        orden = Orden.objects.filter(pk=request.GET.get('idOrden', None)).update(estado=int(request.GET.get('status', None)),
                                                                                 end=datetime.datetime.now().date())
        print(orden)
        print(request.GET.get('msg', None))
        descripcion = Descripcion.objects.create(descripcion=request.GET.get('msg', None), who=1,
                                                 orden=Orden.objects.get(pk=request.GET.get('idOrden', None)))
        descripcion.save()
        emp = Empleado.objects.filter(Q(ordenes=request.GET.get('idOrden', None)) & ~Q(tipo__nombre="Administrador"))
        for e in emp:
            firebase.instance.reference.database().child("users").child(e.uuid).child(
                "ordenes") \
                .child(str(request.GET.get('idOrden', None))).child("estado").set(int(request.GET.get('status', None)))
            firebase.instance.reference.database().child("users").child(e.uuid).child(
                "ordenes") \
                .child(str(request.GET.get('idOrden', None))).child("descripciones").child("1").set(
                request.GET.get('msg', None))
            firebase.instance.reference.database().child("users").child(e.uuid).child(
                "ordenes") \
                .child(str(request.GET.get('idOrden', None))).child("end").set(
                datetime.datetime.now().strftime("%m/%d/%Y, %H:%M:%S"))
        return JsonResponse({"code": 1}, content_type="application/json", safe=False)
    except Exception as e:
        print(e)
        return JsonResponse({"code": 0}, content_type="application/json", safe=False)


@csrf_exempt
def cancelOrder(request):
    try:
        orden = Orden.objects.get(pk=request.GET.get('idOrden', None))
        print(orden)
        empleado = Empleado.objects.filter(ordenes=request.GET.get('idOrden', None))
        for emp in empleado:
            firebase.instance.reference.database().child("users").child(emp.uuid).child(
                "ordenes") \
                .child(str(request.GET.get('idOrden', None))).remove()

        orden.delete()
        return JsonResponse({"code": 1}, content_type="application/json", safe=False)
    except Exception as e:
        print(e)
        return JsonResponse({"code": 0}, content_type="application/json", safe=False)


@csrf_exempt
def ShowOrdersTec(request):
    solicitante = Empleado.objects.filter(pk=request.session['NombreUser']['pk']).values('nombre',
                                                                                         'ap',
                                                                                         'am',
                                                                                         'pk',
                                                                                         'tipo__nombre',
                                                                                         'ordenes__nofolio',
                                                                                         'ordenes__estado',
                                                                                         'ordenes__start',
                                                                                         'ordenes__end',
                                                                                         'ordenes__nofolio',
                                                                                         )
    solicitudes = list(solicitante)
    for sol in solicitudes:
        print(sol['ordenes__nofolio'])
        docente = Empleado.objects.filter(Q(ordenes=sol['ordenes__nofolio']) & Q(tipo__nombre="Docente")).values(
            'nombre',
            'ap',
            'am',
            'pk',
            'tipo__nombre')
        sol['docente'] = list(docente)
    # return HttpResponse(json.dumps(list(query), cls=DjangoJSONEncoder), content_type="application/json")
    return HttpResponse(json.dumps(
        {'solicitante': list(solicitante)},
        cls=DjangoJSONEncoder), content_type="application/json")


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
    query = Equipo.objects.all().order_by('tipo_equipo').values('modelo', 'pk',
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
                                        'lastupdate',
                                        'marca__nombre')

    for eq in query:
        estado = Orden.objects.filter(equipo=eq['pk'], estado__lt=1).exists()
        eq.update({'estado': estado})
    # print(list(query))
    return HttpResponse(json.dumps(list(query), cls=DjangoJSONEncoder), content_type="application/json")
    # return JsonResponse(
    #     serializers.serialize('json', Equipo.objects.all().values('nombre', 'pk',
    #                                                               'ubicacion__edificio',
    #                                                               'ubicacion__piso',
    #                                                               'ubicacion__sala')),
    #     content_type="application/json", safe=False)


@csrf_exempt
def ShowEquipmentDoc(request):
    # print(request.GET.get('nombreDep', None))
    query = Equipo.objects.filter(empleado=request.session['NombreUser']['pk']).values('modelo', 'pk',
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
    for eq in query:
        estado = Orden.objects.filter(equipo=eq['pk'], estado__lt=1).exists()
        eq.update({'estado': estado})
    return HttpResponse(json.dumps(list(query), cls=DjangoJSONEncoder), content_type="application/json")


@csrf_exempt
def DelTecnicos(request):
    try:
        print(request.GET.get('idEmp', None))
        emp = Empleado.objects.get(idEmpleado=request.GET.get('idEmp', None))

        for val in emp.ordenes.all():
            print(val)
            # Orden.objects.filter(pk = order).update(estado = -1)

        user = firebase.instance.authuser(emp.email, emp.password)
        if (user is not None):
            firebase.instance.deleteuser(user['idToken'])

            firebase.instance.reference.database().child("users").child(emp.uuid).remove()
            emp.delete()
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
    subdep = SubDepartamento.objects.filter(depto__nombre=request.GET.get('depto', None)).values('nombre',
                                                                                                 'ubicacion__edificio',
                                                                                                 'ubicacion__piso',
                                                                                                 'ubicacion__sala'
                                                                                                 )

    return HttpResponse(json.dumps(
        {'subdepto': list(subdep)},
        cls=DjangoJSONEncoder), content_type="application/json")

@csrf_exempt
def showTerms(request):
    print(os.path.join(os.path.dirname(__file__),"TERMINOS-Y-CONDICIONES.pdf"))
    with open(os.path.join(os.path.dirname(__file__),"TERMINOS-Y-CONDICIONES.pdf"), 'rb') as pdf:
        response = HttpResponse(pdf.read(), content_type='application/pdf')
        response['Content-Disposition'] = 'inline;filename=some_file.pdf'
        return response

@csrf_exempt
def getUserInfo(request):
    # print(request.GET.get('depto', None))
    folio = -1
    if (Orden.objects.all().count() == 0):
        folio = 1
    else:
        folio = Orden.objects.all().count() + 1
    query = Empleado.objects.filter(pk=request.session['NombreUser']['pk']).values('pk',
                                                                                   'nombre',
                                                                                   'ap',
                                                                                   'am',
                                                                                   'email',
                                                                                   'password',
                                                                                   'numero',
                                                                                   'ext',
                                                                                   'departamento__nombre',
                                                                                   'subdepartamento__nombre',
                                                                                   'subdepartamento__ubicacion__edificio',
                                                                                   'subdepartamento__ubicacion__piso',
                                                                                   'subdepartamento__ubicacion__sala'
                                                                                   )
    instalacion = InstalacionSoft.objects.all().values('nombre')

    equipo = Equipo.objects.filter(empleado=request.session['NombreUser']['pk']).values('modelo', 'pk',
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
    return HttpResponse(json.dumps(
        {'data': list(query), 'equipo': list(equipo), 'folio': folio, 'fecha': datetime.datetime.now().date(), 'instalacion': list(instalacion)},
        cls=DjangoJSONEncoder), content_type="application/json")


@csrf_exempt
def getUserInfoById(request):
    # print(request.GET.get('depto', None))
    query = Empleado.objects.filter(pk=request.GET.get('pk', None)).values('pk',
                                                                           'nombre',
                                                                           'ap',
                                                                           'am',
                                                                           'email',
                                                                           'password',
                                                                           'numero',
                                                                           'ext',
                                                                           'departamento__nombre',
                                                                           'subdepartamento__nombre',
                                                                           'ordenes__nofolio',
                                                                           'ordenes__estado',
                                                                           'ordenes__start',
                                                                           'ordenes__end',
                                                                           'ordenes__equipo__ns',
                                                                           'ordenes__equipo__tipo_equipo__nombre',
                                                                           'ordenes__trabajo__nombre',
                                                                           )
    equipo = Equipo.objects.filter(empleado=request.GET.get('pk', None)).values('modelo', 'pk',
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
    return HttpResponse(json.dumps(
        {'data': list(query), 'equipo': list(equipo)},
        cls=DjangoJSONEncoder), content_type="application/json")

@csrf_exempt
def getOrder(request):
    # print(request.GET.get('depto', None))
    # if (Orden.objects.all().count() == 0):
    #     folio = 1
    # else:
    #     folio = Orden.objects.all().count() + 1
    print("Id Orden -> " + request.GET.get('idOrden', None))
    query = Empleado.objects.filter(Q(ordenes=request.GET.get('idOrden', None)) & ~Q(tipo=1)).values('pk',
                                                                                     'nombre',
                                                                                     'ap',
                                                                                     'am',
                                                                                     'tipo__nombre')

    desc = Descripcion.objects.filter(orden=request.GET.get('idOrden', None)).values('who',
                                                                                     'descripcion')
    orden = Orden.objects.filter(pk=request.GET.get('idOrden', None)).values('pk',
                                                                             'estado',
                                                                             'start',
                                                                             'end',
                                                                             'depto__nombre',
                                                                             'depto__ubicacion__edificio',
                                                                             'depto__ubicacion__piso',
                                                                             'depto__ubicacion__sala',
                                                                             'subdepto__nombre',
                                                                             'subdepto__ubicacion__edificio',
                                                                             'subdepto__ubicacion__piso',
                                                                             'subdepto__ubicacion__sala',
                                                                             'trabajo__nombre',
                                                                             'incidencia__tipoincidencia',
                                                                             'survey__confiabilidad',
                                                                             'survey__responsabilidad',
                                                                             'survey__seguridad',
                                                                             'survey__infrayservicios',
                                                                             'equipo__ns',
                                                                             'equipo__cambs',
                                                                             'equipo__tipo_equipo__nombre'

                                                                             )

    return HttpResponse(json.dumps(
        {'empleados': list(query), 'orden': list(orden), 'desc': list(desc)},
        cls=DjangoJSONEncoder), content_type="application/json")


@csrf_exempt
def sendSurvey(request):
    if request.method == 'POST':  # Validamos el metodo de envio
        form = formSurvey(request.POST)  # Obtenemos los datos del formulario proporcionados por el usuario
        if form.is_valid():  # Validamos que los datos esten en un formato correcto
            conf = 0
            conflen = 0
            resp = 0
            resplen = 0
            seg = 0
            seglen = 0
            infra = 0
            infralen = 0
            for key in form.cleaned_data.__iter__():
                # print(key)
                print(form.cleaned_data[key])
                if key.startswith('choice1'):
                    conflen += 1
                    if form.cleaned_data[key] == "SI":
                        conf += 1
                if key.startswith('choice2'):
                    resplen += 1
                    if form.cleaned_data[key] == "SI":
                        resp += 1
                if key.startswith('choice3'):
                    seglen += 1
                    if form.cleaned_data[key] == "SI":
                        seg += 1
                if key.startswith('choice4'):
                    infralen += 1
                    if form.cleaned_data[key] == "SI":
                        infra += 1
            # print(conflen)
            # print(resplen)
            # print(seglen)
            # print(infralen)
            # print(conf)
            # print(resp)
            # print(seg)
            # print(infra)

            survey = Satisfaccion.objects.create(confiabilidad=(conf / conflen) * 10,
                                                 responsabilidad=(resp / resplen) * 10,
                                                 seguridad=(seg / seglen) * 10,
                                                 infrayservicios=(infra / infralen) * 10)
            Orden.objects.filter(pk=form.cleaned_data['idOrder']).update(survey=survey)
            return JsonResponse({'code': 1}, content_type="application/json", safe=False)
        else:
            print(form.errors)
            return JsonResponse({'code': 2}, content_type="application/json", safe=False)
    else:
        return JsonResponse({'code': 2}, content_type="application/json", safe=False)


@csrf_exempt
def ShowGraph(request):
    return  JsonResponse(
        serializers.serialize('json',
                              Satisfaccion.objects.all()),
        content_type="application/json", safe=False)

@csrf_exempt
def updateDoc(request):
    if request.method == 'POST':
        deplist = []
        subdeplist = []
        typeworklist = []
        for dep in Departamento.objects.all().values('nombre'):
            deplist.append((dep['nombre'], dep['nombre']))
        for subdep in SubDepartamento.objects.all().values('nombre','ubicacion__edificio','ubicacion__piso','ubicacion__sala'):
            subdeplist.append((subdep['nombre']+", Edificio: "+str(subdep['ubicacion__edificio'])+" Piso: "+str(subdep['ubicacion__piso'])+" Sala: "+str(subdep['ubicacion__sala']), subdep['nombre']+", Edificio: "+str(subdep['ubicacion__edificio'])+" Piso: "+str(subdep['ubicacion__piso'])+" Sala: "+str(subdep['ubicacion__sala'])))
        for typework in TipoTrabajo.objects.all().values('nombre'):
            typeworklist.append((typework['nombre'], typework['nombre']))
        subdeplist.append(("Ninguno", "Ninguno"))
        form = formregistro(deplist, subdeplist, typeworklist, request.POST)
        if form.is_valid():
            emp = Empleado.objects.filter(idEmpleado=form.cleaned_data['idEmpleado'])
            print(emp[0].email)
            print(emp[0].password)
            uuid = emp[0].uuid
            user = firebase.instance.authuser(emp[0].email, emp[0].password)
            print(form.cleaned_data['subdepto'].split(",")[0])


            if user is not None:

                firebase.instance.deleteuser(user['idToken'])
                user2 = firebase.instance.createuser(form.cleaned_data['email'], form.cleaned_data['contra'])
                if user2 is not None:
                    emp.update(
                        nombre=form.cleaned_data['nombre'],
                        ap=form.cleaned_data['ap'],
                        am=form.cleaned_data['am'],
                        email=form.cleaned_data['email'],
                        password=form.cleaned_data['contra'],
                        uuid=user2['localId'],
                        numero=form.cleaned_data['telefono'],
                        ext=form.cleaned_data['extension'],
                        estado=True,
                        adminstate=True,
                        departamento=Departamento.objects.get(
                            nombre=form.cleaned_data['depto']),
                        subdepartamento=None if (form.cleaned_data[
                                                     'subdepto'] == "Ninguno") else SubDepartamento.objects.get(
                            nombre=form.cleaned_data['subdepto'].split(",")[0]))

                    ordenes = firebase.instance.reference.database().child("users").child(uuid).child("ordenes").get()
                    firebase.instance.reference.database().child("users").child(uuid).remove()
                    emp2 = Empleado.objects.get(idEmpleado=form.cleaned_data['idEmpleado'])
                    print(ordenes.val())
                    firebase.instance.reference.database().child("users").child(user2['localId']).set(emp2.as_dict())
                    if ordenes.val() is not None:
                        firebase.instance.reference.database().child("users").child(user2['localId']).child(
                            "ordenes").set(ordenes.val())

                return JsonResponse({"code": 1}, content_type="application/json", safe=False)
            else:
                return JsonResponse({"code": 0}, content_type="application/json", safe=False)

        else:
            print(form.errors)
            return JsonResponse({"code": 0}, content_type="application/json", safe=False)
    else:
        return JsonResponse({"code": 0}, content_type="application/json", safe=False)

@csrf_exempt
def changeDocState(request):
    try:
        estado = False
        if request.GET.get('estado', None) == u'true':
            estado = True
        else:
            estado = False
        Empleado.objects.filter(idEmpleado=request.GET.get('pk', None)).update(adminstate=estado)
        return JsonResponse({"code": 1}, content_type="application/json", safe=False)
    except Exception as e:
        print(e)
        return JsonResponse({"code": 0}, content_type="application/json", safe=False)

@csrf_exempt
def recPass(request):
    if request.method == 'POST':
        form = formRecPass(request.POST)
        if form.is_valid():
            print(form.cleaned_data['emailrec'])
            emp = Empleado.objects.get(email=form.cleaned_data['emailrec'])
            send_mail(
                'UDI, Recuperación de contraseña',
                'Saludos.\nSe solicito recuperación de contraseña para :\n'+
                'Cuenta : '+form.cleaned_data['emailrec']+'\n'+
                'Contraseña: '+emp.password+'\nInicia sesión en: 127.0.0.1:8000/index.'+
                'Si no solicitaste tu contraseña, puedes ignorar este email.\n Gracias.',
                'from@example.com',
                [form.cleaned_data['emailrec']],
                fail_silently=False,
            )
            return JsonResponse({"code": 1}, content_type="application/json", safe=False)
        else:
            print(form.errors)
            return JsonResponse({"code": 0}, content_type="application/json", safe=False)
    else:
        return JsonResponse({"code": 0}, content_type="application/json", safe=False)

@csrf_exempt
def AddSoftware(request):
    if request.method == 'POST':
        form = formSoft(request.POST)
        if form.is_valid():
            if form.cleaned_data['option'] == "create":
                if InstalacionSoft.objects.filter(nombre=form.cleaned_data['software']).exists():
                    return JsonResponse({"code": 2}, content_type="application/json", safe=False)
                else:
                    # print(form.cleaned_data['emailrec'])
                    soft = InstalacionSoft.objects.create(nombre=form.cleaned_data['software'],
                                                          descripcion=form.cleaned_data['descripcion'])
                    soft.save()
                    return JsonResponse({"code": 1}, content_type="application/json", safe=False)
            else:
                # print(form.cleaned_data['emailrec'])
                soft = InstalacionSoft.objects.filter(nombre=form.cleaned_data['software']).update(nombre=form.cleaned_data['software'],
                                                      descripcion=form.cleaned_data['descripcion'])
                return JsonResponse({"code": 1}, content_type="application/json", safe=False)

        else:
            print(form.errors)
            return JsonResponse({"code": 0}, content_type="application/json", safe=False)
    else:
        return JsonResponse({"code": 0}, content_type="application/json", safe=False)

@csrf_exempt
def DelSoftware(request):
    try:
        print(request.GET.get('soft', None))
        InstalacionSoft.objects.get(nombre=request.GET.get('soft', None)).delete()
        return JsonResponse({"code": 1}, content_type="application/json", safe=False)
    except Exception as e:
        print(e)
        return JsonResponse({"code": 2}, content_type="application/json", safe=False)

@csrf_exempt
def ShowSoftware(request):
    return JsonResponse(
        serializers.serialize('json',
                              InstalacionSoft.objects.all()),
        content_type="application/json", safe=False)

@csrf_exempt
def getOrderByMonth(request):
    mes = request.GET.get('mes', None)
    print(mes)
    if mes == "Todos":
        orden = Orden.objects.all().values('pk',
                                     'estado',
                                     'start',
                                     'end',
                                     'depto__nombre',
                                     'depto__ubicacion__edificio',
                                     'depto__ubicacion__piso',
                                     'depto__ubicacion__sala',
                                     'subdepto__nombre',
                                     'subdepto__ubicacion__edificio',
                                     'subdepto__ubicacion__piso',
                                     'subdepto__ubicacion__sala',
                                     'trabajo__nombre',
                                     'incidencia__tipoincidencia',
                                     'survey__confiabilidad',
                                     'survey__responsabilidad',
                                     'survey__seguridad',
                                     'survey__infrayservicios',
                                     'equipo__ns',
                                     'equipo__cambs',
                                     'equipo__tipo_equipo__nombre'

                                     )
        return HttpResponse(json.dumps(
        {'ordenes': list(orden)},
        cls=DjangoJSONEncoder), content_type="application/json")
    else:
        valmes = months(mes)
        print(valmes)
        orden = Orden.objects.filter(start__month=valmes).values('pk',
                                   'estado',
                                   'start',
                                   'end',
                                   'depto__nombre',
                                   'depto__ubicacion__edificio',
                                   'depto__ubicacion__piso',
                                   'depto__ubicacion__sala',
                                   'subdepto__nombre',
                                   'subdepto__ubicacion__edificio',
                                   'subdepto__ubicacion__piso',
                                   'subdepto__ubicacion__sala',
                                   'trabajo__nombre',
                                   'incidencia__tipoincidencia',
                                   'survey__confiabilidad',
                                   'survey__responsabilidad',
                                   'survey__seguridad',
                                   'survey__infrayservicios',
                                   'equipo__ns',
                                   'equipo__cambs',
                                   'equipo__tipo_equipo__nombre'
                                   )
        return HttpResponse(json.dumps(
        {'ordenes': list(orden)},
        cls=DjangoJSONEncoder), content_type="application/json")


def getEquipInfo(request):
    equiposlibres = Equipo.objects.filter(empleado=None).count()
    equiposok = Equipo.objects.all().count() - Orden.objects.filter(estado__lte=0).count()
    equiposbad = Orden.objects.filter(estado__lte = 0).count()
    return HttpResponse(json.dumps(
        {'equiposlibres': equiposlibres,'equiposok':equiposok,'equiposbad':equiposbad},
        cls=DjangoJSONEncoder), content_type="application/json")

def reporteOrden(request, idOrden):
    print("::. Reporte Orden .::")

    print(idOrden)
    orden = Orden.objects.get(nofolio = idOrden)
    docente = Empleado.objects.get(ordenes = orden, tipo = 3)
    tec = Empleado.objects.get(ordenes = orden, tipo = 2)
    adm = Empleado.objects.get(ordenes = orden, tipo = 1)
    descdoc = Descripcion.objects.get(orden = orden, who = 0)
    desctec = Descripcion.objects.get(orden = orden, who = 1)
    print(descdoc)
    print(desctec)

    # emps = Empleado.objects.filter(ordenes = orden)
    print(docente)
    print(tec)
    print(adm)
    # print(result["1"])
    # print(childs)

    params = {
        'nofolio': idOrden,
        'fecha': orden.start,
        'depto': orden.depto,
        'subdepto': orden.subdepto,
        'solicitante': docente.nombre+" "+docente.ap+" "+docente.am,
        'tecnico': tec.nombre+" "+tec.ap+" "+tec.am,
        'admin': adm.nombre+" "+adm.ap+" "+adm.am,
        'trabajo': orden.trabajo,
        'equipo': orden.equipo,
        'descdoc': descdoc,
        'desctec': desctec
    }
    # Rendered
    html_string = render_to_string("PdfOrden.html", params)
    font_config = FontConfiguration()
    html = HTML(string=html_string, base_url=request.build_absolute_uri())
    result = html.write_pdf(
        stylesheets=[CSS(string=render_to_string("semantic2.css"))],
        font_config=font_config)

    # Creating http response
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'filename=Reporte_Orden' + str(idOrden) + '.pdf'

    return HttpResponse(result, content_type='application/pdf')

def reporteServicios(request,mes):
    print("::. Reporte Servicios .::")
    print(mes)

    orderok = Orden.objects.filter(estado = 1).count()
    orderbad = Orden.objects.filter(estado = 2).count()
    orderproc = Orden.objects.filter(estado__lte = 0).count()

    equiposlibres = Equipo.objects.filter(empleado = None).count()
    equiposok = Equipo.objects.all().count() - Orden.objects.filter(estado__lte = 0).count()
    equiposbad = orderproc

    confiabilidad = Satisfaccion.objects.aggregate(Avg('confiabilidad'))['confiabilidad__avg']
    responsabilidad = Satisfaccion.objects.aggregate(Avg('responsabilidad'))['responsabilidad__avg']
    seguridad = Satisfaccion.objects.aggregate(Avg('seguridad'))['seguridad__avg']
    infrayservicios = Satisfaccion.objects.aggregate(Avg('infrayservicios'))['infrayservicios__avg']

    params = {
        'orderok':orderok,
        'orderbad':orderbad,
        'orderproc':orderproc,
        'equiposlibres':equiposlibres,
        'equiposok':equiposok,
        'equiposbad':equiposbad,
        'confiabilidad':confiabilidad,
        'responsabilidad':responsabilidad,
        'seguridad':seguridad,
        'infrayservicios':infrayservicios,
    }
    # Rendered
    html_string = render_to_string("PdfServicio.html", params)
    font_config = FontConfiguration()
    html = HTML(string=html_string, base_url=request.build_absolute_uri())
    result = html.write_pdf(
        stylesheets=[CSS(string=render_to_string("semantic2.css"))],
        font_config=font_config)

    # Creating http response
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'filename=Report_Servicios.pdf'

    return HttpResponse(result, content_type='application/pdf')


def months(argument):
    switcher = {
        "Enero": "01",
        "Febrero": "02",
        "Marzo": "03",
        "Abril": "04",
        "Mayo": "05",
        "Junio": "06",
        "Julio": "07",
        "Agosto": "08",
        "Septiembre": "09",
        "Octubre": "10",
        "Noviembre": "11",
        "Diciembre": "12"
    }
    return switcher.get(argument, "No valido")
