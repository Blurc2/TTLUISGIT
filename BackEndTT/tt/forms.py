from django import forms


class formlogin(forms.Form):
    nombre = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Ingresa tu usuario'}),label="Usuario", max_length=100,required=True)
    contra = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'Ingresa tu contraseña'}), label="Contraseña", max_length=100,required=True)

class formregistro(forms.Form):
    idEmpleado = forms.IntegerField(widget=forms.TextInput(attrs={'placeholder': 'ID Empleado'}),label="idEmpleado",required=True)
    email = forms.CharField(widget=forms.EmailInput(attrs={'placeholder': 'Correo'}), label="Email", max_length=60,required=True)
    departamento = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'Departamento'}), label="Departamento", max_length=60,required=True)
    contra = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'Contraseña'}), label="Contraseña", max_length=60,required=True)
    nombre = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Usuario'}), label="Nombre", max_length=60,required=True)
    ap = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Apellido Paterno'}), label="Apellido Paterno", max_length=60,required=True)
    am = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Apellido Materno'}), label="Apellido Materno", max_length=60,required=True)