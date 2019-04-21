{% load static %}
var update = false
var idDepartamento = -1
var deptoName = ""
var equipoName = ""
var formorder = ""
var tipouser = ""
var surveys = []
var indexsurvey = 0
var surveylength = 0
var jsonsurvey = {}
var jsonorder = {}
var typeordergraph = ""

function showRegisterModal()
{
    $("#headerFormReg").text("Registrate")
    $("#typetec").hide()
    update = false
    $("#btnRegistrar").val("Registrar")
    $("#badreg").hide()
    $("#okreg").hide()
    $("#btncloseregmod").show()
    $('#id_idEmpleado').attr('readonly', false);
//    $("#department").show()
    $('#regform').modal({
                    selector    : {
                    close    : '.close, #btncloseregmod'
                }}).modal('show')
    $("#deptochoices").show()
    $("#taobs").hide()
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

function showSurvey()
{

    console.log("Index "+indexsurvey+" -> limit "+surveylength)
    if(!surveys.includes(indexsurvey) && indexsurvey<surveylength)
    {
        surveys.push(indexsurvey)
        // console.log("EN IF")
        $("#SurveyForm").trigger("reset")
        $("#SurveyMod").modal({
            closable: false,
            selector    : {
                    close    : '.close, #btnclosesurveymod'
                }
        }).modal('show')
        $("#pOrdenFolio").text("Tu Orden con No. Folio :"+jsonsurvey[indexsurvey]['pk'])

    }
    else
        return
}

$("form#SurveyForm").submit(function(e) {
            e.preventDefault();
            var formData = new FormData(this);
            formData.append('idOrder', jsonsurvey[indexsurvey]['pk'])
            $.ajax({
                url: "{% url 'tt:sendSurvey' %}",
                type: 'POST',
                data: formData,
                success: function (data) {
                console.log(data.code)
                if(data.code === 1)
                {

                    $('#btnclosesurveymod' ).click()
                    indexsurvey++
                    showSurvey()
                }
                else if(data.code === 2)
                {
                        Lobibox.notify('error', {
                            size: 'mini',
                            rounded: true,
                            delayIndicator: true,
                            icon: true,
                            title:"<center>ERROR AL ENVIAR LA ENCUESTA</center>",
                            iconSource:"fontAwesome",
                            sound:false,
                            msg: "No se pudo enviar la encuesta"
                        });
                }
                else
                {
                    Lobibox.notify('error', {
                            size: 'mini',
                            rounded: true,
                            delayIndicator: true,
                            icon: true,
                            title:"<center>ERROR AL ENVIAR LA ENCUESTA</center>",
                            iconSource:"fontAwesome",
                            sound:false,
                            msg: "No se pudo enviar la encuesta"
                        });
                }
                },
                cache: false,
                contentType: false,
                processData: false
            });

        })

$(document).ready(function()
{

    formorder = $("#divformorder").html()
    $("#contenido").empty()
    $('.ui.checkbox')
    .checkbox()
    .checkbox({
        onChecked: function () {
            showPass()
        },
        onUnchecked: function () {
            showPass()
        }
    })


{% if ordenes %}

    console.log(JSON.parse("{{ ordenes }}".split("&#39;").join('"')))

    var json = JSON.parse("{{ ordenes }}".split("&#39;").join('"'))
    surveys = []
    indexsurvey = 0
    surveylength = json.length
    jsonsurvey = json
    showSurvey()

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
        else if(sessionStorage.getItem("menuItem") === "GRAPHADMIN")
            showGraph()
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
        else if(sessionStorage.getItem("menuItem") === "PERFDOC")
            showPerfil()

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
    console.log(data)
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

            if(data.ordenes.length > 0)
            {
                surveys = []
                indexsurvey = 0
                surveylength = data.ordenes.length
                jsonsurvey = data.ordenes
                showSurvey()
            }
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
                $("#id_observaciones").val(element['fields']['observaciones'])
                  $("#deptochoices").hide()
                  $("#taobs").show()
                $('#regform').modal({
                    selector    : {
                    close    : '.close, #btncloseregmod'
                }}).modal('show')
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
            $('#regform').modal({
                    selector    : {
                    close    : '.close, #btncloseregmod'
                }}).modal('show')
            $("#deptochoices").hide()
            $("#taobs").show()
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

                $('#DepartmentMod').modal({
                    selector    : {
                    close    : '.close, #btnclosedepartmentmod'
                }}).modal('show')
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
            $('#DepartmentMod').modal({
                    selector    : {
                    close    : '.close, #btnclosedepartmentmod'
                }}).modal('show')
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



                $('#EquipoMod').modal({
                    selector    : {
                    close    : '.close, #btncloseequipomod'
                }}).modal('show')
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
            $('#EquipoMod').modal({
                    selector    : {
                    close    : '.close, #btncloseequipomod'
                }}).modal('show')
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
    '  <th colspan="2">Equipo asignado</th>'+
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
          ((element['estado']) ? "En mantenimiento" : "Buen Estado")+'</td>'+
          '<td colspan="2"><center>'+
          ((element['empleado__nombre'] === null) ? "NO" : "SI")+'</center></td>'
        html+='<td colspan="1" class="right aligned collapsing"><div class="ui buttons"><button class="ui negative button" id="'+(element['pk']+id+"delete").replace(/\s+/g, '')+'">Borrar</button>'+
          '<div class="or" data-text="o"></div>'+
          '<button class="ui positive button" id="'+(element['pk']+id+"update").replace(/\s+/g, '')+'">Editar</button></div></td></tr>';
    });

  html +='<tfoot class="full-width">'+
    '<tr>'+

      '<th colspan="9">'+
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
            $('#EquipoMod').modal({
                    selector    : {
                    close    : '.close, #btncloseequipomod'
                }}).modal('show')
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
        '\n' ;
    if(json['empleado__pk'] === null)
        html+= '<p style="opacity: 0.5;"><i class="user icon"></i>&nbsp;Equipo perteneciente a : </p><p id="equipdatauser">Equipo sin asignar</p>\n'
    else
        html+=
        '                <p style="opacity: 0.5;"><i class="user icon"></i>&nbsp;Equipo perteneciente a : </p><p id="equipdatauser">Id Empleado: '+json['empleado__pk']+', Nombre del empleado: '+json['empleado__nombre']+'</p>\n'
    html+=
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


              $(("#"+(element['pk']+element['fields']['nombre']+"details")).replace(/\s+/g, '')).on('click',function()
              {

                  $.ajax({
                    url: "{% url 'tt:getUserInfoById' %}",
                    type: 'GET',
                    data: {'pk':element['pk']},
                    success: function (data) {
                        console.log(data)
                        $("#contenido").empty()
                      $("#contenido").append(showDocInfo(data))
                      $("#detailDoc").fadeIn('slow')
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

      if(element['fields']['estado'] === false)
      {
          html+='<td colspan="1" class="right aligned collapsing"><center><div class="ui buttons"><button class="ui negative button" id="'+(element['pk']+element['fields']['nombre']+"invalidate").replace(/\s+/g, '')+'">Invalidar</button>'+
          '<div class="or" data-text="o"></div>'+
          '<button class="ui orange button" id="'+(element['pk']+element['fields']['nombre']+"details").replace(/\s+/g, '')+'">Ver detalles</button>' +
           '<div class="or" data-text="o"></div>'+
          '<button class="ui positive button" id="'+(element['pk']+element['fields']['nombre']+"validate").replace(/\s+/g, '')+'">Validar</button>' +
          '</div></center></td></tr>';
      }
      else
      {
          html+='<td colspan="1" class="right aligned collapsing"><center>' +
              '<button class="ui orange button" id="'+(element['pk']+element['fields']['nombre']+"details").replace(/\s+/g, '')+'">Ver detalles</button></center></td></tr>';
      }

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



            $(".ui.dropdown.technique").dropdown()

            $(("#"+(element['nofolio']+"asignar")).replace(/\s+/g, '')).on('click',function(){

                $('#OrdenMod').modal({
                    selector    : {
                    close    : '.close, #btncloseordenmod'
                }}).modal('show')

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
          html+='<td colspan="1" class="right aligned collapsing"><div class="ui buttons">' +
          // '<button class="ui negative button" id="'+(element['nofolio']+"cancelar").replace(/\s+/g, '')+'">Borrar</button>'+
          // '<div class="or" data-text="o"></div>'+
          '<button class="ui orange button" id="'+(element['nofolio']+"asignar").replace(/\s+/g, '')+'">Asignar</button>'+
           '<div class="or" data-text="o"></div>'+
          '<button class="ui positive button" id="'+(element['nofolio']+"ver").replace(/\s+/g, '')+'">Ver Detalles</button></div></td></tr>';
      }
      else if(element['estado']==0)
      {
          html+='<td colspan="1" class="right aligned collapsing"><center><div class="ui buttons">' +
          // '<button class="ui negative button" id="'+(element['nofolio']+"cancelar").replace(/\s+/g, '')+'">Borrar</button>'+
          // '<div class="or" data-text="o"></div>'+
          '<button class="ui positive button" id="'+(element['nofolio']+"ver").replace(/\s+/g, '')+'">Ver Detalles</button></center></div></td></tr>';
      }
      else {

          html+='<td colspan="1" class="right aligned collapsing"><div class="ui buttons">' +
          // '<button class="ui negative button" id="'+(element['nofolio']+"cancelar").replace(/\s+/g, '')+'">Borrar</button>'+
          // '<div class="or" data-text="o"></div>'+
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

                $('#DepartmentMod').modal({
                    selector    : {
                    close    : '.close, #btnclosedepartmentmod'
                }}).modal('show')
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
            $('#DepartmentMod').modal({
                    selector    : {
                    close    : '.close, #btnclosedepartmentmod'
                }}).modal('show')
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

function showGraph()
{
    $("#contenido").empty()
    sessionStorage.setItem("menuItem", "GRAPHADMIN");
    $.ajax({
            url : "{% url "tt:ShowGraph" %}",
            data : {},
            dataType : 'json',
            success : function(data) {

                var json = JSON.parse(data)
                console.log(json);
                $("#contenido").append('<div class="ui fifteen wide column" style="display: none;" id="graphcontainer"> ' +
                    '<div class="row"><div class="ui clearing segment"> ' +
                    '<div class="ui right floated teal buttons">\n' +
                    '  <div class="ui right floated button">Tipo de gráfica</div>\n' +
                    '  <div class="ui right floated dropdown graphs icon button">\n' +
                    '    <i class="dropdown icon"></i>\n' +
                    '    <div class="menu">\n' +
                    '      <div class="item active"><i class="pencil alternate icon"></i>Satisfacción</div>\n' +
                    '      <div class="item"><i class="fas fa-file-invoice"></i> Ordenes</div>\n' +
                    '    </div>\n' +
                    '  </div>\n' +
                    '</div>' +
                    '<div class="ui left floated yellow buttons" style="display: none;" id="months">\n' +
                    '  <div class="ui right floated button">Mes</div>\n' +
                    '  <div class="ui right floated dropdown graphsmonth icon button">\n' +
                    '    <i class="dropdown icon"></i>\n' +
                    '    <div class="menu">\n' +
                    '      <div class="item active">Todos</div>\n' +
                    '      <div class="item">Enero</div>\n' +
                    '      <div class="item">Febrero</div>\n' +
                    '      <div class="item">Marzo</div>\n' +
                    '      <div class="item">Abril</div>\n' +
                    '      <div class="item">Mayo</div>\n' +
                    '      <div class="item">Junio</div>\n' +
                    '      <div class="item">Julio</div>\n' +
                    '      <div class="item">Agosto</div>\n' +
                    '      <div class="item">Septiembre</div>\n' +
                    '      <div class="item">Octubre</div>\n' +
                    '      <div class="item">Noviembre</div>\n' +
                    '      <div class="item">Diciembre</div>\n' +
                    '    </div>\n' +
                    '  </div>\n' +
                    '</div>' +
                    '<div class="ui left floated orange buttons" style="display: none; margin-left: 10px;" id="typeordergraph">\n' +
                    '  <div class="ui right floated button">Tipo de gráfica de ordenes</div>\n' +
                    '  <div class="ui right floated dropdown graphorder icon button">\n' +
                    '    <i class="dropdown icon"></i>\n' +
                    '    <div class="menu">\n' +
                    '      <div class="item active">General</div>\n' +
                    '      <div class="item">Por departamento</div>\n' +
                    '      <div class="item">Por subdepartamento</div>\n' +
                    '    </div>\n' +
                    '  </div>\n' +
                    '</div>' +
                    '</div></div>' +
                    '<div class="row"><div id="divgraph">\n' +
                    '</div></div></div>')
                $(".ui.dropdown.graphs").dropdown({
                     onChange: function(value, text, $selectedItem) {
                        if(text.endsWith("Satisfacción"))
                        {
                            $("#months").fadeOut('slow')
                            $("#typeordergraph").fadeOut('slow')
                            createSatisGraph(json)
                        }
                        else
                        {
                            $("#months").fadeIn('slow')
                            $("#typeordergraph").fadeIn('slow')
                            $.ajax({
                                url : "{% url "tt:getOrderByMonth" %}",
                                data : {'mes':"Todos"},
                                dataType : 'json',
                                success : function(data) {
                                    var json = data.ordenes
                                    console.log(json);
                                    jsonorder = json
                                    typeordergraph = "Todos"
                                    createOrderGraph(json,"Todos","General")

                                },
                                error : function(xhr, status) {
                                    console.log("error ");
                                },
                            });
                        }
                    }
                })

                $(".ui.dropdown.graphsmonth").dropdown({
                     onChange: function(value, text, $selectedItem) {
                        $.ajax({
                                url : "{% url "tt:getOrderByMonth" %}",
                                data : {'mes':text},
                                dataType : 'json',
                                success : function(data) {
                                    var json = data.ordenes
                                    jsonorder = json
                                    typeordergraph = text
                                    console.log(json);
                                    createOrderGraph(json,text,"General")
                                },
                                error : function(xhr, status) {
                                    console.log("error ");
                                },
                            });
                    }
                })

                $(".ui.dropdown.graphorder").dropdown({
                     onChange: function(value, text, $selectedItem) {
                        createOrderGraph(jsonorder,typeordergraph,text)
                    }
                })
                createSatisGraph(json)

            },
            error : function(xhr, status) {
                console.log("error ");
            },
        });
}

function createSatisGraph(json)
{
    var size = json.length
    var datos = {
        'conf' : 0,
        'resp' : 0,
        'seg' : 0,
        'infra' : 0
    }
    json.forEach(function(e){
        datos['conf'] += e.fields.confiabilidad
        datos['resp'] += e.fields.responsabilidad
        datos['seg'] += e.fields.seguridad
        datos['infra'] += e.fields.infrayservicios
    })
    var yValue = [datos['conf']/size,datos['resp']/size,datos['seg']/size,datos['infra']/size]
    var data = [
      {
        x: ['Confiabilidad', 'Responsabilidad', 'Seguridad','Infraestructura y Servicios'],
        y: yValue,
        type: 'bar',
          text: yValue.map(String),
          textposition: 'auto',
          hoverinfo: 'none',
          marker: {
            color: ['rgb(213, 172, 78,1)', 'rgba(139, 98, 32,1)', 'rgba(114, 14, 7,1)', 'rgba(69, 5, 12,1)'],
            opacity: 0.6,
            line: {
              color: 'rgb(8,48,107)',
              width: 1.5
            }
          }
      }
    ];

    var layout = {
      title: 'Gráfica de Satisfacción, #Ordenes : '+size
    };
    $("#graphcontainer").fadeIn("slow")
    Plotly.newPlot('divgraph', data,layout);
}

function createOrderGraph(json,type,typegraph)
{
    if(typegraph === "General") {
        if (type === "Todos") {
            var datos = {
                '1': 0,
                '2': 0,
                '3': 0,
                '4': 0,
                '5': 0,
                '6': 0,
                '7': 0,
                '8': 0,
                '9': 0,
                '10': 0,
                '11': 0,
                '12': 0
            }
            json.forEach(function (e) {
                switch (e.start.split("-")[1]) {
                    case "01":
                        datos['1'] += 1
                        break;
                    case "02":
                        datos['2'] += 1
                        break;
                    case "03":
                        datos['3'] += 1
                        break;
                    case "04":
                        datos['4'] += 1
                        break;
                    case "05":
                        datos['5'] += 1
                        break;
                    case "06":
                        datos['6'] += 1
                        break;
                    case "07":
                        datos['7'] += 1
                        break;
                    case "08":
                        datos['8'] += 1
                        break;
                    case "09":
                        datos['9'] += 1
                        break;
                    case "10":
                        datos['10'] += 1
                        break;
                    case "11":
                        datos['11'] += 1
                        break;
                    case "12":
                        datos['12'] += 1
                        break;
                }
            })
            var yValue = [datos['1'], datos['2'], datos['3'], datos['4'], datos['5'], datos['6'], datos['7'], datos['8'], datos['9'], datos['10'], datos['11'], datos['12']]
            var data = [
                {
                    x: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                    y: yValue,
                    type: 'bar',
                    text: yValue.map(String),
                    textposition: 'auto',
                    hoverinfo: 'none',
                    marker: {
                        color: ['rgb(255,248,182)', 'rgb(255,228,163)', 'rgb(255,189,145)', 'rgb(255,141,113),rgb(255,112,126),rgb(231,201,144),rgb(217,234,157),rgb(133,229,188),rgb(126,185,240),rgb(195,150,234),rgb(255,158,27),rgb(255,123,8)'],
                        opacity: 0.6,
                        line: {
                            color: 'rgb(8,48,107)',
                            width: 1.5
                        }
                    }
                }
            ];

            var layout = {
                title: 'Gráfica de ordenes anual #Ordenes : ' + json.length
            };
            $("#graphcontainer").fadeIn("slow")
            Plotly.newPlot('divgraph', data, layout);
        } else {
            var datos = {
                'hw': 0,
                'sw': 0
            }
            json.forEach(function (e) {
                switch (e.trabajo__nombre) {
                    case "Hardware":
                        datos['hw'] += 1
                        break;
                    case "Software":
                        datos['sw'] += 1
                        break;

                }
            })
            var yValue = [datos['hw'], datos['sw']]
            var data = [
                {
                    x: ['Hardware', 'Software'],
                    y: yValue,
                    type: 'bar',
                    text: yValue.map(String),
                    textposition: 'auto',
                    hoverinfo: 'none',
                    marker: {
                        color: ['rgb(255,248,182)', 'rgb(255,228,163)'],
                        opacity: 0.6,
                        line: {
                            color: 'rgb(8,48,107)',
                            width: 1.5
                        }
                    }
                }
            ];

            var layout = {
                title: 'Gráfica de ordenes por mes #Ordenes : ' + json.length
            };
            $("#graphcontainer").fadeIn("slow")
            Plotly.newPlot('divgraph', data, layout);
        }
    }
    else if(typegraph === "Por departamento")
    {
        var datos = {}
        var deptos = []
        json.forEach(function (e) {
            if(!(e.depto__nombre in datos))
            {
                deptos.push(e.depto__nombre)
                datos[e.depto__nombre] = 1
            }
            else
            {
                datos[e.depto__nombre] += 1
            }

        })
        var yValue = []
        for (var key in datos) {
            yValue.push(datos[key])
        }
        var data = [
            {
                x: deptos,
                y: yValue,
                type: 'bar',
                text: yValue.map(String),
                textposition: 'auto',
                hoverinfo: 'none',
                marker: {
                    color: 'rgb(255,248,182)',
                    opacity: 0.6,
                    line: {
                        color: 'rgb(8,48,107)',
                        width: 1.5
                    }
                }
            }
        ];

        var layout = {
            title: 'Gráfica de ordenes por departamento, mes : '+type+' #Ordenes : ' + json.length
        };
        $("#graphcontainer").fadeIn("slow")
        Plotly.newPlot('divgraph', data, layout);
    }
    else if(typegraph === "Por subdepartamento")
    {
        var datos = {}
        var deptos = []
        json.forEach(function (e) {

            if(!(e.subdepto__nombre in datos))
            {
                deptos.push(e.subdepto__nombre)
                datos[e.subdepto__nombre] = 1
            }
            else
            {
                datos[e.subdepto__nombre] += 1
            }

        })
        var yValue = []
        for (var key in datos) {
            yValue.push(datos[key])
        }
        var data = [
            {
                x: deptos,
                y: yValue,
                type: 'bar',
                text: yValue.map(String),
                textposition: 'auto',
                hoverinfo: 'none',
                marker: {
                    color: 'rgb(255,248,182)',
                    opacity: 0.6,
                    line: {
                        color: 'rgb(8,48,107)',
                        width: 1.5
                    }
                }
            }
        ];

        var layout = {
            title: 'Gráfica de ordenes por subdepartamento, mes : '+type+' #Ordenes : ' + json.length
        };
        $("#graphcontainer").fadeIn("slow")
        Plotly.newPlot('divgraph', data, layout);
    }

}

function showPerfil()
{
    $("#contenido").empty()
    sessionStorage.setItem("menuItem", "PERFDOC");
    $("#contenido").append('<div class="fifteen wide column" id="divformperf" style="display: none;"><form class="ui form" style="padding:15px;" id="formPerf" method="post" enctype="multipart/form-data">' +
        $("#registro").html()+
        '</form></div>')
    $("#headerFormReg").text("Datos de perfil")

    $.ajax({
        url : "{% url "tt:getUserInfo" %}",
        data : {},
        dataType : 'json',
        success : function(data) {
            console.log(data);
            $("#id_idEmpleado").val(data.data[0].pk)
            $("#id_idEmpleado").attr('readonly', true);
            $("#id_email").val(data.data[0].email)
            $("#id_contra").val(data.data[0].password)
            $("#id_telefono").val(data.data[0].numero)
            $("#id_extension").val((data.data[0].ext === null) ? "" : data.data[0].ext)
            $("#id_depto").val(data.data[0].departamento__nombre)
            $("#id_subdepto").val(data.data[0].subdepartamento__nombre)
            $("#id_nombre").val(data.data[0].nombre)
            $("#id_ap").val(data.data[0].ap)
            $("#id_am").val(data.data[0].am)
            $('.ui.checkbox')
                .checkbox()
                .checkbox({
                    onChecked: function () {
                        showPass()
                    },
                    onUnchecked: function () {
                        showPass()
                    }
                })
        },
        error : function(xhr, status) {
            console.log("error ");
        },
    });

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

    $("#btncloseregmod").hide()
    $("#btnRegistrar").val("Actualizar perfil")

    $("#divformperf").fadeIn('slow')

    $("form#formPerf").submit(function(e) {
        e.preventDefault();
        var formData = new FormData(this);
        $.ajax({
            url: "{% url 'tt:updateDoc' %}",
            type: 'POST',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                console.log(data)
                if(data.code === 0)
                {
                    Lobibox.notify('error', {
                            size: 'mini',
                            rounded: true,
                            delayIndicator: true,
                            icon: true,
                            title:"<center>Error al actualizar perfil</center>",
                            iconSource:"fontAwesome",
                            sound:false,
                            msg: "Ocurrio un error, favor de intentar más tarde"
                        });
                }
                else
                {
                    Lobibox.notify('success', {
                            size: 'mini',
                            rounded: true,
                            delayIndicator: true,
                            icon: true,
                            title:"<center>Perfil actualizado</center>",
                            iconSource:"fontAwesome",
                            sound:false,
                            msg: "Se actualizo su perfil, se cerrara sesión para aplicar los cambios, favor de iniciar sesión nuevamente."
                        });
                    setTimeout(function(){cerrarSesion()},1500)


                }
            }
        });
    })
}

function showPass()
{
    var x = document.getElementById("id_contra");
      if (x.type === "password") {
        x.type = "text";
      } else {
        x.type = "password";
      }
}

function showRecPass()
{
    $('#RecPassMod').modal({
                    selector    : {
                    close    : '.close, #btncloserecpassmod'
                }}).modal('show')
}

$("#RecupPass").on('click',function () {
    $('#formRecPass').trigger("reset");
    showRecPass()
})

$("form#formRecPass").submit(function(e) {
    e.preventDefault();
    var formData = new FormData(this);
    $.ajax({
            url: "{% url 'tt:recPass' %}",
            type: 'POST',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                console.log(data)
                if(data.code === 0)
                {
                    Lobibox.notify('error', {
                            size: 'mini',
                            rounded: true,
                            delayIndicator: true,
                            icon: true,
                            title:"<center>Error al recuperar la contraseña</center>",
                            iconSource:"fontAwesome",
                            sound:false,
                            msg: "Ocurrio un error, favor de intentar más tarde"
                        });
                }
                else
                {
                    Lobibox.notify('success', {
                            size: 'mini',
                            rounded: true,
                            delayIndicator: true,
                            icon: true,
                            title:"<center>Correo enviado</center>",
                            iconSource:"fontAwesome",
                            sound:false,
                            msg: "Se envio un correo a la dirección "+$("#id_emailrec").val()
                        });
                }
            }
        });
})

function showDocInfo(json)
{
    console.log(json)
    var html ='<div class="ui sixteen wide column" id="detailDoc" style="display: none;">\n' +
        '        <div class="ui placeholder segment">\n' +
        '            <center>\n' +
        '              <div class="ui icon header">\n' +
        '                <i class="user icon"></i>\n' +
        '                Detalles del docente : '+json.data[0].nombre+' '+json.data[0].ap+' '+json.data[0].am+'\n' +
        '              </div>\n' +
        '            </center>\n' +
        '\n' +
        '            <div class="ui segments">\n' +
        '              <div class="ui segment">\n' +
        '                <strong>Datos generales</strong>\n' +
        '              </div>\n' +
        '              <div class="ui segments">\n' +
        '                <div class="ui segment">\n' +
        '                  <p>Id Empleado : '+json.data[0].pk+'</p>\n' +
        '                </div>\n' +
        '                <div class="ui segment">\n' +
        '                  <p>Nombre : '+json.data[0].nombre+' '+json.data[0].ap+' '+json.data[0].am+'</p>\n' +
        '                </div>\n' +
        '                <div class="ui segment">\n' +
        '                  <p>Correo : '+json.data[0].email+'</p>\n' +
        '                </div>\n' +
        '\n' +
        '              </div>\n' +
        '              <div class="ui segment">\n' +
        '                <strong><i class="address card icon"></i>Datos de contacto</strong>\n' +
        '              </div>\n' +
        '              <div class="ui horizontal segments">\n' +
        '                <div class="ui segment">\n' +
        '                  <p>Teléfono : '+json.data[0].numero+'</p>\n' +
        '                </div>\n' +
        '                <div class="ui segment">\n' +
        '                  <p>Extensión : '+((json.data[0].ext === null) ? "" : json.data[0].ext)+'</p>\n' +
        '                </div>\n' +
        '              </div>\n' +
        '              <div class="ui horizontal segments">\n' +
        '                <div class="ui segment">\n' +
        '                  <p>Departamento : '+json.data[0].departamento__nombre+'</p>\n' +
        '                </div>\n' +
        '                <div class="ui segment">\n' +
        '                  <p>Subdepartamento : '+((json.data[0].subdepartamento__nombre === null) ? "" : json.data[0].subdepartamento__nombre)+'</p>\n' +
        '                </div>\n' +
        '              </div>\n' +
        '                <div class="ui segment">\n' +
        '                  <strong><i class="laptop icon"></i>Equipo</strong>\n' +
        '                </div>\n' +
        '                <div class="ui segment">\n' +
        '                    <div class="ui list">\n' ;
        json.equipo.forEach(function(element){
            html+= '                      <a class="item">\n' +
            '                        <i class="right triangle icon"></i>\n' +
            '                        <div class="content">\n' +
            '                          <div class="header">Número de serie : '+element.ns+'</div>\n' +
            '                          <div class="description">Tipo de equipo : '+element.tipo_equipo__nombre+', Modelo : '+element.modelo+'</div>\n' +
            '                        </div>\n' +
            '                      </a>\n';
        })
        html+=
        '                    </div>\n' +
        '                </div>\n' +
        '                <div class="ui segment">\n' +
        '                  <strong><i class="edit icon"></i>Ordenes</strong>\n' +
        '                </div>\n' +
        '                <div class="ui segment">\n' +
        '                    <div class="ui list">\n';
        json.data.forEach(function(element){
            if(element.ordenes__nofolio !== null) {
                var clasestate = ""
                var clasemsg = ""
                if (element.ordenes__estado == -1) {
                    clasestate = "negative"
                    clasemsg = "En espera de ser asignada a un técnico"
                } else if (element.ordenes__estado == 0) {
                    clasestate = "warning"
                    clasemsg = "Asignada, en espera de ser resuelta"
                } else {
                    clasestate = "positive"
                    clasemsg = "Orden finalizada"
                }
                html += '                      <a class="item">\n' +
                    '                        <i class="right triangle icon"></i>\n' +
                    '                        <div class="content">\n' +
                    '                          <div class="header">No. Folio : ' + element.ordenes__nofolio + '</div>\n' +
                    '                          <div class="description">Fecha de inicio : ' + element.ordenes__start + ', Fecha de fin : ' + ((element.ordenes__end === null) ? "Sin resolver" : element.ordenes__end) + '' +
                    '                           <br>Equipo : ' + element.ordenes__equipo__ns + ',Tipo de trabajo : ' + element.ordenes__trabajo__nombre + '<br>' +
                    '                <div class="ui attached ' + clasestate + ' message ">\n' +
                    '                <p><i class="check circle icon"></i>Estado : ' + clasemsg + '</p>\n' +
                    '            </div>\n' +
                    '</div>\n' +
                    '                        </div>\n' +
                    '                      </a>\n';
            }
        })
        html+='</div></div>'+
        '            </div>\n' +
        '        </div>\n' +
        '    </div>';

    return html
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