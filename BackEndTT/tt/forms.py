from django import forms


class formlogin(forms.Form):
    correo = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Ingresa tu usuario'}),label="Usuario", max_length=100,required=True)
    passs = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'Ingresa tu contraseña'}), label="Contraseña", max_length=100,required=True)

class formDepartamento(forms.Form):
    nombredep = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Ingresa el nombre'}), label="Nombre", max_length=100,required=True)
    edificio = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Ubicación : Edificio'}), label="Edificio",required=True)
    piso = forms.IntegerField(widget=forms.TextInput(attrs={'placeholder': 'Ubicación : Piso'}), label="Piso",required=True)
    sala = forms.IntegerField(widget=forms.TextInput(attrs={'placeholder': 'Ubicación : Sala'}), label="Sala",required=True)
    option = forms.CharField(label="option", max_length=60,required=False)
    pkdep = forms.IntegerField(label="pkdep",required=False)
    depname = forms.CharField(label="depname",required=False)

class formEquipo(forms.Form):
    def __init__(self, departamento_choices,empleados_choices, *args, **kwargs):
        super(formEquipo, self).__init__(*args, **kwargs)
        self.fields['departamento'].choices = departamento_choices
        self.fields['empleados'].choices = empleados_choices
    TypeEquipo = (
        ('Computo', 'Computo'),
        ('Impresora', 'Impresora'),
    )
    tipoequipo = forms.ChoiceField(choices=TypeEquipo, label="Tipo de equipo",required=True)
    departamento = forms.ChoiceField(choices=(),label="Departamento",required=True)
    empleados = forms.ChoiceField(choices=(),label="Empleados",required=True)
    fmarca = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Marca del equipo'}), label="Marca",required=True)
    idequipo = forms.IntegerField(widget=forms.TextInput(attrs={'placeholder': 'Id del equipo'}), label="Id Equipo",required=True)
    fmodelo = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Modelo del equipo'}), label="Modelo", max_length=100,required=False)
    fmac = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Mac del equipo'}), label="Mac",required=False)
    fns = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Numero de serie del equipo'}), label="Numero de serie",required=True)
    fip = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Dirección ip del equipo'}), label="Dirección IP",required=False)
    fcambs = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Cambs del equipo'}), label="Cambs",required=False)
    fsistema_operativo = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Sistema operativo del equipo'}),label="Sistema Operativo", max_length=60,required=False)
    fprocesador = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Procesador del equipo'}),label="Procesador",required=False)
    fnum_puertos = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Numero de puertos del equipo'}),label="Numero de Puertos",required=False)
    fmemoria_ram = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Memoria RAM del equipo'}),label="Memoria RAM",required=False)
    fdisco_duro = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Disco duro  del equipo'}),label="Disco Duro",required=False)
    fidf = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'IDF del equipo'}),label="IDF",required=False)
    fcaracteristicas = forms.CharField(widget=forms.Textarea(attrs={'placeholder': 'Caracteristicas del equipo'}),label="Caracteristicas",required=False)
    fobservaciones = forms.CharField(widget=forms.Textarea(attrs={'placeholder': 'Observaciones del equipo'}),label="Observaciones",required=False)
    option = forms.CharField(label="option", max_length=60,required=False)

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
    telefono = forms.IntegerField(widget=forms.TextInput(attrs={'placeholder': 'Teléfono'}), label="Teléfono",required=True)
    extension = forms.IntegerField(widget=forms.TextInput(attrs={'placeholder': 'Extensión'}), label="Extensión",required=False)
    tipoEmpleado = forms.CharField(label="tipoEmpleado", max_length=60,required=False)
    tipotecnico = forms.ChoiceField(choices=TypeTec, label="Tipo de técnico")