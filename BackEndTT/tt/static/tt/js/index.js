{% load static %}
var update = false
var idDepartamento = -1
var deptoName = ""
var equipoName = ""
var formorder = ""

function showRegisterModal()
{
    $("#headerFormReg").text("Registrate")
    $("#typetec").hide()
    update = false
    $("#btnRegistrar").val("Registrar")
    $("#badreg").hide()
    $("#okreg").hide()
    $('#id_idEmpleado').attr('readonly', false);
//    $("#department").show()
    $('#regform').modal('show')
    $("#deptochoices").show()
    $('#registro').trigger("reset");

    $.ajax({
            url: "{% url 'tt:getSubDepartments' %}",
            type: 'GET',
            data: {'depto':$('#id_depto').val()},
            success: function (data) {
                var json = JSON.parse(data)
                var newOptions = {};
                var index = 0;
                json.forEach(function(element){
                   newOptions[(index++).toString()] = element['fields']['nombre']
                });
                newOptions[(index++).toString()] = "Ninguno"

                var $el = $("#id_subdepto");
                $el.empty();
                $.each(newOptions, function(key,value) {
                  $el.append($("<option></option>")
                     .attr("value", value).text(value));
                });
            }
        });

    $('#id_depto').on('change', function (e) {
        var valueSelected = this.value;
        // alert(valueSelected)
        $.ajax({
            url: "{% url 'tt:getSubDepartments' %}",
            type: 'GET',
            data: {'depto':valueSelected},
            success: function (data) {
                var json = JSON.parse(data)
                var newOptions = {};
                var index = 0;
                json.forEach(function(element){
                   newOptions[(index++).toString()] = element['fields']['nombre']
                });
                newOptions[(index++).toString()] = "Ninguno"

                var $el = $("#id_subdepto");
                $el.empty();
                $.each(newOptions, function(key,value) {
                  $el.append($("<option></option>")
                     .attr("value", value).text(value));
                });
            }
        });
    });

}


$(document).ready(function()
{
    formorder = $("#divformorder").html()
    $("#contenido").empty()
{% if userName %}
    $("#username").text('{{ userName }}')
    $(".sesionforms").hide()
    $(".sesion").show()
    {% if usertype == "Administrador" %}
        $(".itemadmin").show('slow')
        if(sessionStorage.getItem("menuItem") == "TECNICOS")
            showTec()
        else if(sessionStorage.getItem("menuItem") == "DEPARTAMENTOS")
            showDep()
        else if(sessionStorage.getItem("menuItem") == "REGISTROS")
            showRegisters()
        else if(sessionStorage.getItem("menuItem") == "EQUIPO")
            showEquipment()
//        else if(sessionStorage.getItem("menuItem") == "SUBDEPTO")
//            showSubDepartments(deptoName)
    {% elif usertype == "Docente" %}
        $(".itemdocente").show('slow')
    {% elif usertype == "Tecnico" %}
        $(".itemtecnico").show('slow')
    {% endif %}
{% else %}
    $(".sesionforms").show()
    $(".sesion").hide()
{% endif %}
});

$("form#DepartmentForm").submit(function(e){
e.preventDefault();
var formData = new FormData(this);

if($("#DepartmentHeader").text()=="Añadir Departamento")
{
        formData.append('option', 'create')
        formData.append('pkdep', -1);
        $("form#DepartmentForm").addClass( "loading" )
        $("#badregdep").hide();
        $("#okregdep").hide();

        $.ajax({
        url: "{% url 'tt:AddDepartment' %}",
        type: 'POST',
        data: formData,
        success: function (data) {
        console.log(data.code)
        $("form#DepartmentForm").removeClass( "loading" )
        if(data.code == 0)
        {
            $("#registererrordep").text("Error, intenta más tarde.")
            $("#badregdep").fadeIn("slow");
        }
        else if(data.code == 2)
        {
            $("#registererrordep").text("Este departamento ya se encuentra registrado en el sistema")
            $("#badregdep").fadeIn("slow");
        }
        else
            {
                $("#okregdepmsg").text("Departamento registrado exitosamente")
                $("#okregdep").fadeIn("slow");
                setTimeout(function(){location.reload();},2500)
            }
        },
        cache: false,
        contentType: false,
        processData: false
        });
}
else if ($("#DepartmentHeader").text()=="Modificar Departamento")
{
formData.append('option', "update");
formData.append('pkdep', idDepartamento);

        $("form#DepartmentForm").addClass( "loading" )
        $("#badregdep").hide();
        $("#okregdep").hide();
        $.ajax({
        url: "{% url 'tt:AddDepartment' %}",
        type: 'POST',
        data: formData,
        success: function (data) {
        console.log(data.code)
        $("form#DepartmentForm").removeClass( "loading" )
        if(data.code == 0)
            {
                $("#registererrordep").text("Error, intenta más tarde.")
                $("#badregdep").fadeIn("slow");
            }
        else if(data.code == 2)
        {
            $("#registererrordep").text("Error al intentar actualizar el departament, intenta de nuevo más tarde")
            $("#badregdep").fadeIn("slow");
        }
        else
            {
                $("#okregdepmsg").text("Departamento registrado exitosamente")
                $("#okregdep").fadeIn("slow");
                setTimeout(function(){location.reload();},2500)
            }
        },
        cache: false,
        contentType: false,
        processData: false
        });
}
else if($("#DepartmentHeader").text()=="Añadir SubDepartamento")
{
        formData.append('option', 'createsub')
        formData.append('pkdep', -1);
        formData.append('depname', deptoName);
        $("form#DepartmentForm").addClass( "loading" )
        $("#badregdep").hide();
        $("#okregdep").hide();

        $.ajax({
        url: "{% url 'tt:AddDepartment' %}",
        type: 'POST',
        data: formData,
        success: function (data) {
        console.log(data.code)
        $("form#DepartmentForm").removeClass( "loading" )
        if(data.code == 0)
        {
            $("#registererrordep").text("Error, intenta más tarde.")
            $("#badregdep").fadeIn("slow");
        }
        else if(data.code == 2)
        {
            $("#registererrordep").text("Este Subdepartamento ya se encuentra registrado en el sistema")
            $("#badregdep").fadeIn("slow");
        }
        else
            {
                $("#okregdepmsg").text("SubDepartamento registrado exitosamente")
                $("#okregdep").fadeIn("slow");
                setTimeout(function(){location.reload();},2500)
            }
        },
        cache: false,
        contentType: false,
        processData: false
        });
}
else if ($("#DepartmentHeader").text()=="Modificar SubDepartamento")
{
formData.append('option', "updatesub");
formData.append('pkdep', idDepartamento);
formData.append('depname', deptoName);
        $("form#DepartmentForm").addClass( "loading" )
        $("#badregdep").hide();
        $("#okregdep").hide();
        $.ajax({
        url: "{% url 'tt:AddDepartment' %}",
        type: 'POST',
        data: formData,
        success: function (data) {
        console.log(data.code)
        $("form#DepartmentForm").removeClass( "loading" )
        if(data.code == 0)
            {
                $("#registererrordep").text("Error, intenta más tarde.")
                $("#badregdep").fadeIn("slow");
            }
        else if(data.code == 2)
        {
            $("#registererrordep").text("Error al intentar actualizar el subdepartamento, intenta de nuevo más tarde")
            $("#badregdep").fadeIn("slow");
        }
        else
            {
                $("#okregdepmsg").text("SubDepartamento registrado exitosamente")
                $("#okregdep").fadeIn("slow");
                setTimeout(function(){location.reload();},2500)
            }
        },
        cache: false,
        contentType: false,
        processData: false
        });
}
});

$("form#EquipoForm").submit(function(e){
e.preventDefault();
var formData = new FormData(this);

if($("#EquipoHeader").text()=="Añadir Equipo")
{
        formData.append('option', 'create')
        $("form#EquipoForm").addClass( "loading" )
        $("#badregequipo").hide();
        $("#okregequipo").hide();

        $.ajax({
        url: "{% url 'tt:AddEquip' %}",
        type: 'POST',
        data: formData,
        success: function (data) {
        console.log(data.code)
        $("form#EquipoForm").removeClass( "loading" )
        if(data.code == 0)
        {
            $("#registererrorequipo").text("Error, intenta más tarde.")
            $("#badregequipo").fadeIn("slow");
        }
        else if(data.code == 2)
        {
            $("#registererrorequipo").text("Este equipo ya se encuentra registrado en el sistema")
            $("#badregequipo").fadeIn("slow");
        }
        else
            {
                $("#okregmsgequipo").text("Equipo registrado exitosamente")
                $("#okregequipo").fadeIn("slow");
                setTimeout(function(){location.reload();},2500)
            }
        },
        cache: false,
        contentType: false,
        processData: false
        });
}
else if ($("#EquipoHeader").text()=="Modificar Equipo")
{
formData.append('option', "update");

        $("form#EquipoForm").addClass( "loading" )
        $("#badregequipo").hide();
        $("#okregequipo").hide();
        $.ajax({
        url: "{% url 'tt:AddEquip' %}",
        type: 'POST',
        data: formData,
        success: function (data) {
        console.log(data.code)
        $("form#EquipoForm").removeClass( "loading" )
        if(data.code == 0)
            {
                $("#registererrorequipo").text("Error, intenta más tarde.")
                $("#badregequipo").fadeIn("slow");
            }
        else if(data.code == 2)
        {
            $("#registererrorequipo").text("Error al intentar actualizar el equipo, intenta de nuevo más tarde")
            $("#badregequipo").fadeIn("slow");
        }
        else
            {
                $("#okregmsgequipo").text("Equipo registrado exitosamente")
                $("#okregequipo").fadeIn("slow");
                setTimeout(function(){location.reload();},2500)
            }
        },
        cache: false,
        contentType: false,
        processData: false
        });
}
});

$("form#registro").submit(function(e) {
e.preventDefault();
var formData = new FormData(this);
//alert(formData.get('email'))
//alert(isIpn(formData.get('email')))
if($("#headerFormReg").text()=="Registrate")
{

    formData.append('tipoEmpleado', "DOCENTE");
    if(isIpn(formData.get('email')))
    {
        $("form#registro").addClass( "loading" )
        $("#badreg").hide();
        $("#okreg").hide();
        $.ajax({
        url: "{% url 'tt:Registrar' %}",
        type: 'POST',
        data: formData,
        success: function (data) {
        console.log(data.code)
        $("form#registro").removeClass( "loading" )
        if(data.code == 0)
            {
                $("#registererror").text("Error, intenta más tarde.")
                $("#badreg").fadeIn("slow");
            }
        else if(data.code == 2)
        {
            $("#registererror").text("Este correo o id de empleado ya se encuentra registrado en el sistema.")
            $("#badreg").fadeIn("slow");
        }
        else
            {
                $("#okregmsg").text("Espera a que el administrador valide el registro, se te enviara un correo cuando suceda.")
                $("#okreg").fadeIn("slow");
            }
        },
        cache: false,
        contentType: false,
        processData: false
    });
    }
    else
    {
    Lobibox.notify('error', {
                        size: 'mini',
                        rounded: true,
                        delayIndicator: true,
                        icon: true,
                        title:"<center>CORREO NO VALIDO</center>",
                        iconSource:"fontAwesome",
                        sound:false,
                        msg: "No se pudo validar el correo, el correo debe tener terminación @ipn.com.mx"
                        });
    }
}
else
{
    if(update)
    {
        formData.append('tipoEmpleado', "TECNICOUPDATE");
        $("form#registro").addClass( "loading" )
        $("#badreg").hide();
        $("#okreg").hide();
        $.ajax({
        url: "{% url 'tt:Registrar' %}",
        type: 'POST',
        data: formData,
        success: function (data) {
        console.log(data.code)
        $("form#registro").removeClass( "loading" )
        if(data.code == 0)
            {
                $("#registererror").text("Error, intenta más tarde.")
                $("#badreg").fadeIn("slow");
            }
        else if(data.code == 2)
        {
            $("#registererror").text("Error al intentar actualizar, intenta de nuevo más tarde.")
            $("#badreg").fadeIn("slow");
        }
        else
            {
                $("#okregmsg").text("Técnico actualizado exitosamente")
                $("#okreg").fadeIn("slow");
                setTimeout(function(){location.reload();},2500)
            }
        },
        cache: false,
        contentType: false,
        processData: false
        });

    }
    else
    {
        formData.append('tipoEmpleado', "TECNICO");
        $("form#registro").addClass( "loading" )
        $("#badreg").hide();
        $("#okreg").hide();
        $.ajax({
        url: "{% url 'tt:Registrar' %}",
        type: 'POST',
        data: formData,
        success: function (data) {
        console.log(data.code)
        $("form#registro").removeClass( "loading" )
        if(data.code == 0)
            {
                $("#registererror").text("Error, intenta más tarde.")
                $("#badreg").fadeIn("slow");
            }
        else if(data.code == 2)
        {
            $("#registererror").text("Este correo ya se encuentra registrado en el sistema.")
            $("#badreg").fadeIn("slow");
        }
        else
            {
                $("#okregmsg").text("Técnico registrado exitosamente")
                $("#okreg").fadeIn("slow");
                setTimeout(function(){location.reload();},2500)
            }
        },
        cache: false,
        contentType: false,
        processData: false
        });
    }

}

});

$("form#login").submit(function(e) {
e.preventDefault();
var formData = new FormData(this);

//    $("form#login").addClass( "loading" )
    $.ajax({
    url: "{% url 'tt:IniciarSesion' %}",
    type: 'POST',
    data: formData,
    success: function (data) {
    console.log(data.code)
//    $("form#login").removeClass( "loading" )
    if(data.logincode == 0)
        {
            $("#username").text(data.userName)
            if(data.usertype == "Administrador")
                $(".itemadmin").show('slow')
            else if(data.usertype == "Docente")
                $(".itemdocente").show('slow')
            else if(data.usertype == "Tecnico")
                $(".itemtecnico").show('slow')
            $(".sesionforms").hide('slow')
            $(".sesion").show('slow')
        }
    else if(data.logincode == 1)
        {
        Lobibox.notify('error', {
                    size: 'mini',
                    rounded: true,
                    delayIndicator: true,
                    icon: true,
                    title:"<center>USUARIO INVALIDO</center>",
                    iconSource:"fontAwesome",
                    sound:false,
                    msg: "No se encontro el usuario"
                    });
                    }
    else if(data.logincode == -1)
        {
        Lobibox.notify('error', {
                    size: 'normal',
                    rounded: true,
                    delayIndicator: true,
                    icon: true,
                    title:"<center>USUARIO NO VALIDADO</center>",
                    iconSource:"fontAwesome",
                    sound:false,
                    msg: "Esta cuenta esta en proceso de validación, cuando sea validada se te enviara un correo a la dirección registrada."
                    });
                    }
    },
    cache: false,
    contentType: false,
    processData: false
});

});

function cerrarSesion()
{
$.ajax({
    url: "{% url 'tt:CerrarSesion' %}",
    type: 'POST',
    data: {d:""},
    success: function (data) {
    console.log(data.code)
    if(data.logincode == 2)
        {
            $("#username").text("")
            $(".itemadmin").hide('slow')
            $(".itemdocente").hide('slow')
            $(".itemtecnico").hide('slow')
            $(".sesionforms").show('slow')
            $(".sesion").hide('slow')
            sessionStorage.removeItem("menuItem")
            $("#contenido").empty()

        }
    else if(data.logincode == 3)
        {
        Lobibox.notify('error', {
                    size: 'mini',
                    rounded: true,
                    delayIndicator: true,
                    icon: true,
                    title:"<center>ERROR</center>",
                    iconSource:"fontAwesome",
                    sound:false,
                    msg: "No se pudo cerrar sesión, intenta de nuevo más tarde"
                    });
                    }
    }
});
}

function showTec()
{
    $("#contenido").empty()
    sessionStorage.setItem("menuItem", "TECNICOS");
    $.ajax({
    url: "{% url 'tt:ShowTecnicos' %}",
    type: 'POST',
    data: {d:""},
    success: function (data) {
    var json = JSON.parse(data)
    console.log(json)
    $("#contenido").append(createTecTable(json))
    $("#tablatecnico").fadeIn('slow')
    if(!$.isEmptyObject(json))
    {

        json.forEach(function(element) {

              $(("#"+element['fields']['nombre']+element['fields']['ap']+element['fields']['am']+"update").replace(/\s+/g, '')).on('click',function()
              {
                $("#headerFormReg").text("Modificar Técnico")
                $("#typetec").show()
                $("#id_idEmpleado").val(element['pk'])
                $("#badreg").hide()
                $("#okreg").hide()
                $("#btnRegistrar").val("Actualizar")
                update = true
                $('#id_idEmpleado').attr('readonly', true);
                $("#id_email").val(element['fields']['email'])
                $("#id_tipotecnico").val((element['fields']['trabajos']==1) ? "Hardware" : "Software");
                $("#id_contra").val(element['fields']['password'])
                $("#id_nombre").val(element['fields']['nombre'])
                $("#id_ap").val(element['fields']['ap'])
                $("#id_am").val(element['fields']['am'])
                $("#id_telefono").val(element['fields']['numero'])
                $("#id_extension").val(element['fields']['ext'])
                  $("#deptochoices").hide()
                $('#regform').modal('show')
              });

              $(("#"+element['fields']['nombre']+element['fields']['ap']+element['fields']['am']+"delete").replace(/\s+/g, '')).on('click',function()
              {
                $.ajax({
                    url : "{% url "tt:DelTecnicos" %}",
                    data : {'idEmp':element['pk']},
                    dataType : 'json',
                    success : function(data) {
                        console.log(data);
                        if(data.code == 1)
                            {Lobibox.notify('success', {
                                size: 'mini',
                                rounded: true,
                                delayIndicator: true,
                                icon: true,
                                title:"<center>Borrado exitoso</center>",
                                iconSource:"fontAwesome",
                                sound:false,
                                msg: "Técnico eliminado exitosamente"
                                });
                                setTimeout(function(){location.reload();},2500)
                            }
                        else if(data.code == 2)
                            Lobibox.notify('error', {
                                size: 'mini',
                                rounded: true,
                                delayIndicator: true,
                                icon: true,
                                title:"<center>Error al borrar</center>",
                                iconSource:"fontAwesome",
                                sound:false,
                                msg: "No se pudo eliminar el técnico, intenta de nuevo más tarde"
                                });
                    },
                    error : function(xhr, status) {
                        console.log("error ");
                    },
                });
              });
        });


    }
    $("#addTech").on('click',function(){
            update = false
            $("#headerFormReg").text("Añadir Técnico")
            $("#typetec").show()
            $("#badreg").hide()
            $("#okreg").hide()
            $('#id_idEmpleado').attr('readonly', false);
            $("#btnRegistrar").val("Registrar")
//            $("#department").hide()
            $('#regform').modal('show')
            $("#deptochoices").hide()
            $('#registro').trigger("reset");
        });
    }
});
}

function createTecTable(json)
{
    var html ='<table id="tablatecnico" style="display:none;" class="ui red celled table">'+
  '<thead>'+
  '  <tr><th>Técnico</th>'+
  '  <th>Correo</th>'+
  '  <th style="text-align: center;">Opciones</th>'+
  '</tr></thead>'+
  '<tbody>';
  if($.isEmptyObject(json))
  {
    html+='<tr><td class="collapsing"></td><td></td><td></td></tr>'
  }
  json.forEach(function(element) {
      html +='<tr><td class="collapsing"><i class="user icon"></i>'+
        element['fields']['nombre']+' '+element['fields']['ap']+' '+element['fields']['am']+
        '</td><td>'+element['fields']['email']+'</td>';
        html+='<td class="right aligned collapsing"><div class="ui buttons"><button class="ui negative button" id="'+(element['fields']['nombre']+element['fields']['ap']+element['fields']['am']+"delete").replace(/\s+/g, '')+'">Borrar</button>'+
          '<div class="or" data-text="o"></div>'+
          '<button class="ui positive button" id="'+(element['fields']['nombre']+element['fields']['ap']+element['fields']['am']+"update").replace(/\s+/g, '')+'">Editar</button></div></td></tr>';
    });

  html +='<tfoot class="full-width">'+
    '<tr>'+
      '<th></th>'+
      '<th colspan="4">'+
      '  <div class="ui right floated small primary labeled icon button" id="addTech">'+
     '     <i class="user icon"></i> Agregar Tecnico'+
    '    </div>'+
   '   </th>'+
  '  </tr>'+
 ' </tfoot>'+
'  </tbody>'+
'</table>';

return html;

}

function showDep()
{
    $("#contenido").empty()
    sessionStorage.setItem("menuItem", "DEPARTAMENTOS");
    $.ajax({
    url: "{% url 'tt:ShowDepartments' %}",
    type: 'POST',
    data: {x:""},
    success: function (data) {
    var json = data
    console.log(json)
    $("#contenido").append(createDepTable(json))
    $("#tabledepart").fadeIn('slow')
    if(!$.isEmptyObject(json))
    {

        json.forEach(function(element) {

              $(("#"+(element['pk']+element['nombre']+"update")).replace(/\s+/g, '')).on('click',function()
              {
                $("#DepartmentHeader").text("Modificar Departamento")
                $("#badregdep").hide()
                $("#okregdep").hide()
                $("#DepartmentBtn").val("Actualizar departamento")
                $("#id_nombredep").val(element['nombre'])
                $("#id_edificio").val(element['ubicacion__edificio'])
                $("#id_piso").val(element['ubicacion__piso'])
                $("#id_sala").val(element['ubicacion__sala'])
                idDepartamento = element['pk']

                $('#DepartmentMod').modal('show')
              });

              $(("#"+(element['pk']+element['nombre']+"delete")).replace(/\s+/g, '')).on('click',function()
              {
                $.ajax({
                    url : "{% url "tt:DelDepartment" %}",
                    data : {'nombre':element['nombre']},
                    dataType : 'json',
                    success : function(data) {
                        console.log(data);
                        if(data.code == 1)
                            {Lobibox.notify('success', {
                                size: 'mini',
                                rounded: true,
                                delayIndicator: true,
                                icon: true,
                                title:"<center>Borrado exitoso</center>",
                                iconSource:"fontAwesome",
                                sound:false,
                                msg: "Departamento eliminado exitosamente"
                                });
                                setTimeout(function(){location.reload();},2500)
                            }
                        else if(data.code == 2)
                            Lobibox.notify('error', {
                                size: 'mini',
                                rounded: true,
                                delayIndicator: true,
                                icon: true,
                                title:"<center>Error al borrar</center>",
                                iconSource:"fontAwesome",
                                sound:false,
                                msg: "No se pudo eliminar el departamento, intenta de nuevo más tarde"
                                });
                    },
                    error : function(xhr, status) {
                        console.log("error ");
                    },
                });
              });

              $("#"+(element['pk']+element['nombre']+"infoDepto").replace(/\s+/g, '')).on('click',function()
              {
                deptoName = element['nombre']
                showSubDepartments(element['nombre'])
              });

        });


    }

$("#agregardep").on('click',function(){
        $("#DepartmentHeader").text("Añadir Departamento")
            $("#badregdep").hide()
            $("#okregdep").hide()
            $("#DepartmentBtn").val("Añadir departamento")
            $('#DepartmentMod').modal('show')
            $('#DepartmentForm').trigger("reset");
        });
    }
});
}

function createDepTable(json)
{
    var html ='<table id="tabledepart" style="display:none;" class="ui purple celled table">'+
  '<thead>'+
  '  <tr><th colspan="2">Nombre</th>'+
  '  <th colspan="1" style="text-align: center;">Opciones</th>'+
  '</tr></thead>'+
  '<tbody>';
  if($.isEmptyObject(json))
  {
    html+='<tr><td class="collapsing"></td><td></td><td></td></tr>'
  }
  json.forEach(function(element) {
      html +='<tr><td colspan="2" class="collapsing" style="cursor: pointer;" id="'+(element['pk']+element['nombre']+"infoDepto").replace(/\s+/g, '')+'"><i class="fas fa-building"></i>'+
        element['nombre']
        html+='<td colspan="1" class="right aligned collapsing"><div class="ui buttons"><button class="ui negative button" id="'+(element['pk']+element['nombre']+"delete").replace(/\s+/g, '')+'">Borrar</button>'+
          '<div class="or" data-text="o"></div>'+
          '<button class="ui positive button" id="'+(element['pk']+element['nombre']+"update").replace(/\s+/g, '')+'">Editar</button></div></td></tr>';
    });

  html +='<tfoot class="full-width">'+
    '<tr>'+

      '<th colspan="3">'+
      '  <div class="ui right floated small primary labeled icon button" id="agregardep">'+
     '     <i class="fas fa-clinic-medical"></i> Agregar Departamento'+
    '    </div>'+
   '   </th>'+
  '  </tr>'+
 ' </tfoot>'+
'  </tbody>'+
'</table>';

return html;

}

function showEquipment()
{
    $("#contenido").empty()
    sessionStorage.setItem("menuItem", "EQUIPO");
    $.ajax({
    url: "{% url 'tt:ShowEquipment' %}",
    type: 'POST',
    data: {x:""},
    success: function (data) {
    var json = data
    console.log(json)
    $("#contenido").append(createEquipmentTable(json))
    $("#tableequip").fadeIn('slow')
    if(!$.isEmptyObject(json))
    {

        json.forEach(function(element) {

              $(("#"+(element['pk']+element['ns']+"update")).replace(/\s+/g, '')).on('click',function()
              {
                $("#EquipoHeader").text("Modificar Equipo")
                $("#badregequipo").hide()
                $("#okregequipo").hide()
                $("#EquipoBtn").val("Actualizar Equipo")
                $("#id_idequipo").val(element['pk'])
                $('#id_idequipo').attr('readonly', true)
                $("#id_fmodelo").val(element['modelo'])
                $("#id_fmac").val(element['mac'])
                $("#id_fns").val(element['ns'])
                $("#id_fip").val(element['ip'])
                $("#id_fcambs").val(element['cambs'])
                $("#id_fsistema_operativo").val(element['sistema_operativo'])
                $("#id_fprocesador").val(element['procesador'])
                $("#id_fnum_puertos").val(element['num_puertos'])
                $("#id_fmemoria_ram").val(element['memoria_ram'])
                $("#id_fdisco_duro").val(element['disco_duro'])
                $("#id_fidf").val(element['idf'])
                $("#id_fcaracteristicas").val(element['caracteristicas'])
                $("#id_fobservaciones").val(element['observaciones'])
                $("#id_tipoequipo").val(element['tipo_equipo__nombre'])
                $("#id_departamento").val(element['depto__nombre'])
                $("#id_empleados").val("Id Empleado: "+element['empleado__pk']+", Nombre: "+element['empleado__nombre'])
                $("#id_fmarca").val(element['marca__nombre'])
                // idDepartamento = element['pk']

                $('#EquipoMod').modal('show')
              });

              $(("#"+(element['pk']+element['ns']+"delete")).replace(/\s+/g, '')).on('click',function()
              {
                $.ajax({
                    url : "{% url "tt:DelEquipment" %}",
                    data : {'idEquipo':element['pk']},
                    dataType : 'json',
                    success : function(data) {
                        console.log(data);
                        if(data.code == 1)
                            {Lobibox.notify('success', {
                                size: 'mini',
                                rounded: true,
                                delayIndicator: true,
                                icon: true,
                                title:"<center>Borrado exitoso</center>",
                                iconSource:"fontAwesome",
                                sound:false,
                                msg: "Equipo eliminado exitosamente"
                                });
                                setTimeout(function(){location.reload();},2500)
                            }
                        else if(data.code == 2)
                            Lobibox.notify('error', {
                                size: 'mini',
                                rounded: true,
                                delayIndicator: true,
                                icon: true,
                                title:"<center>Error al borrar</center>",
                                iconSource:"fontAwesome",
                                sound:false,
                                msg: "No se pudo eliminar el equipo, intenta de nuevo más tarde"
                                });
                    },
                    error : function(xhr, status) {
                        console.log("error ");
                    },
                });
              });

              $("#"+(element['pk']+element['ns']+"infoequipo").replace(/\s+/g, '')).on('click',function()
              {
                equipoName = element['ns']

                  $("#contenido").empty()
                  $("#contenido").hide()
                  $("#contenido").append(showEquipmentInfo(element))
                  $("#contenido").fadeIn('slow')
              });

        });


    }

$("#agregarequipo").on('click',function(){
        $("#EquipoHeader").text("Añadir Equipo")
            $("#badregequipo").hide()
            $("#okregequipo").hide()
            $("#EquipoBtn").val("Añadir Equipo")
            $('#EquipoMod').modal('show')
            $('#EquipoForm').trigger("reset");
        });
    }
});
}

function createEquipmentTable(json)
{
    var html ='<table id="tableequip" style="display:none;" class="ui orange celled table">'+
  '<thead>'+
  '  <tr><th colspan="2">Número de serie</th>'+
    '  <th colspan="2">Tipo de Equipo</th>'+
  '  <th colspan="1" style="text-align: center;">Opciones</th>'+
  '</tr></thead>'+
  '<tbody>';
  if($.isEmptyObject(json))
  {
    html+='<tr><td class="collapsing"></td><td></td><td></td></tr>'
  }
  json.forEach(function(element) {
      html +='<tr><td colspan="2" class="collapsing" style="cursor: pointer;" id="'+(element['pk']+element['ns']+"infoequipo").replace(/\s+/g, '')+'"><i class="fas fa-desktop"></i>'+
        element['ns']+
          '<td colspan="2">'+
        element['tipo_equipo__nombre']+'</td>'
        html+='<td colspan="1" class="right aligned collapsing"><div class="ui buttons"><button class="ui negative button" id="'+(element['pk']+element['ns']+"delete").replace(/\s+/g, '')+'">Borrar</button>'+
          '<div class="or" data-text="o"></div>'+
          '<button class="ui positive button" id="'+(element['pk']+element['ns']+"update").replace(/\s+/g, '')+'">Editar</button></div></td></tr>';
    });

  html +='<tfoot class="full-width">'+
    '<tr>'+

      '<th colspan="5">'+
      '  <div class="ui right floated small primary labeled icon button" id="agregarequipo">'+
     '     <i class="fas fa-laptop"></i> Agregar Equipo'+
    '    </div>'+
   '   </th>'+
  '  </tr>'+
 ' </tfoot>'+
'  </tbody>'+
'</table>';

return html;

}

function showEquipmentInfo(json) {
    var html='<div class="ui sixteen wide column placeholder segments">\n' +
        '        <center>\n' +
        '            <div class="ui icon header">\n' +
        '                <i class="tv icon"></i>\n' +
        '                Información del equipo con NS : '+json['ns']+'\n' +
        '            </div>\n' +
        '        </center>\n' +
        '        <div class="ui segment">\n' +
        '        </div>\n' +
        '        <div class="ui segments">\n' +
        '            <div class="ui segment">\n' +
        '\n' +
        '                <p style="opacity: 0.5;"><i class="user icon"></i>&nbsp;Equipo perteneciente a : </p><p id="equipdatauser">Id Empleado: '+json['empleado__pk']+', Nombre del empleado: '+json['empleado__nombre']+'</p>\n' +
        '            </div>\n' +
        '            <div class="ui segment">\n' +
        '\n' +
        '                <p style="opacity: 0.5;"><i class="laptop icon"></i>&nbsp;Tipo de equipo: </p><p id="equipdatatype">'+json['tipo_equipo__nombre']+'</p>\n' +
        '            </div>\n' +
        '            <div class="ui segment">\n' +
        '\n' +
        '                <p style="opacity: 0.5;"><i class="fas fa-building"></i>&nbsp;Departamento actual: </p><p id="equipdatadepto">'+json['depto__nombre']+'</p>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '        <div class="ui segment">\n' +
        '            <p><i class="far fa-calendar-check"></i>&nbsp;Datos generales del equipo</p>\n' +
        '        </div>\n' +
        '        <div class="ui horizontal segments">\n' +
        '            <div class="ui segment" >\n' +
        '                <p style="opacity: 0.5;">Número de serie: </p><p id="equipdatans">'+json['ns']+'</p>\n' +
        '            </div>\n' +
        '            <div class="ui segment">\n' +
        '                <p style="opacity: 0.5;">Modelo: </p><p id="equipdatamodelo">'+json['modelo']+'</p>\n' +
        '            </div>\n' ;
    if(json['tipo_equipo__nombre'] === 'Computo') {
        html +=
            '            <div class="ui segment equipcomputer">\n' +
            '                <p style="opacity: 0.5;">MAC: </p><p id="equipdatamac">'+json['mac']+'</p>\n' +
            '            </div>\n' +
            '            <div class="ui segment equipcomputer">\n' +
            '                <p style="opacity: 0.5;" >IP: </p><p id="equipadataip">'+json['ip']+'</p>\n' +
            '            </div>\n' +
            '\n';
    }
        html+=
        '        </div>\n' +
        '\n' ;
    if(json['tipo_equipo__nombre'] === 'Computo') {
        html +=
            '        <div class="ui segment equipcomputer">\n' +
            '            <p><i class="fas fa-cogs"></i>&nbsp;Caracteristicas del equipo de computo</p>\n' +
            '        </div>\n' +
            '        <div class="ui horizontal segments">\n' +
            '            <div class="ui segment equipcomputer" >\n' +
            '                <p style="opacity: 0.5;">Sistema Operativo: </p><p id="equipdataSO">'+json['sistema_operativo']+'</p>\n' +
            '            </div>\n' +
            '            <div class="ui segment equipcomputer">\n' +
            '                <p style="opacity: 0.5;">Procesador: </p><p id="equipdataprocesador">'+json['procesador']+'</p>\n' +
            '            </div>\n' +
            '            <div class="ui segment equipcomputer">\n' +
            '                <p style="opacity: 0.5;">Número de puertos: </p><p id="equipdatapuertos">'+json['num_puertos']+'</p>\n' +
            '            </div>\n' +
            '            <div class="ui segment equipcomputer">\n' +
            '                <p style="opacity: 0.5;">Memoria RAM: </p><p id="equipadataram">'+json['memoria_ram']+'</p>\n' +
            '            </div>\n' +
            '            <div class="ui segment equipcomputer">\n' +
            '                <p style="opacity: 0.5;">Disco Duro: </p><p id="equipadatahdd">'+json['disco_duro']+'</p>\n' +
            '            </div>\n' +
            '\n' +
            '        </div>\n' +
            '\n';
    }
    html+=
        '        <div class="ui segment">\n' +
        '            <i class="fas fa-book-open"></i>&nbsp;Datos adicionales</p>\n' +
        '        </div>\n' +
        '        <div class="ui horizontal segments">\n' +
        '            <div class="ui segment" >\n' +
        '                <p style="opacity: 0.5;">Caracteristicas: </p><textarea style="width: 75%;" readonly id="equipdatafeatures">'+json['caracteristicas']+'</textarea >\n' +
        '            </div>\n' +
        '            <div class="ui segment">\n' +
        '                <p style="opacity: 0.5;">Observaciones: </p><textarea style="width: 75%;" readonly id="equipdatacommentary">'+json['observaciones']+'</textarea>\n' +
        '            </div>\n' +
        '\n' +
        '        </div>\n' +
        '\n' +
        '    </div>';

    return html;

}

function showRegisters()
{
    $("#contenido").empty()
    sessionStorage.setItem("menuItem", "REGISTROS");
    $.ajax({
    url: "{% url 'tt:ShowRegisters' %}",
    type: 'POST',
    data: {x:""},
    success: function (data) {
    var json = JSON.parse(data)
    console.log(json)
    $("#contenido").append(createRegistersTable(json))
    $("#tableregisters").fadeIn('slow')
    if(!$.isEmptyObject(json))
    {

        json.forEach(function(element) {

              $(("#"+(element['pk']+element['fields']['nombre']+"validate")).replace(/\s+/g, '')).on('click',function()
              {

                $.ajax({
                url: "{% url 'tt:ValidarDocente' %}",
                type: 'GET',
                data: {action:"OK",idEmp:element['pk'],correo:element['fields']['email']},
                success: function (data) {
                    if(data.code == 0)
                    {
                    Lobibox.notify('success', {
                                size: 'mini',
                                rounded: true,
                                delayIndicator: true,
                                icon: true,
                                title:"<center>Enviando correo</center>",
                                iconSource:"fontAwesome",
                                sound:false,
                                msg: "Enviado correo de validación a: "+element['fields']['email']
                                });
                    setTimeout(function(){location.reload();},2500)
                    }
                    else
                    {
                    Lobibox.notify('error', {
                                size: 'mini',
                                rounded: true,
                                delayIndicator: true,
                                icon: true,
                                title:"<center>Error al validar</center>",
                                iconSource:"fontAwesome",
                                sound:false,
                                msg: "No se pudo validar o enviar el correo, intenta de nuevo más tarde"
                                });
                    }

                }
                });
              });

              $(("#"+(element['pk']+element['fields']['nombre']+"invalidate")).replace(/\s+/g, '')).on('click',function()
              {

                $.ajax({
                url: "{% url 'tt:ValidarDocente' %}",
                type: 'GET',
                data: {'action':"ERROR",'idEmp':element['pk'],'correo':element['fields']['email']},
                success: function (data) {
                    if(data.code == 0)
                    {
                    Lobibox.notify('success', {
                                size: 'mini',
                                rounded: true,
                                delayIndicator: true,
                                icon: true,
                                title:"<center>Enviando correo</center>",
                                iconSource:"fontAwesome",
                                sound:false,
                                msg: "Enviado correo de validación a: "+element['fields']['email']
                                });
                    setTimeout(function(){location.reload();},2500)
                    }
                    else
                    {
                    Lobibox.notify('error', {
                                size: 'mini',
                                rounded: true,
                                delayIndicator: true,
                                icon: true,
                                title:"<center>Error al validar</center>",
                                iconSource:"fontAwesome",
                                sound:false,
                                msg: "No se pudo validar o enviar el correo, intenta de nuevo más tarde"
                                });
                    }
                }
                });
              });
        });
        }
    }
    });
}

function createRegistersTable(json)
{
    var html ='<table id="tableregisters" style="display:none;" class="ui blue celled table">'+
  '<thead>'+
  '  <tr><th colspan="1">Id Empleado</th>'+
  '  <th colspan="2">Nombre</th>'+
  '  <th colspan="3">Correo</th>'+
  '  <th colspan="1" style="text-align: center;">Opciones</th>'+
  '</tr></thead>'+
  '<tbody>';
  if($.isEmptyObject(json))
  {
    html+='<tr><td class="collapsing"></td><td></td><td></td></tr>'
  }
  json.forEach(function(element) {
      html +='<tr><td colspan="1" class="collapsing"><i class="user icon"></i>'+
        element['pk']+
        '</td><td colspan="2">'+element['fields']['nombre']+'</td>'+
        '</td><td colspan="3">'+element['fields']['email']+'</td>';
        html+='<td colspan="1" class="right aligned collapsing"><div class="ui buttons"><button class="ui negative button" id="'+(element['pk']+element['fields']['nombre']+"invalidate").replace(/\s+/g, '')+'">Invalidar</button>'+
          '<div class="or" data-text="o"></div>'+
          '<button class="ui positive button" id="'+(element['pk']+element['fields']['nombre']+"validate").replace(/\s+/g, '')+'">Validar</button></div></td></tr>';
    });

  html +=
'  </tbody>'+
'</table>';

return html;

}

function showSubDepartments(deptoName)
{

$("#contenido").empty()
    sessionStorage.setItem("menuItem", "DEPARTAMENTOS");
    $.ajax({
    url: "{% url 'tt:ShowSubDepartments' %}",
    type: 'GET',
    data: {"nombreDep":deptoName},
    success: function (data) {
    var json = data
    console.log(json)
    $("#contenido").append(createSubDepTable(json,deptoName))
    $("#tablesupDep").fadeIn('slow')
    if(!$.isEmptyObject(json))
    {

        json.forEach(function(element) {

              $(("#"+(element['pk']+element['nombre']+"update")).replace(/\s+/g, '')).on('click',function()
              {
                $("#DepartmentHeader").text("Modificar SubDepartamento")
                $("#badregdep").hide()
                $("#okregdep").hide()
                $("#DepartmentBtn").val("Actualizar SubDepartamento")
                $("#id_nombredep").val(element['nombre'])
                $("#id_edificio").val(element['ubicacion__edificio'])
                $("#id_piso").val(element['ubicacion__piso'])
                $("#id_sala").val(element['ubicacion__sala'])
                idDepartamento = element['pk']

                $('#DepartmentMod').modal('show')
              });

              $(("#"+(element['pk']+element['nombre']+"delete")).replace(/\s+/g, '')).on('click',function()
              {
                    $.ajax({
                    url : "{% url "tt:DelSubDepartment" %}",
                    data : {'nombre':element['nombre']},
                    dataType : 'json',
                    success : function(data) {
                        console.log(data);
                        if(data.code == 1)
                            {Lobibox.notify('success', {
                                size: 'mini',
                                rounded: true,
                                delayIndicator: true,
                                icon: true,
                                title:"<center>Borrado exitoso</center>",
                                iconSource:"fontAwesome",
                                sound:false,
                                msg: "SubDepartamento eliminado exitosamente"
                                });
                                setTimeout(function(){location.reload();},2500)
                            }
                        else if(data.code == 2)
                            Lobibox.notify('error', {
                                size: 'mini',
                                rounded: true,
                                delayIndicator: true,
                                icon: true,
                                title:"<center>Error al borrar</center>",
                                iconSource:"fontAwesome",
                                sound:false,
                                msg: "No se pudo eliminar el subdepartamento, intenta de nuevo más tarde"
                                });
                    },
                    error : function(xhr, status) {
                        console.log("error ");
                    },
                });
              });
        });
        }

        $("#agregarSubDep").on('click',function(){
        $("#DepartmentHeader").text("Añadir SubDepartamento")
            $("#badregdep").hide()
            $("#okregdep").hide()
            $("#DepartmentBtn").val("Añadir SubDepartamento")
            $('#DepartmentMod').modal('show')
            $('#DepartmentForm').trigger("reset");
        });
    }
    });
}

function createSubDepTable(json,depto)
{
    var html ='<div class="sixteen wide column"><div class="ui placeholder segment"><center>'+
  '<div class="ui icon header"><i class="warehouse icon"></i>'+
   'Departamento: '+depto+
  '</div></center><br>'+
    '<table id="tablesupDep" style="display:none;" class="ui green celled table">'+
  '<thead>'+
  '  <tr><th colspan="2">Nombre</th>'+
  '  <th colspan="1" style="text-align: center;">Opciones</th>'+
  '</tr></thead>'+
  '<tbody>';
  if($.isEmptyObject(json))
  {
    html+='<tr><td class="collapsing"></td><td></td><td></td></tr>'
  }
  json.forEach(function(element) {
      html +='<tr><td colspan="2" class="collapsing" id="'+(element['pk']+element['nombre']+"infoDepto").replace(/\s+/g, '')+'"><i class="fas fa-building"></i>'+
        element['nombre']
        html+='<td colspan="1" class="right aligned collapsing"><div class="ui buttons"><button class="ui negative button" id="'+(element['pk']+element['nombre']+"delete").replace(/\s+/g, '')+'">Borrar</button>'+
          '<div class="or" data-text="o"></div>'+
          '<button class="ui positive button" id="'+(element['pk']+element['nombre']+"update").replace(/\s+/g, '')+'">Editar</button></div></td></tr>';
    });

  html +='<tfoot class="full-width">'+
    '<tr>'+

      '<th colspan="3">'+
      '  <div class="ui right floated small primary labeled icon button" id="agregarSubDep">'+
     '     <i class="fas fa-clinic-medical"></i> Agregar SubDepartamento'+
    '    </div>'+
   '   </th>'+
  '  </tr>'+
 ' </tfoot>'+
'  </tbody>'+
'</table></div></div>';

return html;

}

function showOrderForm()
{
    $("#contenido").empty()
    $.ajax({
            url : "{% url "tt:getUserInfo" %}",
            data : {},
            dataType : 'json',
            success : function(data) {
                console.log(data);
                $("#contenido").append('<div class="ui sixteen wide column" id="divformorder" style="display: none;">'+formorder+'</div>')
                $("#divformorder").fadeIn()
                $("#id_fecha").val(data['fecha'])
                $("#id_depto").val(data['data'][0]['departamento__nombre'])
                $("#id_subdepto").val(data['data'][0]['subdepartamento__nombre'])
                $("#id_folio").val(data['folio'])
                $("#id_solicitante").val("Id Empleado: "+data['data'][0]['pk']+", Nombre: "+data['data'][0]['nombre']+" "+data['data'][0]['ap']+" "+data['data'][0]['am'])
                // if(data.code == 1)
                //     {Lobibox.notify('success', {
                //         size: 'mini',
                //         rounded: true,
                //         delayIndicator: true,
                //         icon: true,
                //         title:"<center>Borrado exitoso</center>",
                //         iconSource:"fontAwesome",
                //         sound:false,
                //         msg: "SubDepartamento eliminado exitosamente"
                //         });
                //         setTimeout(function(){location.reload();},2500)
                //     }
                // else if(data.code == 2)
                //     Lobibox.notify('error', {
                //         size: 'mini',
                //         rounded: true,
                //         delayIndicator: true,
                //         icon: true,
                //         title:"<center>Error al borrar</center>",
                //         iconSource:"fontAwesome",
                //         sound:false,
                //         msg: "No se pudo eliminar el subdepartamento, intenta de nuevo más tarde"
                //         });
            },
            error : function(xhr, status) {
                console.log("error ");
            },
        });

}


function isIpn(url)
{
/**
*   Función utilizada para validar si una cadena es una url de ipn.
*   @param {url} String - URL a comparar con la expresión regular.
*/
 if (/^([a-zA-Z0-9]+)([\.{1}])?([a-zA-Z0-9]+)\@ipn([\.])com([\.])mx/g.test(url))
     return true;

 return false;

}