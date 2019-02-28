{% load static %}

function showRegisterModal()
{
    $('#regform')
      .modal('show')
    ;
}


$(document).ready(function()
{
{% if userName %}
    $("#username").text('{{ userName }}')
    $(".sesionforms").hide()
    $(".sesion").show()
    {% if usertype == "Administrador" %}
        $(".itemadmin").show('slow')
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

$("form#registro").submit(function(e) {
e.preventDefault();
var formData = new FormData(this);
//alert(formData.get('email'))
//alert(isIpn(formData.get('email')))
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
        $("#badreg").fadeIn("slow");
    else if(data.code == 2)
    {
        $("#registererror").text("Este correo ya se encuentra registrado en el sistema.")
        $("#badreg").fadeIn("slow");
    }
    else
        $("#okreg").fadeIn("slow");
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
    $.ajax({
    url: "{% url 'tt:ShowTecnicos' %}",
    type: 'POST',
    data: {d:""},
    success: function (data) {
    var json = JSON.parse(data)
    console.log(json)
    if(!$.isEmptyObject(json))
    {
        $("#contenido").append(createTecTable(json))
        $("#tablatecnico").fadeIn('slow')
    }
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

  json.forEach(function(element) {
      html +='<tr><td class="collapsing"><i class="user icon"></i>'+
        element['fields']['nombre']+' '+element['fields']['ap']+' '+element['fields']['am']+
        '</td><td>'+element['fields']['email']+'</td>';
        html+='<td class="right aligned collapsing"><div class="ui buttons"><button class="ui negative button">Borrar</button>'+
          '<div class="or" data-text="o"></div>'+
          '<button class="ui positive button" onclick="sendalert(\''+element['fields']['nombre']+','+element['fields']['ap']+','+element['fields']['am']+','+element['fields']['email']+','+element['fields']['password']+'\')">Editar</button></div></td></tr>';
    });

  html +='<tfoot class="full-width">'+
    '<tr>'+
      '<th></th>'+
      '<th colspan="4">'+
      '  <div class="ui right floated small primary labeled icon button">'+
     '     <i class="user icon"></i> Agregar Tecnico'+
    '    </div>'+
   '   </th>'+
  '  </tr>'+
 ' </tfoot>'+
'  </tbody>'+
'</table>';

return html;

}

function sendalert(data)
{
    console.log(data)
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