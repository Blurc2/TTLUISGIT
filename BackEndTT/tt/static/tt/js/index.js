{% load static %}
var update = false
var idDepartamento = -1

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

}


$(document).ready(function()
{
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
else
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
            $("#registererror").text("Este correo ya se encuentra registrado en el sistema.")
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
  '  <th>Opciones</th>'+
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
    var json = JSON.parse(data)
    console.log(json)
    $("#contenido").append(createDepTable(json))
    $("#tabledepart").fadeIn('slow')
    if(!$.isEmptyObject(json))
    {

        json.forEach(function(element) {

              $(("#"+(element['fields']['laboratorio']+element['fields']['nombre']+"update")).replace(/\s+/g, '')).on('click',function()
              {
                $("#DepartmentHeader").text("Modificar Departamento")
                $("#badregdep").hide()
                $("#okregdep").hide()
                $("#DepartmentBtn").val("Actualizar departamento")
                $("#id_laboratorio").val(element['fields']['laboratorio'])
                $("#id_nombredep").val(element['fields']['nombre'])
                idDepartamento = element['pk']

                $('#DepartmentMod').modal('show')
              });

              $(("#"+(element['fields']['laboratorio']+element['fields']['nombre']+"delete")).replace(/\s+/g, '')).on('click',function()
              {
                $.ajax({
                    url : "{% url "tt:DelDepartment" %}",
                    data : {'nombre':element['fields']['nombre']},
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
        });


    }

$("#agregardep").on('click',function(){
        $("#DepartmentHeader").text("Añadir Departamento")
            $("#badregdep").hide()
            $("#okregdep").hide()
            $("#DepartmentBtn").val("Añadir departamento")
            $('#DepartmentMod').modal('show')
        });
    }
});
}

function createDepTable(json)
{
    var html ='<table id="tabledepart" style="display:none;" class="ui red celled table">'+
  '<thead>'+
  '  <tr><th>Nombre</th>'+
  '  <th>Laboratorio</th>'+
  '  <th>Opciones</th>'+
  '</tr></thead>'+
  '<tbody>';
  if($.isEmptyObject(json))
  {
    html+='<tr><td class="collapsing"></td><td></td><td></td></tr>'
  }
  json.forEach(function(element) {
      html +='<tr><td class="collapsing"><i class="user icon"></i>'+
        element['fields']['nombre']+
        '</td><td>'+element['fields']['laboratorio']+'</td>';
        html+='<td class="right aligned collapsing"><div class="ui buttons"><button class="ui negative button" id="'+(element['fields']['laboratorio']+element['fields']['nombre']+"delete").replace(/\s+/g, '')+'">Borrar</button>'+
          '<div class="or" data-text="o"></div>'+
          '<button class="ui positive button" id="'+(element['fields']['laboratorio']+element['fields']['nombre']+"update").replace(/\s+/g, '')+'">Editar</button></div></td></tr>';
    });

  html +='<tfoot class="full-width">'+
    '<tr>'+
      '<th></th>'+
      '<th colspan="4">'+
      '  <div class="ui right floated small primary labeled icon button" id="agregardep">'+
     '     <i class="user icon"></i> Agregar Departamento'+
    '    </div>'+
   '   </th>'+
  '  </tr>'+
 ' </tfoot>'+
'  </tbody>'+
'</table>';

return html;

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