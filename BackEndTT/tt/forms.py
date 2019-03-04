from django import forms


class formlogin(forms.Form):
    correo = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Ingresa tu usuario'}),label="Usuario", max_length=100,required=True)
    passs = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'Ingresa tu contraseña'}), label="Contraseña", max_length=100,required=True)

class formDepartamento(forms.Form):
    laboratorio = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Ingresa el laboratorio'}),label="Laboratorio", max_length=100,required=True)
    nombredep = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Ingresa el nombre'}), label="Nombre", max_length=100,required=True)
    option = forms.CharField(label="option", max_length=60,required=False)
    pkdep = forms.IntegerField(label="pkdep",required=False)

class formregistro(forms.Form):
    TypeTec = (
        ('Hardware', 'Hardware'),
        ('Software', 'Software'),
    )
    idEmpleado = forms.IntegerField(widget=forms.TextInput(attrs={'placeholder': 'ID Empleado'}),label="idEmpleado",required=True)
    email = forms.CharField(widget=forms.EmailInput(attrs={'placeholder': 'Correo'}), label="Email", max_length=60,required=True)
    # departamento = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Departamento'}), label="Departamento", max_length=60,required=True)
    contra = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'Contraseña'}), label="Contraseña", max_length=60,required=True)
    nombre = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Usuario'}), label="Nombre", max_length=60,required=True)
    ap = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Apellido Paterno'}), label="Apellido Paterno", max_length=60,required=True)
    am = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Apellido Materno'}), label="Apellido Materno", max_length=60,required=True)
    tipoEmpleado = forms.CharField(label="tipoEmpleado", max_length=60,required=False)
    tipotecnico = forms.ChoiceField(choices=TypeTec, label="Tipo de técnico")