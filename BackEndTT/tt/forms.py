from django import forms


class formlogin(forms.Form):
    correo = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Ingresa tu correo'}),label="Correo", max_length=100,required=True)
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
    def __init__(self, departamento_choices,empleados_choices,equipo_choices, *args, **kwargs):
        super(formEquipo, self).__init__(*args, **kwargs)
        self.fields['departamento'].choices = departamento_choices
        self.fields['empleados'].choices = empleados_choices
        self.fields['tipoequipo'].choices = equipo_choices

    tipoequipo = forms.ChoiceField(choices=(), label="Tipo de equipo",required=True)
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
    def __init__(self, departamento_choices, subdepartamentos_choices, tecnico_choices, *args, **kwargs):
        super(formregistro, self).__init__(*args, **kwargs)
        self.fields['depto'].choices = departamento_choices
        self.fields['subdepto'].choices = subdepartamentos_choices
        self.fields['tipotecnico'].choices = tecnico_choices
    idEmpleado = forms.IntegerField(widget=forms.TextInput(attrs={'placeholder': 'ID Empleado'}),label="idEmpleado",required=True)
    email = forms.CharField(widget=forms.EmailInput(attrs={'placeholder': 'Correo'}), label="Email", max_length=60,required=True)
    contra = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'Contraseña'}), label="Contraseña", max_length=60,required=True)
    nombre = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Usuario'}), label="Nombre", max_length=60,required=True)
    ap = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Primer Apellido'}), label="Primer Apellido", max_length=60,required=True)
    am = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Segundo Apellido'}), label="Segundo Apellido", max_length=60,required=True)
    telefono = forms.IntegerField(widget=forms.TextInput(attrs={'placeholder': 'Teléfono'}), label="Teléfono",required=True)
    extension = forms.IntegerField(widget=forms.TextInput(attrs={'placeholder': 'Extensión'}), label="Extensión",required=False)
    tipoEmpleado = forms.CharField(label="tipoEmpleado", max_length=60,required=False)
    tipotecnico = forms.ChoiceField(choices=(), label="Tipo de técnico")
    depto = forms.ChoiceField(choices=(), label="Departamento",required=True)
    subdepto = forms.ChoiceField(choices=(), label="SubDepartamento",required=False)

class formSurvey(forms.Form):
    choice =(
        ('', 'Selecciona una opción'),
        ('SI', 'SI'),
        ('NO', 'NO')
    )
    choice11 = forms.ChoiceField(choices=choice, label="Los requisitos presentados, corresponden a los requisitos solicitados.", required=True)
    choice12 = forms.ChoiceField(choices=choice, label="Las dudas o inquietudes, se resolvieron satisfactoriamente.", required=True)
    choice13 = forms.ChoiceField(choices=choice, label="La gestión del tramite y/o servicio fue satisfactoria.", required=True)
    choice21 = forms.ChoiceField(choices=choice, label="Le informaron sobre los requisitos aplicables al tramite o servicio realizado.", required=True)
    choice22 = forms.ChoiceField(choices=choice, label="El trámite o servicio se realizó en los periodos y horarios establecidos.", required=True)
    choice23 = forms.ChoiceField(choices=choice, label="Se revisaron y cotejaron los datos e información presentada.", required=True)
    choice24 = forms.ChoiceField(choices=choice, label="Los recursos (humanos y materiales) fueron suficientes y eficientes para el trámite o servicio.", required=True)
    choice31 = forms.ChoiceField(choices=choice, label="Se informó sobre el manejo confidencial de datos e información presentada.", required=True)
    choice32 = forms.ChoiceField(choices=choice, label="El trato que se le dio fue el adecuado por parte del personal operativo o responsable.", required=True)
    choice33 = forms.ChoiceField(choices=choice, label="Percibe confiable el trámite y servicio brindado por el personal responsable.", required=True)
    choice41 = forms.ChoiceField(choices=choice, label="El acceso y rutas de emergencia estan indicadas.", required=True)
    choice42 = forms.ChoiceField(choices=choice, label="Las condiciones fueron las adecuadas para realizar el trámite o servicio.", required=True)
    choice43 = forms.ChoiceField(choices=choice, label="El área cuenta con los servicios generales (iluminación, sanitarios, acceso, limpieza, etc.)", required=True)
    choice44 = forms.ChoiceField(choices=choice, label="Las herramientas y equipos fueron los adecuados para el trámite o servicio realizado.", required=True)
    idOrder = forms.CharField(label="idOrder", max_length=60, required=False)

class formOrden(forms.Form):
    def __init__(self, typework_choices,equipo_choices, *args, **kwargs):
        super(formOrden, self).__init__(*args, **kwargs)
        self.fields['tipo_trabajo'].choices = typework_choices
        self.fields['equipo'].choices = equipo_choices
    depto = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Departamento', 'readonly': True}), label="Departamento", max_length=100,required=True)
    subdepto = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'SubDepartamento', 'readonly': True}), label="SubDepartamento", max_length=100,required=False)
    fecha = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Fecha', 'readonly': True}), label="Fecha",required=True)
    folio = forms.IntegerField(widget=forms.TextInput(attrs={'placeholder': 'Folio', 'readonly': True}), label="Folio",required=True)
    solicitante = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Solicitante', 'readonly': True}), label="Solicitante",required=True)
    tipo_trabajo = forms.ChoiceField(choices=(),label="Tipo de trabajo",required=True)
    equipo = forms.ChoiceField(choices=(),label="Equipo involucrado",required=True)
    descripcion = forms.CharField(widget=forms.Textarea(attrs={'placeholder': 'Descripcion'}), max_length=200,label="Descripcion", required=False)