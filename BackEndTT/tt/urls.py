from django.conf.urls import url
from django.urls import path
from . import views

app_name='tt'

urlpatterns=[
    url(r'^index', views.Index, name='Index'),
    url(r'^ajax/Registrar/$', views.Registrar, name='Registrar'),
    url(r'^ajax/IniciarSesion/$', views.IniciarSesion, name='IniciarSesion'),
    url(r'^ajax/CerrarSesion/$', views.CerrarSesion, name='CerrarSesion'),
    url(r'^ajax/ShowTecnicos/$', views.ShowTecnicos, name='ShowTecnicos'),
    url(r'^ajax/ShowDepartments/$', views.ShowDepartments, name='ShowDepartments'),
    url(r'^ajax/ShowSubDepartments/$', views.ShowSubDepartments, name='ShowSubDepartments'),
    url(r'^ajax/ShowRegisters/$', views.ShowRegisters, name='ShowRegisters'),
    url(r'^ajax/ShowOrdersAdmin/$', views.ShowOrdersAdmin, name='ShowOrdersAdmin'),
    url(r'^ajax/ShowOrdersDoc/$', views.ShowOrdersDoc, name='ShowOrdersDoc'),
    url(r'^ajax/ShowOrdersTec/$', views.ShowOrdersTec, name='ShowOrdersTec'),
    url(r'^ajax/ShowEquipment/$', views.ShowEquipment, name='ShowEquipment'),
    url(r'^ajax/ShowEquipmentDoc/$', views.ShowEquipmentDoc, name='ShowEquipmentDoc'),
    url(r'^ajax/DelTecnicos/$', views.DelTecnicos, name='DelTecnicos'),
    url(r'^ajax/DelEquipment/$', views.DelEquipment, name='DelEquipment'),
    url(r'^ajax/AddDepartment/$', views.AddDepartment, name='AddDepartment'),
    url(r'^ajax/AddEquip/$', views.AddEquip, name='AddEquip'),
    url(r'^ajax/AddOrder/$', views.AddOrder, name='AddOrder'),
    url(r'^ajax/AssignTec/$', views.AssignTec, name='AssignTec'),
    url(r'^ajax/DelDepartment/$', views.DelDepartment, name='DelDepartment'),
    url(r'^ajax/DelSubDepartment/$', views.DelSubDepartment, name='DelSubDepartment'),
    url(r'^ajax/ValidarDocente/$', views.ValidarDocente, name='ValidarDocente'),
    url(r'^ajax/getSubDepartments/$', views.getSubDepartments, name='getSubDepartments'),
    url(r'^ajax/getUserInfo/$', views.getUserInfo, name='getUserInfo'),
    url(r'^ajax/getOrder/$', views.getOrder, name='getOrder'),
    url(r'^ajax/finishOrder/$', views.finishOrder, name='finishOrder'),
    url(r'^ajax/cancelOrder/$', views.cancelOrder, name='cancelOrder'),
    url(r'^ajax/sendSurvey/$', views.sendSurvey, name='sendSurvey'),
    url(r'^ajax/ShowGraph/$', views.ShowGraph, name='ShowGraph'),
    url(r'^ajax/getOrderByMonth/$', views.getOrderByMonth, name='getOrderByMonth'),
    url(r'^ajax/recPass/$', views.recPass, name='recPass'),
    url(r'^ajax/updateDoc/$', views.updateDoc, name='updateDoc'),
]
