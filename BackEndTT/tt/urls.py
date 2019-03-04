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
    url(r'^ajax/DelTecnicos/$', views.DelTecnicos, name='DelTecnicos'),
    url(r'^ajax/AddDepartment/$', views.AddDepartment, name='AddDepartment'),
    url(r'^ajax/DelDepartment/$', views.DelDepartment, name='DelDepartment'),
]
