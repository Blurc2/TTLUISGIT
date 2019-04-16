{% load static %}
var update = false
var idDepartamento = -1
var deptoName = ""
var equipoName = ""
var formorder = ""
var tipouser = ""

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

function showSurvey(index,json,limit)
{
    if(index==limit)
        return
    else
    {
        $("#SurveyForm").trigger("reset")
        $("#SurveyMod").modal({closable: false}).modal('show')
        $("#pOrdenFolio").text("Tu Orden con No. Folio :"+json[index]['pk'])

        $("form#SurveyForm").submit(function(e) {
            e.preventDefault();
            var formData = new FormData(this);
            $("#SurveyMod").modal('hide')
            showSurvey(index+1,json,limit)
        })
    }

}

$(document).ready(function()
{

    formorder = $("#divformorder").html()
    $("#contenido").empty()
    // $("#btnclosesurveymod").on('click',function(){
    //     $("#SurveyMod").modal('hide')
    // })
     $("#btnclosedepartmentmod").on('click',function(){
        $("#DepartmentMod").modal('hide')
    })
     $("#btncloseequipomod").on('click',function(){
        $("#EquipoMod").modal('hide')
    })
     $("#btncloseordenmod").on('click',function(){
        $("#OrdenMod").modal('hide')
    })
     $("#btncloseregmod").on('click',function(){
        $("#regform").modal('hide')
    })

{% if ordenes %}

    console.log(JSON.parse("{{ ordenes }}".split("&#39;").join('"')))

    var json = JSON.parse("{{ ordenes }}".split("&#39;").join('"'))
    showSurvey(0,json,json.length)

{% endif%}

{% if userName %}
    $("#username").text('{{ userName }}')
    tipouser = "{{ usertype }}"
    $(".sesionforms").hide()
    $(".sesion").show()
    {% if usertype == "Administrador" %}
        $(".itemadmin").show('slow')
        if(sessionStorage.getItem("menuItem") === "TECNICOS")
            showTec()
        else if(sessionStorage.getItem("menuItem") === "DEPARTAMENTOS")
            showDep()
        else if(sessionStorage.getItem("menuItem") === "REGISTROS")
            showRegisters()
        else if(sessionStorage.getItem("menuItem") === "EQUIPO")
            showEquipment()
        else if(sessionStorage.getItem("menuItem") === "ORDENESADMIN")
            showOrdersAdmin()
//        else if(sessionStorage.getItem("menuItem") == "SUBDEPTO")
//            showSubDepartments(deptoName)
    {% elif usertype == "Docente" %}
        $(".itemdocente").show('slow')
        if(sessionStorage.getItem("menuItem") === "EQUIPODOCENTE")
            showEquipmentDoc()
        else if(sessionStorage.getItem("menuItem") === "ORDENDOCENTE")
            showOrderForm()
        else if(sessionStorage.getItem("menuItem") === "ORDENESDOCENTE")
            showOrdersDoc()

    {% elif usertype == "Tecnico" %}
        $(".itemtecnico").show('slow')
        if(sessionStorage.getItem("menuItem") === "ORDERSTEC")
            showOrdersTec()
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
                        msg: "No se pudo validar el correo, el correo debe tener terminación ipn.mx"
                        });
    }
}
else
{
    if(isIpn(formData.get('email')))
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
                        msg: "No se pudo validar el correo, el correo debe tener terminación ipn.mx"
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
            if(data.usertype === "Administrador")
                $(".itemadmin").show('slow')
            else if(data.usertype === "Docente")
                $(".itemdocente").show('slow')
            else if(data.usertype === "Tecnico")
                $(".itemtecnico").show('slow')
            $(".sesionforms").hide('slow')
            $(".sesion").show('slow')
            tipouser = data.usertype
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
        $('#id_tipoequipo').on('change', function (e) {
                        var valueSelected = this.value;
                        // if(element['tipo_equipo__nombre'] != valueSelected)
                            $('#EquipoForm').trigger("reset");
                        $("#id_tipoequipo").val(valueSelected)
                        $("#generalfields").show()
                        $("#datafields").show()
                        if(valueSelected === "Computo")
                        {
                            $("#hardwaresection").show()
                            $("#macfield").show()
                            $("#ipfield").show()
                            $("#systemfield").show()
                        }
                        else
                        {
                            $("#hardwaresection").hide()
                            $("#macfield").hide()
                            $("#ipfield").hide()
                            $("#systemfield").hide()
                        }
                        if(valueSelected === "Mesas" || valueSelected === "Sillas")
                        {
                            $("#cambsfield").show()
                            $("#generalfields").hide()
                            $("#datafields").hide()
                        }
                        else
                        {
                            $("#cambsfield").hide()
                        }
                    });

    if(!$.isEmptyObject(json))
    {

        json.forEach(function(element) {
            var id  = ""
            if(element['ns']!=null)
                id = element['ns']
            else if(element['cambs']!=null)
                id = element['cambs']

              $(("#"+(element['pk']+id+"update")).replace(/\s+/g, '')).on('click',function()
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
                $("#id_empleados").val((element['empleado__pk']!= null) ? "Id Empleado: "+element['empleado__pk']+", Nombre: "+element['empleado__nombre'] : "Equipo Libre")
                $("#id_fmarca").val(element['marca__nombre'])
                // idDepartamento = element['pk']

                   var value = element['tipo_equipo__nombre']

                    $("#generalfields").show()
                    $("#datafields").show()
                    if(value === "Computo")
                    {
                        $("#hardwaresection").show()
                        $("#macfield").show()
                        $("#ipfield").show()
                        $("#systemfield").show()
                    }
                    else
                    {
                        $("#hardwaresection").hide()
                        $("#macfield").hide()
                        $("#ipfield").hide()
                        $("#systemfield").hide()
                    }
                    if(value === "Mesas" || value === "Sillas")
                    {
                        $("#cambsfield").show()
                        $("#generalfields").hide()
                        $("#datafields").hide()
                    }
                    else
                    {
                        $("#cambsfield").hide()
                    }



                $('#EquipoMod').modal('show')
              });

              $(("#"+(element['pk']+id+"delete")).replace(/\s+/g, '')).on('click',function()
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

              $("#"+(element['pk']+id+"infoequipo").replace(/\s+/g, '')).on('click',function()
              {
                equipoName = id

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
        var value = $('#id_tipoequipo').val()

                    $("#generalfields").show()
                    $("#datafields").show()
                    if(value === "Computo")
                    {
                        $("#hardwaresection").show()
                        $("#macfield").show()
                        $("#ipfield").show()
                        $("#systemfield").show()
                    }
                    else
                    {
                        $("#hardwaresection").hide()
                        $("#macfield").hide()
                        $("#ipfield").hide()
                        $("#systemfield").hide()
                    }
                    if(value === "Mesas" || value === "Sillas")
                    {
                        $("#cambsfield").show()
                        $("#generalfields").hide()
                        $("#datafields").hide()
                    }
                    else
                    {
                        $("#cambsfield").hide()
                    }
        });
    }
});
}

function createEquipmentTable(json)
{

    var html ='<table id="tableequip" style="display:none;" class="ui orange celled table">'+
  '<thead>'+
  '  <tr><th colspan="2">Identificador</th>'+
    '  <th colspan="2">Tipo de Equipo</th>'+
    '  <th colspan="2">Estado del Equipo</th>'+
  '  <th colspan="1" style="text-align: center;">Opciones</th>'+
  '</tr></thead>'+
  '<tbody>';
  if($.isEmptyObject(json))
  {
    html+='<tr><td class="collapsing"></td><td></td><td></td></tr>'
  }
  json.forEach(function(element) {
      var id  = ""
    if(element['ns']!=null)
        id = element['ns']
    else if(element['cambs']!=null)
        id = element['cambs']
      html +='<tr><td colspan="2" class="collapsing" style="cursor: pointer;" id="'+(element['pk']+id+"infoequipo").replace(/\s+/g, '')+'"><i class="fas fa-desktop"></i>'+
        id+
          '<td colspan="2">'+
        element['tipo_equipo__nombre']+'</td>'+
           '<td colspan="2">'+
          ((element['estado']) ? "En mantenimiento" : "Buen Estado")+'</td>'
        html+='<td colspan="1" class="right aligned collapsing"><div class="ui buttons"><button class="ui negative button" id="'+(element['pk']+id+"delete").replace(/\s+/g, '')+'">Borrar</button>'+
          '<div class="or" data-text="o"></div>'+
          '<button class="ui positive button" id="'+(element['pk']+id+"update").replace(/\s+/g, '')+'">Editar</button></div></td></tr>';
    });

  html +='<tfoot class="full-width">'+
    '<tr>'+

      '<th colspan="7">'+
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

function showEquipmentDoc()
{
    $("#contenido").empty()
    sessionStorage.setItem("menuItem", "EQUIPODOCENTE");
    $.ajax({
    url: "{% url 'tt:ShowEquipmentDoc' %}",
    type: 'POST',
    data: {x:""},
    success: function (data) {
    var json = data
    console.log(json)
    $("#contenido").append(createEquipmentDocTable(json))
    $("#tableequip").fadeIn('slow')
    if(!$.isEmptyObject(json))
    {

        json.forEach(function(element) {
            var id  = ""
            if(element['ns']!=null)
                id = element['ns']
            else if(element['cambs']!=null)
                id = element['cambs']

              $("#"+(element['pk']+id+"infoequipo").replace(/\s+/g, '')).on('click',function()
              {
                equipoName = id

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

function createEquipmentDocTable(json)
{

    var html ='<table id="tableequip" style="display:none;" class="ui orange celled table">'+
  '<thead>'+
  '  <tr><th colspan="2">Identificador</th>'+
    '  <th colspan="2">Tipo de Equipo</th>'+
    '  <th colspan="2">Estado del Equipo</th>'+
  '</tr></thead>'+
  '<tbody>';
  if($.isEmptyObject(json))
  {
    html+='<tr><td class="collapsing"></td><td></td><td></td></tr>'
  }
  json.forEach(function(element) {
      var id  = ""
        if(element['ns']!=null)
            id = element['ns']
        else if(element['cambs']!=null)
            id = element['cambs']

      html +='<tr><td colspan="2" class="collapsing" style="cursor: pointer;" id="'+(element['pk']+id+"infoequipo").replace(/\s+/g, '')+'"><i class="fas fa-desktop"></i>'+
        id+
          '<td colspan="2">'+
        element['tipo_equipo__nombre']+'</td>'+
          '<td colspan="2">'+
          ((element['estado']) ? "En mantenimiento" : "Buen Estado")+'</td>'
        html+='</tr>';
    });

  html +='</tbody>'+
'</table>';

return html;

}

function showEquipmentInfo(json) {
    var id  = ""
    if(json['ns']!=null)
        id = json['ns']
    else if(json['cambs']!=null)
        id = json['cambs']

    var type = json['tipo_equipo__nombre'] === 'Computo' || json['tipo_equipo__nombre'] === 'Monitor' || json['tipo_equipo__nombre'] === 'Teclado' || json['tipo_equipo__nombre'] === 'Mouse'

    var html='<div class="ui sixteen wide column placeholder segments">\n' +
        '        <center>\n' +
        '            <div class="ui icon header">\n' +
        '                <i class="tv icon"></i>\n' +
        '                Información del equipo con identificador : '+id+'\n' +
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
        '        <div class="ui horizontal segments">\n';
    if(type) {
        html+='            <div class="ui segment" >\n' +
        '                <p style="opacity: 0.5;">Número de serie: </p><p id="equipdatans">' + json['ns'] + '</p>\n' +
        '            </div>\n' +
        '            <div class="ui segment">\n' +
        '                <p style="opacity: 0.5;">Modelo: </p><p id="equipdatamodelo">' + (json['modelo'] != null ? json['modelo'] : "") + '</p>\n' +
        '            </div>\n';
    }
    else if(json['tipo_equipo__nombre'] === 'Sillas' || json['tipo_equipo__nombre'] === 'Mesas') {
        html+='            <div class="ui segment" >\n' +
        '                <p style="opacity: 0.5;">Cambs: </p><p id="equipdatacambs">' + json['cambs'] + '</p>\n' +
        '            </div>\n';
    }
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
        '                <p style="opacity: 0.5;">Caracteristicas: </p><textarea style="width: 75%;" readonly id="equipdatafeatures">'+(json['caracteristicas'] != null ? json['caracteristicas'] : "")+'</textarea >\n' +
        '            </div>\n' +
        '            <div class="ui segment">\n' +
        '                <p style="opacity: 0.5;">Observaciones: </p><textarea style="width: 75%;" readonly id="equipdatacommentary">'+(json['observaciones'] != null ? json['observaciones'] : "")+'</textarea>\n' +
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

function showOrdersAdmin()
{
    $("#contenido").empty()
    sessionStorage.setItem("menuItem", "ORDENESADMIN");
    $.ajax({
    url: "{% url 'tt:ShowOrdersAdmin' %}",
    type: 'POST',
    data: {x:""},
    success: function (data) {
    var json = data
    console.log(json)
    $("#contenido").append(createOrdersAdminTable(json))
    $("#tableorder").fadeIn('slow')
    if(!$.isEmptyObject(json))
    {
        json['orden'].forEach(function(element){

            $(("#"+(element['nofolio']+"ver")).replace(/\s+/g, '')).on('click',function(){
                showOrderInfo(element['nofolio'],element['estado'])
            })

            $(("#"+(element['nofolio']+"cancelar")).replace(/\s+/g, '')).on('click',function(){
                $.ajax({
                        url: "{% url 'tt:cancelOrder' %}",
                        type: 'GET',
                        data: {'idOrden':element['nofolio']},
                        success: function (data) {
                            if(data.code == 1)
                            {
                            Lobibox.notify('success', {
                                        size: 'mini',
                                        rounded: true,
                                        delayIndicator: true,
                                        icon: true,
                                        title:"<center>Orden Eliminada</center>",
                                        iconSource:"fontAwesome",
                                        sound:false,
                                        msg: "Orden eliminada correctamente."
                                        });
                            $('#OrdenMod').modal('hide')
                            setTimeout(function(){location.reload();},2500)
                            }
                            else
                            {
                            Lobibox.notify('error', {
                                        size: 'mini',
                                        rounded: true,
                                        delayIndicator: true,
                                        icon: true,
                                        title:"<center>Error al eliminar orden</center>",
                                        iconSource:"fontAwesome",
                                        sound:false,
                                        msg: "No se pudo eliminar la orden, intenta de nuevo más tarde"
                                        });
                            }

                        }
                        });
            })



            $(".ui.dropdown").dropdown()

            $(("#"+(element['nofolio']+"asignar")).replace(/\s+/g, '')).on('click',function(){

                $('#OrdenMod').modal('show')

                $("#ordenassignHeader").text("Mostrando técnicos de "+element['trabajo__nombre'])
                var newOptions = {};
                var index = 0;
                json['tecnicos'].forEach(function(tecnico){
                    if(tecnico['trabajos__nombre'] === element['trabajo__nombre'])
                        newOptions[(index++).toString()] = "Id Empleado: "+tecnico['pk']+", Nombre: "+tecnico['nombre']+" "+tecnico['ap']+" "+tecnico['am']
                });

                var $el = $("#tecnicoOpts");
                $el.empty();
                $.each(newOptions, function(key,value) {
                  $el.append($("<option></option>")
                     .attr("value", value).text(value));
                });

                    $("#selectTecnicoBtn").on('click',function(){
                    // alert($("#tecnicoOpts").val())
                    $.ajax({
                        url: "{% url 'tt:AssignTec' %}",
                        type: 'GET',
                        data: {'tecnico':$("#tecnicoOpts").val(),'folio':element['nofolio']},
                        success: function (data) {
                            if(data.code == 1)
                            {
                            Lobibox.notify('success', {
                                        size: 'mini',
                                        rounded: true,
                                        delayIndicator: true,
                                        icon: true,
                                        title:"<center>Técnico asignado</center>",
                                        iconSource:"fontAwesome",
                                        sound:false,
                                        msg: "Técnico asignado correctamente."
                                        });
                            $('#OrdenMod').modal('hide')
                            setTimeout(function(){location.reload();},2500)
                            }
                            else
                            {
                            Lobibox.notify('error', {
                                        size: 'mini',
                                        rounded: true,
                                        delayIndicator: true,
                                        icon: true,
                                        title:"<center>Error al asignar al técnico</center>",
                                        iconSource:"fontAwesome",
                                        sound:false,
                                        msg: "No se pudo asignar el técnico, intenta de nuevo más tarde"
                                        });
                            }

                        }
                        });
                })


            })
        })

        }
    }
    });
}

function createOrdersAdminTable(json)
{

    var html ='<table id="tableorder" style="display:none;" class="ui blue celled table">'+
  '<thead>'+
  '  <tr><th colspan="1">No. Folio</th>'+
  '  <th colspan="2">Fecha de inicio</th>'+
  '  <th colspan="2">Fecha de fin</th>'+
  '  <th colspan="1">Estado</th>'+
  '  <th colspan="3">Solicitante</th>'+
  '  <th colspan="1" style="text-align: center;">Opciones</th>'+
  '</tr></thead>'+
  '<tbody>';
  if($.isEmptyObject(json))
  {
    html+='<tr><td class="collapsing"></td><td></td><td></td></tr>'
  }
  json['orden'].forEach(function(element) {
      var solicitante = element['empleados'].find(function(element){
        return element['tipo__nombre'] === "Docente"
        })
      var estado = ""
      var clase = ""
      switch(element['estado'])
      {
          case -1: estado = "Sin asignar"; clase = "negative";
              break;
          case 0: estado = "Asignado, en espera de ser resuelto."; clase = "warning";
              break;
          case 1: estado = "Resuelto"; clase = "positive";
              break;
          default:
      }
      html +='<tr class="'+clase+'"><td colspan="1" class="collapsing"><i class="user icon"></i>'+
        element['nofolio']+
        '</td><td colspan="2">'+element['start']+'</td>'+
        '</td><td colspan="2">'+((element['end']!=null) ? element['end'] : "Pendiente")+'</td>'+
        '</td><td colspan="1">'+estado+'</td>'+
        // '</td><td colspan="1"><center><img style="width: 10%; height:10%;" src="{% static 'tt/img/red.png' %}"/></center></td>'+
        '</td><td colspan="3">Id Empleado: '+solicitante['pk']+', Nombre: '+solicitante['nombre']+' '+solicitante['ap']+' '+solicitante['am']+'</td>';
      if(element['estado']==-1)
      {
          html+='<td colspan="1" class="right aligned collapsing"><div class="ui buttons"><button class="ui negative button" id="'+(element['nofolio']+"cancelar").replace(/\s+/g, '')+'">Borrar</button>'+
          '<div class="or" data-text="o"></div>'+
          '<button class="ui orange button" id="'+(element['nofolio']+"asignar").replace(/\s+/g, '')+'">Asignar</button>'+
           '<div class="or" data-text="o"></div>'+
          '<button class="ui positive button" id="'+(element['nofolio']+"ver").replace(/\s+/g, '')+'">Ver Detalles</button></div></td></tr>';
      }
      else if(element['estado']==0)
      {
          html+='<td colspan="1" class="right aligned collapsing"><center><div class="ui buttons"><button class="ui negative button" id="'+(element['nofolio']+"cancelar").replace(/\s+/g, '')+'">Borrar</button>'+
          '<div class="or" data-text="o"></div>'+
          '<button class="ui positive button" id="'+(element['nofolio']+"ver").replace(/\s+/g, '')+'">Ver Detalles</button></center></div></td></tr>';
      }
      else {

          html+='<td colspan="1" class="right aligned collapsing"><div class="ui buttons"><button class="ui negative button" id="'+(element['nofolio']+"cancelar").replace(/\s+/g, '')+'">Borrar</button>'+
          '<div class="or" data-text="o"></div>'+
          '<button class="ui orange button" id="'+(element['nofolio']+"ver").replace(/\s+/g, '')+'">Ver Detalles</button>'+
           '<div class="or" data-text="o"></div>'+
          '<button class="ui positive button" id="'+(element['nofolio']+"pdf").replace(/\s+/g, '')+'">Generar PDF</button></div></td></tr>';

      }

    });

  html +=
'  </tbody>'+
'</table>';

return html;

}

function showOrdersDoc()
{
    $("#contenido").empty()
    sessionStorage.setItem("menuItem", "ORDENESDOCENTE");
    $.ajax({
    url: "{% url 'tt:ShowOrdersDoc' %}",
    type: 'POST',
    data: {x:""},
    success: function (data) {
        var json = data
        console.log(json)
        $("#contenido").append(createOrdersDocTable(json,"Doc"))
        $("#tableorder").fadeIn('slow')
        if(!$.isEmptyObject(json))
        {
            json['solicitante'].forEach(function(element){
              $("#"+(element['ordenes__nofolio']+"ver").replace(/\s+/g, '')).on('click',function () {
                showOrderInfo(element['ordenes__nofolio'],element['ordenes__estado'])
              })
            })

        }
    }
    });
}

function showOrdersTec()
{
    $("#contenido").empty()
    sessionStorage.setItem("menuItem", "ORDERSTEC")
    $.ajax({
    url: "{% url 'tt:ShowOrdersTec' %}",
    type: 'POST',
    data: {x:""},
    success: function (data) {
        var json = data
        console.log(json)
        $("#contenido").append(createOrdersDocTable(json,"Tec"))
        $("#tableorder").fadeIn('slow')
        if(!$.isEmptyObject(json))
        {
            json['solicitante'].forEach(function(element){
                $("#"+(element['ordenes__nofolio']+"ver").replace(/\s+/g, '')).on('click',function () {
                    showOrderInfo(element['ordenes__nofolio'],element['ordenes__estado'])
                })
            })

        }
    }
    });
}

function createOrdersDocTable(json,type)
{
    var typ = (type==="Doc") ? "Técnico asignado" : "Solicitante"
    var html ='<table id="tableorder" style="display:none;" class="ui blue celled table">'+
  '<thead>'+
  '  <tr><th colspan="1">No. Folio</th>'+
  '  <th colspan="2">Fecha de inicio</th>'+
  '  <th colspan="2">Fecha de fin</th>'+
  '  <th colspan="1">Estado</th>'+
  '  <th colspan="3">'+typ+'</th>'+
  '  <th colspan="1">opciones</th>'+
  '</tr></thead>'+
  '<tbody>';
  if($.isEmptyObject(json) || json['solicitante'][0]['ordenes__nofolio'] == null)
  {
    html+='<tr><td class="collapsing"></td><td></td><td></td><td></td><td></td></tr>'
      html +=
'  </tbody>'+
'</table>';
    return html
  }
  json['solicitante'].forEach(function(element) {
      var solicitante = (type === "Doc") ? element['tecnico'][0] : element['docente'][0]
      // alert(solicitante)
      var estado = ""
      var clase = ""
      switch(element['ordenes__estado'])
      {
          case -1: estado = "Sin asignar"; clase = "negative";
              break;
          case 0: estado = "Asignado, en espera de ser resuelto."; clase = "warning";
              break;
          case 1: estado = "Resuelto"; clase = "positive";
              break;
          default:
      }
      var emp = (solicitante!==undefined) ? 'Id Empleado: '+solicitante["pk"]+', Nombre: '+solicitante["nombre"]+' '+solicitante["ap"]+' '+solicitante["am"] : "Sin asignar"
      html +='<tr class="'+clase+'"><td colspan="1" class="collapsing"><i class="user icon"></i>'+
        element['ordenes__nofolio']+
        '</td><td colspan="2">'+element['ordenes__start']+'</td>'+
        '</td><td colspan="2">'+((element['ordenes__end']!=null) ? element['ordenes__end'] : "Pendiente")+'</td>'+
        '</td><td colspan="1">'+estado+'</td>'+
        // '</td><td colspan="1"><center><img style="width: 10%; height:10%;" src="{% static 'tt/img/red.png' %}"/></center></td>'+
        '</td><td colspan="3">'+emp+'</td>'+
      '<td><center><button class="ui positive button" id="'+(element['ordenes__nofolio']+"ver").replace(/\s+/g, '')+'">Ver</button></center></td></tr>';

    });

    html +=
        '  </tbody>' +
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

function showOrderInfo(id,estado)
{
    $("#contenido").empty()
    // sessionStorage.setItem("menuItem", "ORDENINFO");
    $.ajax({
            url : "{% url "tt:getOrder" %}",
            data : {"idOrden":id},
            dataType : 'json',
            success : function(data) {
                console.log(data);
                $("#contenido").append(createorderinfotable(data))
                if(tipouser === "Tecnico" && estado === 0)
                {
                    $("#divbuttonfinishorder").show()

                    $("#divbuttonfinishorder").on('click',function(){
                         $.ajax({
                            url : "{% url "tt:finishOrder" %}",
                            data : {"idOrden":id,"msg":$.trim($("#textareacommenttec").val())},
                            dataType : 'json',
                            success : function(data) {
                                console.log(data);
                                if(data.code == 1)
                                {
                                    Lobibox.notify('success', {
                                    size: 'mini',
                                    rounded: true,
                                    delayIndicator: true,
                                    icon: true,
                                    title:"<center>Orden finalizada</center>",
                                    iconSource:"fontAwesome",
                                    sound:false,
                                    msg: "Orden finalizada con exito"
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
                                    title:"<center>Error al finalizar la orden</center>",
                                    iconSource:"fontAwesome",
                                    sound:false,
                                    msg: "No se pudo finalizar la orden, intenta de nuevo más tarde"
                                    });
                                }

                            },
                            error : function(xhr, status) {
                                console.log("error ");
                            },
                        });
                    })
                }

                $("#divorderinfo").fadeIn('slow')
            },
            error : function(xhr, status) {
                console.log("error ");
            },
        });

}

function createorderinfotable(json) {
    var clasestate = ""
    var clasemsg = ""
    if(json['orden'][0]['estado'] == -1)
    {
        clasestate = "negative"
        clasemsg = "En espera de ser asignada a un técnico"
    }
    else if(json['orden'][0]['estado'] == 0)
    {
        clasestate = "warning"
        clasemsg = "Asignada, en espera de ser resuelta"
    }
    else
    {
        clasestate = "positive"
        clasemsg = "Orden finalizada"
    }
    html = '<div class="ui sixteen wide column" id="divorderinfo" style="display: none;">\n' +
        '        <center>\n' +
        '            <div class="ui icon header">\n' +
        '                <i class="clipboard outline icon"></i>\n' +
        '                Detalles de la orden No. Folio : '+json['orden'][0]['pk']+'\n' +
        '            </div>\n' +
        '        </center>\n' +
        '        <div class="ui segments">\n' +
        '            <div class="ui segment">\n' +
        '                <h3>Datos generales</h3>\n' +
        '            </div>\n' +
        '            <div class="ui segments">\n' +
        '                <div class="ui segment">\n' +
        '                    <p><i class="user outline icon"></i>Solicitante : '+json['empleados'][0]['nombre']+' '+json['empleados'][0]['ap']+' '+json['empleados'][0]['am']+'</p>\n' +
        '                </div>\n' +
        '                <div class="ui segment">\n' +
        '                     <p><i class="user icon"></i>Técnico asignado : '+((json['empleados'].length>1) ? json['empleados'][1]['nombre']+' '+json['empleados'][1]['ap']+' '+json['empleados'][1]['am'] : "Sin técnico asignado")+'</p>\n' +
        '                </div>\n' +
        '                <div class="ui segment">\n' +
        '                   <p><i class="laptop icon"></i>Equipo : '+((json['orden'][0]['equipo__ns'] != null) ? "Tipo : "+json['orden'][0]['equipo__tipo_equipo__nombre']+", Identificador: "+json['orden'][0]['equipo__ns'] : "Tipo : "+json['orden'][0]['equipo__tipo_equipo__nombre']+", Identificador: "+json['orden'][0]['equipo__cambs'])+'</p>\n' +
        '                </div>\n' +
        '                <div class="ui segment">\n' +
        '                   <p><i class="gavel icon"></i>Tipo de trabajo : '+json['orden'][0]['trabajo__nombre']+'</p>\n' +
        '                </div>\n' +
        '                <div class="ui attached '+clasestate+' message ">\n' +
        '                <p><i class="check circle icon"></i>Estado : '+clasemsg+'</p>\n' +
        '            </div>\n' +
        '            </div>\n' +
        '            <div class="ui segment">\n' +
        '                <h3>Fecha de la orden</h3>\n' +
        '            </div>\n' +
        '            <div class="ui horizontal segments">\n' +
        '                <div class="ui segment">\n' +
        '                    <p><i class="calendar alternate outline icon"></i>Fecha de inicio : '+json['orden'][0]['start']+'</p>\n' +
        '                </div>\n' +
        '                <div class="ui segment">\n' +
        '                    <p><i class="calendar alternate icon"></i>Fecha de fin : '+((json['orden'][0]['end'] != null) ? json['orden'][0]['end'] : "Orden no finalizada") +'</p>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '            <div class="ui segment">\n' +
        '                <h3>Detalles de la orden</h3>\n' +
        '            </div>\n' +
        '            <div class="ui horizontal segments">\n' +
        '                <div class="ui segment">\n' +
        '                    <p><i class="building outline icon"></i>Departamento : '+json['orden'][0]['depto__nombre']+", Edificio: "+json['orden'][0]['depto__ubicacion__edificio']+", Piso: "+json['orden'][0]['depto__ubicacion__piso']+", Sala: "+json['orden'][0]['depto__ubicacion__sala']+'</p>\n' +
        '                </div>\n' +
        '                <div class="ui segment">\n' +
        '                    <p><i class="building icon"></i>Subdepartamento : '+((json['orden'][0]['subdepto__nombre']!=null) ? json['orden'][0]['subdepto__nombre']+", Edificio: "+json['orden'][0]['subdepto__ubicacion__edificio']+", Piso: "+json['orden'][0]['subdepto__ubicacion__piso']+", Sala: "+json['orden'][0]['subdepto__ubicacion__sala'] : "Sin subdepartamento")+'</p>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '            <div class="ui segment " id="divincidence">\n' +
        '                <p><i class="exclamation triangle icon"></i>Incidencia : '+((json['orden'][0]['incidencia__tipoincidencia'] != null) ? json['orden'][0]['incidencia__tipoincidencia'] : "Sin incidencia")+'</p>\n' +
        '            </div>\n' +
        '            <div class="ui segment" id="divdetailinstalation" style="display: none;">\n' +
        '                <h3>Detalles de instalación</h3>\n' +
        '            </div>\n' +
        '            <div class="ui segment" id="divtableinstalation" style="display: none;">\n' +
        '                <div class="ui relaxed divided list" id="instalationcontent">\n' +
        '                    <div class="item">\n' +
        '                        <div class="content">\n' +
        '                            <a class="header">Google Chrome</a>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '            <div class="ui segment">\n' +
        '                <h3>Comentarios</h3>\n' +
        '            </div>\n' +
        '            <div class="ui horizontal segments">\n' +
        '                <div class="ui segment">\n' +
        '                    <p>Comentarios del solicitante</p>\n' +
        '                    <textarea style="width: 75%;" readonly>'+json['desc'].find(function(element){return element['who'] === 0})['descripcion']+'</textarea>\n' +
        '                </div>\n' +
        '                <div class="ui segment">\n' +
        '                    <p>Comentarios del técnico</p>\n' +
        '                    <textarea style="width: 75%;" id="textareacommenttec">'+((json['desc'].find(function(element){return element['who'] === 1}) !== undefined) ? json['desc'].find(function(element){return element['who'] === 1})['descripcion'] : "")+'</textarea>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '            <div class="ui clearing segment" id="divbuttonfinishorder" style="display: none;">\n' +
        '                <button class="ui inverted right floated blue button">Finalizar orden</button>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </div>'

    return html
}

function showOrderForm()
{
    $("#contenido").empty()
    sessionStorage.setItem("menuItem", "ORDENDOCENTE");
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




                var newOptions = {};
                var index = 0;
                data['equipo'].forEach(function(element){

                newOptions[(index++).toString()] = "Tipo de equipo: "+element['tipo_equipo__nombre']+", Identificador: "+((element['ns']!= null) ? element['ns'] : element['cambs'])

                })

                var $el = $("#id_equipo");
                $el.empty();
                $.each(newOptions, function(key,value) {
                  $el.append($("<option></option>")
                     .attr("value", value).text(value));
                });

                $("form#OrdenForm").submit(function(e){
                    e.preventDefault();
                    var formData = new FormData(this);

                    $("form#OrdenForm").addClass( "loading" )
                    $("#badregorden").hide();
                    $("#okregorden").hide();

                    $.ajax({
                    url: "{% url 'tt:AddOrder' %}",
                    type: 'POST',
                    data: formData,
                    success: function (data) {
                    console.log(data.code)
                    $("form#OrdenForm").removeClass( "loading" )
                    if(data.code == 0)
                    {
                        $("#registererrororden").text("Error, intenta más tarde.")
                        $("#badregorden").fadeIn("slow");
                    }
                    else if(data.code == 2)
                    {
                        $("#registererrororden").text("Esta orden ya se encuentra registrada en el sistema")
                        $("#badregorden").fadeIn("slow");
                    }
                    else if(data.code == 3)
                    {
                        $("#registererrororden").text("Este equipo ya se encuentra asignado a una orden, espera a que finalice para asignarle otra.")
                        $("#badregorden").fadeIn("slow");
                    }
                    else
                        {
                            $("#okregmsgorden").text("Orden registrada exitosamente")
                            $("#okregorden").fadeIn("slow");
                            setTimeout(function(){location.reload();},2500)
                        }
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                    });


                });
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
 // if (/^([a-zA-Z0-9]+)([\.{1}])?([a-zA-Z0-9]+)\@([a-zA-Z0-9]*)ipn([\.])mx/g.test(url))
 //     return true;

 return url.endsWith("ipn.mx");

}