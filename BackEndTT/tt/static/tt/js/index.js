{% load static %}
{% load app_filters %}
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
var slideIndex = 0;
var jsonuserfilter = {}
var jsonstatusfilter = {}

function showImages(el) {
        var windowHeight = jQuery( window ).height();
        $(el).each(function(){
            var thisPos = $(this).offset().top;

            var topOfWindow = $(window).scrollTop();
            if (topOfWindow + windowHeight - 200 > thisPos ) {
                $(this).addClass("fadeIn");
            }
        });
    }

    // if the image in the window of browser when scrolling the page, show that image
    $(window).scroll(function() {
            showImages('.star');
    });

function showRegisterModal()
{
    $("#headerFormReg").text("Registrate")
    $("#typetec").hide()
    update = false
    $("#btnRegistrar").val("Registrar")
    $("#badreg").hide()
    $("#okreg").hide()
    $("#btncloseregmod").show()
    $("#divterms").show()
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
                // var json = data
                console.log(data.subdepto)
                var newOptions = {};
                var index = 0;
                data.subdepto.forEach(function(element){
                   newOptions[(index++).toString()] = element['nombre']+", Edificio: "+element['ubicacion__edificio']+" Piso: "+element['ubicacion__piso']+" Sala: "+element['ubicacion__sala']
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
                // var json = JSON.parse(data)
                var newOptions = {};
                var index = 0;
                data.subdepto.forEach(function(element){
                   newOptions[(index++).toString()] = element['nombre']+", Edificio: "+element['ubicacion__edificio']+" Piso: "+element['ubicacion__piso']+" Sala: "+element['ubicacion__sala']
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
                    Lobibox.notify('success', {
                            size: 'mini',
                            rounded: true,
                            delayIndicator: true,
                            icon: true,
                            title:"<center>ENCUESTA FINALIZADA</center>",
                            iconSource:"fontAwesome",
                            sound:false,
                            msg: "Se ha enviado la encuesta, gracias por evaluar el servicio."
                        });
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

function home(){
    sessionStorage.setItem("menuItem", "");
    window.location.href = "{% url 'tt:Index'%}";
}

function showSlides() {
      var i;
      var slides = document.getElementsByClassName("mySlides");
      var x = window.matchMedia("(max-width: 600px)")
        if(!x.matches)
        {
            $(".textcap").attr('class', '');
          $("#cap1").addClass('textcap transition hidden')
          $("#cap2").addClass('textcap transition hidden')
          $("#cap3").addClass('textcap transition hidden')
        }

      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
      }
      slideIndex++;
      if (slideIndex > slides.length) {slideIndex = 1}
      slides[slideIndex-1].style.display = "block";
      if ($('.textcap').hasClass('hidden') && !x.matches) {
            $('.textcap').transition({
            animation : 'fade right',
            duration  : 1000,
            interval  : 200
          })
        }


      setTimeout(showSlides, 5000); // Change image every 5 seconds
    }

$(document).ready(function()
{

    formorder = $("#divformorder").html()
    $("#contenido").empty()
    if(sessionStorage.getItem("menuItem") === "" || sessionStorage.getItem("menuItem") === null)
    {
        var html = '<div class="twelve column centered row"><div class="twelve wide column"><div class="slideshow-container" style="display: none;" >\n' +
            '\n' +
            '      <!-- Full-width images with number and caption text -->\n' +
            '      <div class="mySlides fade">\n' +
            // '        <div class="numbertext">1 / 3</div>\n' +
            '        <div class="textup">Unidad Informática de la ESCOM</div>\n' +
            '        <img src="{% static 'tt/img/fondos/slider1.jpg' %}" style="width:100%">\n' +
            '        <div class="textcap transition hidden" id="cap1"><div class="borderred">Sistematizar el procedimiento de atención a solicitudes de servicio que se brindan por la Unidad de Informática a los equipos otorgados por la Escuela Superior de Cómputo, con un control de la información asociada a los reportes tal como inventario, departamentos, servicios y los involucrados en el proceso, mediante una herramienta conjunta de apoyo que otorgue un mejor tratamiento a la gestión de solicitudes de servicio que esta atiende, con el fin de mejorar la calidad del servicio.</div></div>\n' +
            '      </div>\n' +
            '\n' +
            '      <div class="mySlides fade">\n' +
            // '        <div class="numbertext">2 / 3</div>\n' +
            '        <div class="textup">Unidad Informática de la ESCOM</div>\n' +
            '        <img src="{% static 'tt/img/fondos/slider2.jpg' %}" style="width:100%">\n' +
            '        <div class="textcap transition hidden" id="cap2"><div class="borderred">Sistematizar el procedimiento de atención a solicitudes de servicio que se brindan por la Unidad de Informática a los equipos otorgados por la Escuela Superior de Cómputo, con un control de la información asociada a los reportes tal como inventario, departamentos, servicios y los involucrados en el proceso, mediante una herramienta conjunta de apoyo que otorgue un mejor tratamiento a la gestión de solicitudes de servicio que esta atiende, con el fin de mejorar la calidad del servicio.</div></div>\n' +
            '      </div>\n' +
            '\n' +
            '      <div class="mySlides fade">\n' +
            // '        <div class="numbertext">3 / 3</div>\n' +
            '        <div class="textup">Unidad Informática de la ESCOM</div>\n' +
            '        <img src="{% static 'tt/img/fondos/slider3.jpg' %}" style="width:100%">\n' +
            '        <div class="textcap transition hidden" id="cap3"><div class="borderred">Sistematizar el procedimiento de atención a solicitudes de servicio que se brindan por la Unidad de Informática a los equipos otorgados por la Escuela Superior de Cómputo, con un control de la información asociada a los reportes tal como inventario, departamentos, servicios y los involucrados en el proceso, mediante una herramienta conjunta de apoyo que otorgue un mejor tratamiento a la gestión de solicitudes de servicio que esta atiende, con el fin de mejorar la calidad del servicio.</div></div>\n' +
            '      </div>\n' +
            '\n' +
            '    </div></div></div>';
        html += '<div class="fourteen column centered row star"><div class="fourteen wide column"> <p style="text-align: justify">La Unidad de Informática es un área de la Escuela Superior de Cómputo dependiente de la Dirección de Cómputo y Comunicaciones, es\n' +
            'responsable de planear, regular, coordinar y evaluar las acciones para garantizar la disponibilidad, operación, confiabilidad y seguridad de\n' +
            'los servicios informáticos y de telecomunicaciones, con el propósito de contribuir a la transformación y el mejor desarrollo de las funciones\n' +
            'sustantivas, de apoyo, administrativas y académicas de la Escuela Superior de Cómputo.\n</p></div></div>'

        html+='<div class="fourteen column centered row"><div class="fourteen wide column">' +
            '<img class="star" src="{% static 'tt/img/mesa.png' %}">' +
        '</div></div>'
        $("#contenido").append(html)
        $(".slideshow-container").fadeIn('slow')

        showSlides();

        showImages('.star');
    }

    // else
    //     $("#contenido").empty()
    $('.ui.checkbox').checkbox()
    $('.ui.checkbox.showpass')
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
    {% if usertype|isDoc %}

        surveys = []
        indexsurvey = 0
        surveylength = json.length
        jsonsurvey = json
        showSurvey()
    {% elif usertype|isTec %}
        $("#tecitem").append('&nbsp;&nbsp;<i class="exclamation circle icon"></i>')
    {% endif %}



{% endif%}

{% if userName %}
    $("#username").text('{{ userName }}')
    tipouser = "{{ usertype }}"
    $(".sesionforms").hide()
    $(".sesion").show()
    {% if usertype == "Administrador" %}
        $(".itemadmin").show('slow')
        $("#floatmenu").show('slow')
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
        else if(sessionStorage.getItem("menuItem") === "SOFTWARE")
            showSoftware()
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
        else if(sessionStorage.getItem("menuItem") === "EQUIPO")
            showEquipment()
    {% endif %}
{% else %}
    $(".slideshow-container").fadeIn('slow')
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

$("form#formSoftware").submit(function(e){
    e.preventDefault();
    var formData = new FormData(this);
    if(!update)
    {
        formData.append('option', 'create')
        $("form#formSoftware").addClass( "loading" )
        $("#badregsoft").hide();
        $("#okregsoft").hide();

        $.ajax({
        url: "{% url 'tt:AddSoftware' %}",
        type: 'POST',
        data: formData,
        success: function (data) {
        console.log(data.code)
        $("form#formSoftware").removeClass( "loading" )
        if(data.code == 0)
        {
            $("#registererrorsoft").text("Error, intenta más tarde.")
            $("#badregsoft").fadeIn("slow");
        }
        else if(data.code == 2)
        {
            $("#registererrorsoft").text("El software ya se encuentra registrado en el sistema")
            $("#badregsoft").fadeIn("slow");
        }
        else
            {
                $("#okregmsgsoft").text("Software registrado exitosamente")
                $("#okregsoft").fadeIn("slow");
                setTimeout(function(){location.reload();},2500)
            }
        },
        cache: false,
        contentType: false,
        processData: false
        });
    }
    else {
        formData.append('option', 'update')
        $("form#formSoftware").addClass( "loading" )
        $("#badregsoft").hide();
        $("#okregsoft").hide();

        $.ajax({
        url: "{% url 'tt:AddSoftware' %}",
        type: 'POST',
        data: formData,
        success: function (data) {
        console.log(data.code)
        $("form#formSoftware").removeClass( "loading" )
        if(data.code == 0)
        {
            $("#registererrorsoft").text("Error, intenta más tarde.")
            $("#badregsoft").fadeIn("slow");
        }
        else
            {
                $("#okregmsgsoft").text("Software actualizado exitosamente")
                $("#okregsoft").fadeIn("slow");
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
    if($("#id_terms").is(':checked'))
    {
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
                $("#registererror").text("Este correo o No. de empleado ya se encuentra registrado en el sistema.")
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
        Lobibox.notify('error', {
                            size: 'mini',
                            rounded: true,
                            delayIndicator: true,
                            icon: true,
                            title:"<center>Términos y condiciones</center>",
                            iconSource:"fontAwesome",
                            sound:false,
                            msg: "Debe aceptar los términos y condiciones de uso de datos personales para poder continuar."
                            });
    }

}
else if($("#headerFormReg").text()=="Añadir Docente")
{

    formData.append('tipoEmpleado', "DOCENTEADMIN");

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
            $("#registererror").text("Este correo o No. de empleado ya se encuentra registrado en el sistema.")
            $("#badreg").fadeIn("slow");
        }
        else
            {
                $("#okregmsg").text("Docente registrado exitosamente.")
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
else if($("#headerFormReg").text()=="Añadir Administrador")
{

    formData.append('tipoEmpleado', "ADMIN");

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
            $("#registererror").text("Este correo o No. de empleado ya se encuentra registrado en el sistema.")
            $("#badreg").fadeIn("slow");
        }
        else
            {
                $("#okregmsg").text("Administrador registrado exitosamente.")
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
            {
                $(".itemadmin").show('slow')
                $("#floatmenu").show('slow')
            }
            else if(data.usertype === "Docente")
                $(".itemdocente").show('slow')
            else if(data.usertype === "Tecnico")
                $(".itemtecnico").show('slow')
            $(".sesionforms").hide('slow')
            $(".sesion").show('slow')
            tipouser = data.usertype

            if(data.ordenes.length > 0)
            {
                if(data.usertype === "Docente")
                {
                    surveys = []
                    indexsurvey = 0
                    surveylength = data.ordenes.length
                    jsonsurvey = data.ordenes
                    showSurvey()
                }
                else if(data.usertype === "Tecnico")
                {
                    $("#tecitem").append('&nbsp;&nbsp;<i class="exclamation circle icon"></i>')
                }

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
                    msg: "Usuario o contraseña incorrectos"
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

    else if(data.logincode == -2)
        {
        Lobibox.notify('error', {
                    size: 'normal',
                    rounded: true,
                    delayIndicator: true,
                    icon: true,
                    title:"<center>USUARIO NO VALIDADO</center>",
                    iconSource:"fontAwesome",
                    sound:false,
                    msg: "Esta cuenta esta inactiva, comunicate con el administrador para activarla de nuevo."
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
            // $("#username").text("")
            // $(".itemadmin").hide('slow')
            // $(".itemdocente").hide('slow')
            // $(".itemtecnico").hide('slow')
            // $(".sesionforms").show('slow')
            // $(".sesion").hide('slow')
            // sessionStorage.setItem("menuItem","")
            // $("#contenido").empty()
            sessionStorage.setItem("menuItem", "");
            window.location.href = "{% url 'tt:Index'%}";


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
                $("#divterms").hide()
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
    // $("#addTech").on('click',function(){
    //         addTec()
    //     });
    }
});
}

function addTec(){
    $( '#floatmenu' ).click ();
    $("#floatmenu *").prop('disabled',true);
    update = false
            $("#headerFormReg").text("Añadir Técnico")
            $("#typetec").show()
            $("#badreg").hide()
            $("#okreg").hide()
            $("#divterms").hide()
            $('#id_idEmpleado').attr('readonly', false);
            $("#btnRegistrar").val("Registrar")
//            $("#department").hide()
            $('#regform').modal({
                onHidden: function(){
                    $("#floatmenu *").prop('disabled',false);
                },
                    selector    : {
                    close    : '.close, #btncloseregmod'
                }}).modal('show')
            $("#deptochoices").hide()
            $("#taobs").show()
            $('#registro').trigger("reset");
}

function createTecTable(json)
{
    var html ='<table id="tablatecnico" style="display:none;" class="ui red celled table">'+
  '<thead>'+
  '  <tr><th><center>Técnico</center></th>'+
  '  <th><center>Correo</center></th>'+
  '  <th><center>Opciones</center></th>'+
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

  html +='' +
 //      '<tfoot class="full-width">'+
 //    '<tr>'+
 //      '<th></th>'+
 //      '<th colspan="4">'+
 //      '  <div class="ui right floated small primary labeled icon button" id="addTech">'+
 //     '     <i class="user icon"></i> Agregar Tecnico'+
 //    '    </div>'+
 //   '   </th>'+
 //  '  </tr>'+
 // ' </tfoot>'+
'  </tbody>'+
'</table>';

return html;

}

function showSoftware()
{
    $("#contenido").empty()
    sessionStorage.setItem("menuItem", "SOFTWARE");
    $.ajax({
    url: "{% url 'tt:ShowSoftware' %}",
    type: 'POST',
    data: {d:""},
    success: function (data) {
    var json = JSON.parse(data)
    console.log(json)
    $("#contenido").append(createSoftwareTable(json))
    $("#tablasoftware").fadeIn('slow')
    if(!$.isEmptyObject(json))
    {

        json.forEach(function(element) {

              $(("#"+(element['fields']['nombre']+"update")).replace(/\s+/g, '')).on('click',function()
              {
               $("#badregsoft").hide()
                $("#okregsoft").hide()
                  $("#SoftwareHeader").text("Actualizar Software")
                  $("#btnsoftware").text("Actualizar Software")
                $('#SoftwareMod').modal({
                        selector    : {
                        close    : '.close, #btnclosesoftwaremod'
                    }}).modal('show')
                $('#formSoftware').trigger("reset");
                update = true
                $("#id_software").val(element['fields']['nombre'])
                $("#id_descripcion").val(element['fields']['descripcion']);

              });

              $(("#"+(element['fields']['nombre']+"delete")).replace(/\s+/g, '')).on('click',function()
              {
                $.ajax({
                    url : "{% url "tt:DelSoftware" %}",
                    data : {'soft':element['fields']['nombre']},
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
                                msg: "Software eliminado exitosamente"
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
                                msg: "No se pudo eliminar el software, intenta de nuevo más tarde"
                                });
                    },
                    error : function(xhr, status) {
                        console.log("error ");
                    },
                });
              });
        });


    }
    $("#addSoft").on('click',function(){
                update = false
             $("#badregsoft").hide()
            $("#okregsoft").hide()
            $("#SoftwareHeader").text("Añadir Software")
                  $("#btnsoftware").text("Añadir Software")
            $('#SoftwareMod').modal({
                    selector    : {
                    close    : '.close, #btnclosesoftwaremod'
                }}).modal('show')
            $('#formSoftware').trigger("reset");
        });
    }
});
}

function createSoftwareTable(json)
{
    var html ='<table id="tablasoftware" style="display:none;" class="ui green celled table">'+
  '<thead>'+
  '  <tr><th><center>Software</center></th>'+
  '  <th><center>Descripcion</center></th>'+
  '  <th><center>Opciones</center></th>'+
  '</tr></thead>'+
  '<tbody>';
  if($.isEmptyObject(json))
  {
    html+='<tr><td class="collapsing"></td><td></td><td></td></tr>'
  }
  json.forEach(function(element) {
      html +='<tr><td class="collapsing"><i class="user icon"></i>'+
        element['fields']['nombre']+
        '</td><td>'+element['fields']['descripcion']+'</td>';
        html+='<td class="right aligned collapsing"><div class="ui buttons"><button class="ui negative button" id="'+(element['fields']['nombre']+"delete").replace(/\s+/g, '')+'">Borrar</button>'+
          '<div class="or" data-text="o"></div>'+
          '<button class="ui positive button" id="'+(element['fields']['nombre']+"update").replace(/\s+/g, '')+'">Editar</button></div></td></tr>';
    });

  html +='' +
      '<tfoot class="full-width">'+
    '<tr>'+
      '<th></th>'+
      '<th colspan="6">'+
      '  <div class="ui right floated small primary labeled icon button" id="addSoft">'+
     '     <i class="window restore icon"></i> Agregar Software'+
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
    update = false
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
  '  <tr><th colspan="2"><center>Nombre</center></th>'+
  '  <th colspan="1"><center>Opciones</center></th>'+
  '</tr></thead>'+
  '<tbody>';
  if($.isEmptyObject(json))
  {
    html+='<tr><td class="collapsing"></td><td></td><td></td></tr>'
  }
  json.forEach(function(element) {
      html +='<tr><td colspan="2" class="collapsing" style="cursor: pointer;" id="'+(element['pk']+element['nombre']+"infoDepto").replace(/\s+/g, '')+'"><i class="building icon"></i>'+
        element['nombre']
        html+='<td colspan="1" class="right aligned collapsing"><div class="ui buttons"><button class="ui negative button" id="'+(element['pk']+element['nombre']+"delete").replace(/\s+/g, '')+'">Borrar</button>'+
          '<div class="or" data-text="o"></div>'+
          '<button class="ui positive button" id="'+(element['pk']+element['nombre']+"update").replace(/\s+/g, '')+'">Editar</button></div></td></tr>';
    });

  html +='<tfoot class="full-width">'+
    '<tr>'+

      '<th colspan="3">'+
      '  <div class="ui right floated small primary labeled icon button" id="agregardep">'+
     '     <i class="building icon"></i> Agregar Departamento'+
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
    $.fn.search.settings.templates.message = newHeader;


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

        var content = []
        var types = []
        json.forEach(function(element){
            if(!types.includes(element['tipo_equipo__nombre']))
            {
                types.push(element['tipo_equipo__nombre'])
            }
        })

        for(t in types)
        {
            content.push({'title' : types[t]})
        }


        $('.ui.search')
          .search({
            source: content,
              onSelect: function (result,response) {
                console.log(result);
                // $("#contenido").empty()
                  var newjson = $.grep(json, function(v) {
                    return v['tipo_equipo__nombre'] === result.title;
                    });
                  // console.log(newjson)
                  var cont = createEquipmentTable(newjson)
                  var htm = cont.substring(cont.indexOf("<tbody id=\"equipbody\">")+22,cont.indexOf("</tbody>"))
                  console.log(htm)
                  $("#equipbody").empty()
                  $("#equipbody").append(htm)
                  $("#tableequip").fadeIn('slow')
                  setClicksEquip(newjson)

            return true;
        },
              onResultsClose: function(){
                // console.log("Cerro")
                  if($("#inputSearchEquip").val() === "")
                  {
                      var cont = createEquipmentTable(json)
                      var htm = cont.substring(cont.indexOf("<tbody id=\"equipbody\">")+22,cont.indexOf("</tbody>"))
                      console.log(htm)
                      $("#equipbody").empty()
                      $("#equipbody").append(htm)
                      $("#tableequip").fadeIn('slow')
                      setClicksEquip(json)
                  }
              },
                  error: {
                    noResults: 'No se encontrarón resultados que coincidan con el criterio de búsqueda.'
                  }
          })


        setClicksEquip(json)

    }

function setClicksEquip(json)
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
                $("#id_empleados").val((element['empleado__pk']!= null) ? "No. Empleado: "+element['empleado__pk']+", Nombre: "+element['empleado__nombre'] : "Equipo Libre")
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

        update = false
        $("#EquipoHeader").text("Añadir Equipo")
            $("#badregequipo").hide()
            $("#okregequipo").hide()
            $("#EquipoBtn").val("Añadir Equipo")
            $('#EquipoMod').modal({
                    selector    : {
                    close    : '.close, #btncloseequipomod'
                }}).modal('show')
            $('#EquipoForm').trigger("reset");
        $('#id_idequipo').attr('readonly', false)
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
  '  <tr>' +
        '<th colspan="2"><center>Identificador</center></th>'+
    '  <th colspan="3"><center>Tipo de Equipo<div class="ui search">\n' +
        '  <div class="ui icon input">\n' +
        '    <input id="inputSearchEquip" class="prompt" type="text" placeholder="Filtrar por tipo">\n' +
        '    <i class="search icon"></i>\n' +
        '  </div>\n' +
        '  <div class="results"></div>\n' +
        '</div></center></th>'+
    '  <th colspan="2"><center>Estado del Equipo</center></th>'+
    '  <th colspan="1"><center>Equipo asignado</center></th>'+
    '  <th colspan="2"><center>Última modificación</center></th>'+
  '  <th colspan="1"><center>Opciones</center></th>'+
  '</tr></thead>'+
  '<tbody id="equipbody">';
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
      html +='<tr><td colspan="2" class="collapsing" style="cursor: pointer;" id="'+(element['pk']+id+"infoequipo").replace(/\s+/g, '')+'"><i class="desktop icon"></i>'+
        id+
          '<td colspan="3">'+
        element['tipo_equipo__nombre']+'</td>'+
           '<td colspan="2">'+
          ((element['estado']) ? "En mantenimiento" : "Buen Estado")+'</td>'+
          '<td colspan="1"><center>'+
          ((element['empleado__nombre'] === null) ? "NO" : "SI")+'</center></td>'+
          '<td colspan="2"><center>'+
          ((element['lastupdate'] === null) ? "Sin cambios" : element['lastupdate'])+'</center></td>'
        html+='<td colspan="1" class="center aligned collapsing"><div class="ui buttons"><button class="ui negative button" id="'+(element['pk']+id+"delete").replace(/\s+/g, '')+'">Borrar</button>'+
          '<div class="or" data-text="o"></div>'+
          '<button class="ui positive button" id="'+(element['pk']+id+"update").replace(/\s+/g, '')+'">Editar</button></div></td></tr>';
    });

  html +='</tbody><tfoot class="full-width">'+
    '<tr>'+

      '<th colspan="11">'+
      '  <div class="ui right floated small primary labeled icon button" id="agregarequipo">'+
     '     <i class="desktop icon"></i> Agregar Equipo'+
    '    </div>'+
   '   </th>'+
  '  </tr>'+
 ' </tfoot>'+
'  '+
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
  '  <tr><th colspan="2"><center>Identificador</center></th>'+
    '  <th colspan="2"><center>Tipo de Equipo</center></th>'+
    '  <th colspan="2"><center>Estado del Equipo</center></th>'+
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
        '                <p style="opacity: 0.5;"><i class="user icon"></i>&nbsp;Equipo perteneciente a : </p><p id="equipdatauser">No. Empleado: '+json['empleado__pk']+', Nombre del empleado: '+json['empleado__nombre']+'</p>\n'
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

              $(("#"+(element['pk']+element['fields']['nombre']+"desactivar")).replace(/\s+/g, '')).on('click',function()
              {
                 $.ajax({
                    url: "{% url 'tt:changeDocState' %}",
                    type: 'GET',
                    data: {'pk':element['pk'],'estado':false},
                    success: function (data) {
                        console.log(data)
                        if(data.code === 1)
                        {
                            Lobibox.notify('success', {
                                size: 'mini',
                                rounded: true,
                                delayIndicator: true,
                                icon: true,
                                title:"<center>Cuenta desactivada</center>",
                                iconSource:"fontAwesome",
                                sound:false,
                                msg: "Cuenta desactivada correctamente."
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
                                title:"<center>Error al desactivar</center>",
                                iconSource:"fontAwesome",
                                sound:false,
                                msg: "Error al desactivar cuenta."
                                });
                        }
                    }
                    });
              });

              $(("#"+(element['pk']+element['fields']['nombre']+"activar")).replace(/\s+/g, '')).on('click',function()
              {
                 $.ajax({
                    url: "{% url 'tt:changeDocState' %}",
                    type: 'GET',
                    data: {'pk':element['pk'],'estado':true},
                    success: function (data) {
                        console.log(data)
                      if(data.code === 1)
                        {
                            Lobibox.notify('success', {
                                size: 'mini',
                                rounded: true,
                                delayIndicator: true,
                                icon: true,
                                title:"<center>Cuenta activada</center>",
                                iconSource:"fontAwesome",
                                sound:false,
                                msg: "Cuenta activada correctamente."
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
                                title:"<center>Error al activar</center>",
                                iconSource:"fontAwesome",
                                sound:false,
                                msg: "Error al activar cuenta."
                                });
                        }
                    }
                    });
              });
        });


        }

        // $("#addDocAdmin").on('click',function(){
        //     addDoc()
        // });
    }
    });
}

function addDoc(){
    $( '#floatmenu' ).click ();
    $("#floatmenu *").prop('disabled',true);
    update = false
            $("#headerFormReg").text("Añadir Docente")
            $("#typetec").hide()
            $("#badreg").hide()
            $("#okreg").hide()
            $("#divterms").hide()
            $('#id_idEmpleado').attr('readonly', false);
            $("#btnRegistrar").val("Registrar")
//            $("#department").hide()
            $('#regform').modal({
                onHidden: function(){
                    $("#floatmenu *").prop('disabled',false);
                },
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
                // var json = data
                console.log(data.subdepto)
                var newOptions = {};
                var index = 0;
                data.subdepto.forEach(function(element){
                   newOptions[(index++).toString()] = element['nombre']+", Edificio: "+element['ubicacion__edificio']+" Piso: "+element['ubicacion__piso']+" Sala: "+element['ubicacion__sala']
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
                // var json = JSON.parse(data)
                var newOptions = {};
                var index = 0;
                data.subdepto.forEach(function(element){
                   newOptions[(index++).toString()] = element['nombre']+", Edificio: "+element['ubicacion__edificio']+" Piso: "+element['ubicacion__piso']+" Sala: "+element['ubicacion__sala']
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

function createRegistersTable(json)
{
    var html ='<table id="tableregisters" style="display:none;" class="ui yellow celled table">'+
  '<thead>'+
  '  <tr><th colspan="1"><center>No. Empleado</center></th>'+
  '  <th colspan="2"><center>Nombre</center></th>'+
  '  <th colspan="3"><center>Correo</center></th>'+
  '  <th colspan="1"><center>Opciones</center></th>'+
  '</tr></thead>'+
  '<tbody>';
  if($.isEmptyObject(json))
  {
    html+='<tr><td class="collapsing"></td><td></td><td></td></tr>'
  }
  json.forEach(function(element) {
      html +='<tr><td colspan="1" class="collapsing"><i class="user icon"></i>'+
        element['pk']+
        '</td><td colspan="2">'+element['fields']['nombre']+' '+element['fields']['ap']+' '+element['fields']['am']+'</td>'+
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
          if(element['fields']['adminstate'] === false)
              html+='<td colspan="1" class="right aligned collapsing"><center><div class="ui buttons"><button class="ui positive button" id="'+(element['pk']+element['fields']['nombre']+"activar").replace(/\s+/g, '')+'">Activar</button>'
        else
             html+='<td colspan="1" class="right aligned collapsing"><center><div class="ui buttons"><button class="ui negative button" id="'+(element['pk']+element['fields']['nombre']+"desactivar").replace(/\s+/g, '')+'">Desactivar</button>'

          html+= '<div class="or" data-text="o"></div>'+
           '<button class="ui orange button" id="'+(element['pk']+element['fields']['nombre']+"details").replace(/\s+/g, '')+'">Ver detalles</button>' +
          '</div></center></td></tr>';
      }

    });

  html +='' +
 //      '<tfoot class="full-width">'+
 //    '<tr>'+
 //      '<th></th>'+
 //      '<th colspan="7">'+
 //      '  <div class="ui right floated small primary labeled icon button" id="addDocAdmin">'+
 //     '     <i class="user icon"></i> Agregar Docente'+
 //    '    </div>'+
 //   '   </th>'+
 //  '  </tr>'+
 // ' </tfoot>'+
'  </tbody>'+
'</table>';

return html;

}

function showOrdersAdmin()
{
    $("#contenido").empty()
    sessionStorage.setItem("menuItem", "ORDENESADMIN");
    jsonuserfilter = {}
    jsonstatusfilter = {}
    $.ajax({
    url: "{% url 'tt:ShowOrdersAdmin' %}",
    type: 'POST',
    data: {x:""},
    success: function (data) {
        var json = data
        console.log(json)
        var d1 = Date.parse(json['date']);
        console.log("Hoy "+d1)
        $("#contenido").append(createOrdersAdminTable(json['orden'],d1))
        $.fn.search.settings.templates.message = newHeader;
        $("#tableorder").fadeIn('slow')
        if(!$.isEmptyObject(json))
        {

            var contentstate = []
            var typesstate = ["Sin asignar","Asignado, en espera de ser resuelto.","Resuelto"]
            var typesstateids = [-1,0,1]

            for(t in typesstate)
            {
                contentstate.push({'title' : typesstate[t], 'id' : typesstateids[t]})
            }


            $('.ui.search.state')
              .search({
                source: contentstate,
                  onSelect: function (result,response) {
                    console.log(result);
                    // $("#contenido").empty()
                      var newjson = $.grep(json['orden'], function(v) {
                          if($("#inputSearchNameOrder").val() === "")
                            return v['estado'] === result.id;
                          else {
                              var searchname = $("#inputSearchNameOrder").val()
                              return v['empleados'].find(function (e) {
                                  return v['estado'] === result.id && e['nombre'] === searchname.split(" ")[0] && e['ap'] === searchname.split(" ")[1] && e['am'] === searchname.split(" ")[2];
                              }) !== undefined;
                          }
                        });
                      console.log(newjson)
                      var cont = createOrdersAdminTable(newjson,d1)
                      var htm = cont.substring(cont.indexOf("<tbody id=\"tbodyorderstable\">")+29,cont.indexOf("</tbody>"))
                      console.log(htm)
                      $("#tbodyorderstable").empty()
                      $("#tbodyorderstable").append(htm)
                      $("#tableequip").fadeIn('slow')
                      setClicksOrders(newjson,json['tecnicos'])

                return true;
            },
                  onResultsClose: function(){
                    // console.log("Cerro")
                      if($("#inputSearchStateOrder").val() === "")
                      {
                          if($("#inputSearchNameOrder").val() === "")
                          {
                              var cont = createOrdersAdminTable(json['orden'],d1)
                              var htm = cont.substring(cont.indexOf("<tbody id=\"tbodyorderstable\">")+29,cont.indexOf("</tbody>"))
                              console.log(htm)
                              jsonstatusfilter = {}
                              $("#tbodyorderstable").empty()
                              $("#tbodyorderstable").append(htm)
                              $("#tableequip").fadeIn('slow')

                              setClicksOrders(json['orden'],json['tecnicos'])
                          }
                          else
                          {
                              var searchname = $("#inputSearchNameOrder").val()
                              var newjson = $.grep(json['orden'], function(v) {
                                return v['empleados'].find(function(e){
                                        return e['nombre'] === searchname.split(" ")[0] && e['ap'] === searchname.split(" ")[1] && e['am'] === searchname.split(" ")[2]
                                    }) !== undefined;
                                });
                              console.log(newjson)
                              var cont = createOrdersAdminTable(newjson,d1)
                              var htm = cont.substring(cont.indexOf("<tbody id=\"tbodyorderstable\">")+29,cont.indexOf("</tbody>"))
                              console.log(htm)
                              $("#tbodyorderstable").empty()
                              $("#tbodyorderstable").append(htm)
                              $("#tableequip").fadeIn('slow')
                              setClicksOrders(newjson,json['tecnicos'])
                          }

                      }
                  },
                  error: {
                    noResults: 'No se encontrarón resultados que coincidan con el criterio de búsqueda.'
                  }
              })




        var content = []
        var types = []
        json['orden'].forEach(function(element){
            var emp = element['empleados'].find(function(e){
                return e['tipo__nombre'] === "Docente"
            })
            if(!types.includes(emp['nombre']+" "+emp['ap']+" "+emp['am']))
            {
                types.push(emp['nombre']+" "+emp['ap']+" "+emp['am'])
            }
        })

        for(t in types)
        {
            content.push({'title' : types[t]})
        }


         $('.ui.search.name')
              .search({
                source: content,
                  onSelect: function (result,response) {
                    console.log(result);
                    // $("#contenido").empty()

                      var newjson = $.grep(json['orden'], function(v) {
                        return v['empleados'].find(function(e){
                            if($("#inputSearchStateOrder").val() === "")
                                return e['nombre'] === result.title.split(" ")[0] && e['ap'] === result.title.split(" ")[1] && e['am'] === result.title.split(" ")[2]
                              else
                              {
                                   var searchstatus = $("#inputSearchStateOrder").val()
                                  var id = -1
                                  switch (searchstatus) {
                                      case typesstate[0] : id = -1
                                          break;
                                      case typesstate[1] : id = 0
                                          break;
                                      case typesstate[2] : id = 1
                                          break;
                                  }
                                  return v['estado'] === id && e['nombre'] === result.title.split(" ")[0] && e['ap'] === result.title.split(" ")[1] && e['am'] === result.title.split(" ")[2];
                              }

                            }) !== undefined;
                        });
                      console.log(newjson)
                      var cont = createOrdersAdminTable(newjson,d1)
                      var htm = cont.substring(cont.indexOf("<tbody id=\"tbodyorderstable\">")+29,cont.indexOf("</tbody>"))
                      console.log(htm)
                      $("#tbodyorderstable").empty()
                      $("#tbodyorderstable").append(htm)
                      $("#tableequip").fadeIn('slow')
                      setClicksOrders(newjson,json['tecnicos'])

                return true;
            },
                  onResultsClose: function(){
                    // console.log("Cerro")
                      if($("#inputSearchNameOrder").val() === "")
                      {
                          if($("#inputSearchStateOrder").val() === "")
                          {

                              var cont = createOrdersAdminTable(json['orden'],d1)
                              var htm = cont.substring(cont.indexOf("<tbody id=\"tbodyorderstable\">")+29,cont.indexOf("</tbody>"))
                              console.log(htm)
                              $("#tbodyorderstable").empty()
                              $("#tbodyorderstable").append(htm)
                              $("#tableequip").fadeIn('slow')
                              setClicksOrders(json['orden'],json['tecnicos'])
                          }
                          else
                          {
                              var searchstatus = $("#inputSearchStateOrder").val()
                              var id = -1
                              switch (searchstatus) {
                                  case typesstate[0] : id = -1
                                      break;
                                  case typesstate[1] : id = 0
                                      break;
                                  case typesstate[2] : id = 1
                                      break;
                              }
                              var newjson = $.grep(json['orden'], function(v) {
                                return v['estado'] === id;
                                });
                              console.log(newjson)
                              var cont = createOrdersAdminTable(newjson,d1)
                              var htm = cont.substring(cont.indexOf("<tbody id=\"tbodyorderstable\">")+29,cont.indexOf("</tbody>"))
                              console.log(htm)
                              $("#tbodyorderstable").empty()
                              $("#tbodyorderstable").append(htm)
                              $("#tableequip").fadeIn('slow')
                              setClicksOrders(newjson,json['tecnicos'])
                          }
                      }
                  },
                  error: {
                    noResults: 'No se encontrarón resultados que coincidan con el criterio de búsqueda.'
                  }
              })

            setClicksOrders(json['orden'],json['tecnicos'])

        }
    }
    });
}

function setClicksOrders(json,tecnicos)
{
    json.forEach(function(element){

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
                tecnicos.forEach(function(tecnico){
                    if(tecnico['trabajos__nombre'] === element['trabajo__nombre'])
                        newOptions[(index++).toString()] = "No. Empleado: "+tecnico['pk']+", Nombre: "+tecnico['nombre']+" "+tecnico['ap']+" "+tecnico['am']
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

function createOrdersAdminTable(json,d1)
{

    var html ='<table id="tableorder" style="display:none;" class="ui blue celled table">'+
  '<thead>'+
  '  <tr><th colspan="2"><center>No. Folio</center></th>'+
  '  <th colspan="2"><center>Fecha de inicio</center></th>'+
  '  <th colspan="2"><center>Fecha de fin</center></th>'+
  '  <th colspan="1"><center>Estado<div class="ui search state">\n' +
        '  <div class="ui icon input">\n' +
        '    <input id="inputSearchStateOrder" class="prompt" type="text" placeholder="Filtrar por estado">\n' +
        '    <i class="search icon"></i>\n' +
        '  </div>\n' +
        '  <div class="results"></div>\n' +
        '</div></center></th>'+
  '  <th colspan="3"><center>Solicitante<div class="ui search name">\n' +
        '  <div class="ui icon input">\n' +
        '    <input id="inputSearchNameOrder" class="prompt" type="text" placeholder="Filtrar por solicitante">\n' +
        '    <i class="search icon"></i>\n' +
        '  </div>\n' +
        '  <div class="results"></div>\n' +
        '</div></center></th>'+
  '  <th colspan="1"><center>Opciones</center></th>'+
  '</tr></thead>'+
  '<tbody id="tbodyorderstable">';
  if($.isEmptyObject(json))
  {
    html+='<tr><td class="collapsing"></td><td></td><td></td></tr>'
  }
  json.forEach(function(element) {
      var d2 = Date.parse(element['start']);
      var days = ((d1-d2)/1000/86400)
      var img = ""
      if(days <= 1)
      {
          img = '<img src="/static/tt/img/light-green.png" style="vertical-align: middle; width: 30px; height: 30px;">'
      }
      else if(days === 2 )
      {
          img = '<img src="/static/tt/img/light-yellow-flash.gif" style="vertical-align: middle; width: 30px; height: 30px;">'
      }
      else if(days >2)
      {
          img = '<img src="/static/tt/img/light-red-flash.gif" style="vertical-align: middle; width: 30px; height: 30px;">'
      }
        // console.log("Orden "+element['nofolio']+" -> "+((d1-d2)/1000/86400))
      var solicitante = element['empleados'].find(function(element){
        return element['tipo__nombre'] === "Docente"
        })
      var estado = ""
      var clase = ""
      switch(element['estado'])
      {
          case -1: estado = "Sin asignar"; clase = "unknown";
              break;
          case 0: estado = "Asignado, en espera de ser resuelto."; clase = "warning";
              break;
          case 1: estado = "Resuelto"; clase = "positive";
              break;
          case 2: estado = "No se pudo resolver"; clase = "error";
              break;
          default:
      }
      html +='<tr class="'+clase+'"><td colspan="2" class="collapsing">';
      if(element['estado'] < 1)
          html+= img;
      html+='<span style="vertical-align: middle;">&nbsp;&nbsp;'+
        element['nofolio']+'</span>'+
        '</td><td colspan="2">'+element['start']+'</td>'+
        '</td><td colspan="2">'+((element['end']!=null) ? element['end'] : "Pendiente")+'</td>'+
        '</td><td colspan="1">'+estado+'</td>'+
        // '</td><td colspan="1"><center><img style="width: 10%; height:10%;" src="{% static 'tt/img/red.png' %}"/></center></td>'+
        '</td><td colspan="3">No. Empleado: '+solicitante['pk']+', Nombre: '+solicitante['nombre']+' '+solicitante['ap']+' '+solicitante['am']+'</td>';
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
          '<a href="/reporteOrden/'+element['nofolio']+'/" target="_blank" class="ui positive button" id="'+(element['nofolio']+"pdf").replace(/\s+/g, '')+'">Generar PDF</a></div></td></tr>';

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
  '  <tr><th colspan="1"><center>No. Folio</center></th>'+
  '  <th colspan="2"><center>Fecha de inicio</center></th>'+
  '  <th colspan="2"><center>Fecha de fin</center></th>'+
  '  <th colspan="1"><center>Estado</center></th>'+
  '  <th colspan="3"><center>'+typ+'</center></th>'+
  '  <th colspan="1"><center>Opciones</center></th>'+
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
          case -1: estado = "Sin asignar"; clase = "unknown";
              break;
          case 0: estado = "Asignado, en espera de ser resuelto."; clase = "warning";
              break;
          case 1: estado = "Resuelto"; clase = "positive";
              break;
          case 2: estado = "No se pudo resolver"; clase = "error";
              break;
          default:
      }
      var emp = (solicitante!==undefined) ? solicitante["nombre"]+' '+solicitante["ap"]+' '+solicitante["am"] : "Sin asignar"
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
            update = false
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
  '  <tr><th colspan="2"><center>Nombre</center></th>'+
  '  <th colspan="1"><center>Opciones</center></th>'+
  '</tr></thead>'+
  '<tbody>';
  if($.isEmptyObject(json))
  {
    html+='<tr><td class="collapsing"></td><td></td><td></td></tr>'
  }
  json.forEach(function(element) {
      html +='<tr><td colspan="2" class="collapsing" id="'+(element['pk']+element['nombre']+"infoDepto").replace(/\s+/g, '')+'"><i class="fas fa-clinic-medical"></i>'+
        element['nombre']
        html+='<td colspan="1" class="right aligned collapsing"><div class="ui buttons"><button class="ui negative button" id="'+(element['pk']+element['nombre']+"delete").replace(/\s+/g, '')+'">Borrar</button>'+
          '<div class="or" data-text="o"></div>'+
          '<button class="ui positive button" id="'+(element['pk']+element['nombre']+"update").replace(/\s+/g, '')+'">Editar</button></div></td></tr>';
    });

  html +='<tfoot class="full-width">'+
    '<tr>'+

      '<th colspan="3">'+
      '  <div class="ui right floated small primary labeled icon button" id="agregarSubDep">'+
     '     <i class="warehouse icon"></i> Agregar SubDepartamento'+
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

                    $("#finishorder").on('click',function(){
                         $.ajax({
                            url : "{% url "tt:finishOrder" %}",
                            data : {"idOrden":id,"msg":$.trim($("#textareacommenttec").val()),"status":1},
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




                    $("#nofinishorder").on('click',function(){
                         $.ajax({
                            url : "{% url "tt:finishOrder" %}",
                            data : {"idOrden":id,"msg":$.trim($("#textareacommenttec").val()),"status":2},
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
    else if(json['orden'][0]['estado'] == 1)
    {
        clasestate = "positive"
        clasemsg = "Orden finalizada"
    }
    else
    {
        clasestate = "positive"
        clasemsg = "No se pudo finalizar"
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
        '                <button class="ui inverted left floated red button" id="nofinishorder">No se pudo finalizar orden</button>\n' +
        '                <button class="ui inverted right floated blue button" id="finishorder">Finalizar orden</button>\n' +
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
                $('.ui.dropdown.softw').dropdown({
                    onChange: function(value, text, $selectedItem) {
                        var txt =  $("#id_descripcion").val()
                        var msg = txt.split("\n:::..Software a instalar ..:::")[0]
                        if(value.length > 0)
                        {
                            $("#id_descripcion").val(msg+"\n:::..Software a instalar ..:::\n")

                            value.forEach(function (e) {
                                $("#id_descripcion").val(function() {
                                return this.value + " -> "+ e +"\n";
                            })
                            })

                        }

                        else
                        {
                            $("#id_descripcion").val(msg)
                        }
                    }
                })
                data.instalacion.forEach(function (e) {
                    $("#softwareopt").append('<option value="'+e.nombre.replace(/\s/g,'')+'">'+e.nombre+'</option>')
                })



                $("#divformorder").fadeIn()
                $("#id_fecha").val(data['fecha'])
                $("#id_depto").val(data['data'][0]['departamento__nombre'])
                $("#id_subdepto").val(data['data'][0]['subdepartamento__nombre'])
                $("#id_folio").val(data['folio'])
                $("#id_solicitante").val("No. Empleado: "+data['data'][0]['pk']+", Nombre: "+data['data'][0]['nombre']+" "+data['data'][0]['ap']+" "+data['data'][0]['am'])




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

function addAdmin() {
    $( '#floatmenu' ).click ();
    $("#floatmenu *").prop('disabled',true);
    update = false
            $("#headerFormReg").text("Añadir Administrador")
            $("#typetec").hide()
            $("#badreg").hide()
            $("#okreg").hide()
            $("#divterms").hide()
            $('#id_idEmpleado').attr('readonly', false);
            $("#btnRegistrar").val("Registrar")
//            $("#department").hide()
            $('#regform').modal({
                onHidden: function(){
                    $("#floatmenu *").prop('disabled',false);
                },
                    selector    : {
                    close    : '.close, #btncloseregmod'
                }}).modal('show')
            $("#deptochoices").hide()
            $("#taobs").hide()
            $('#registro').trigger("reset");

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
                    '<div class="ui right floated yellow buttons">\n' +
                    '  <div class="ui right floated button">Tipo de gráfica</div>\n' +
                    '  <div class="ui right floated dropdown graphs icon button">\n' +
                    '    <i class="dropdown icon"></i>\n' +
                    '    <div class="menu">\n' +
                    '      <div class="item active"><i class="pencil alternate icon"></i>Satisfacción</div>\n' +
                    '      <div class="item"><i class="fas fa-file-invoice"></i> Ordenes</div>\n' +
                    '    </div>\n' +
                    '  </div>\n' +
                    '</div>' +
                     '<div class="ui right floated orange buttons">\n' +
                     '<a href="/reporteServicios/99999/" target="_blank" class="ui right labeled icon floated button" style="margin-right: 10px;"><i class="file pdf icon"></i>Reporte de servicios</a>\n' +
                    '</div>'+
                    '<div class="ui left floated purple buttons" style="display: none;" id="months">\n' +
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
                    '<div class="ui left floated red buttons" style="display: none; margin-left: 10px;" id="typeordergraph">\n' +
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

            var datos2 = {
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

            var datos3 = {
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
                        if(e.estado === 2)
                            datos3['1'] +=1
                        else if(e.estado === 1)
                            datos2['1'] +=1
                        else
                            datos['1'] += 1
                        break;
                    case "02":
                        if(e.estado === 2)
                            datos3['2'] +=1
                        else if(e.estado === 1)
                            datos2['2'] +=1
                        else
                            datos['2'] += 1
                        break;
                    case "03":
                        if(e.estado === 2)
                            datos3['3'] +=1
                        else if(e.estado === 1)
                            datos2['3'] +=1
                        else
                            datos['3'] += 1
                        break;
                    case "04":
                        if(e.estado === 2)
                            datos3['4'] +=1
                        else if(e.estado === 1)
                            datos2['4'] +=1
                        else
                            datos['4'] += 1
                        break;
                    case "05":
                        if(e.estado === 2)
                            datos3['5'] +=1
                        else if(e.estado === 1)
                            datos2['5'] +=1
                        else
                            datos['5'] += 1
                        break;
                    case "06":
                        if(e.estado === 2)
                            datos3['6'] +=1
                        else if(e.estado === 1)
                            datos2['6'] +=1
                        else
                            datos['6'] += 1
                        break;
                    case "07":
                        if(e.estado === 2)
                            datos3['7'] +=1
                        else if(e.estado === 1)
                            datos2['7'] +=1
                        else
                            datos['7'] += 1
                        break;
                    case "08":
                        if(e.estado === 2)
                            datos3['8'] +=1
                        else if(e.estado === 1)
                            datos2['8'] +=1
                        else
                            datos['8'] += 1
                        break;
                    case "09":
                        if(e.estado === 2)
                            datos3['9'] +=1
                        else if(e.estado === 1)
                            datos2['9'] +=1
                        else
                            datos['9'] += 1
                        break;
                    case "10":
                        if(e.estado === 2)
                            datos3['10'] +=1
                        else if(e.estado === 1)
                            datos2['10'] +=1
                        else
                            datos['10'] += 1
                        break;
                    case "11":
                        if(e.estado === 2)
                            datos3['11'] +=1
                        else if(e.estado === 1)
                            datos2['11'] +=1
                        else
                            datos['11'] += 1
                        break;
                    case "12":
                        if(e.estado === 2)
                            datos3['12'] +=1
                        else if(e.estado === 1)
                            datos2['12'] +=1
                        else
                            datos['12'] += 1
                        break;
                }
            })
            var yValue = [datos['1'], datos['2'], datos['3'], datos['4'], datos['5'], datos['6'], datos['7'], datos['8'], datos['9'], datos['10'], datos['11'], datos['12']]
            var yValue2 = [datos2['1'], datos2['2'], datos2['3'], datos2['4'], datos2['5'], datos2['6'], datos2['7'], datos2['8'], datos2['9'], datos2['10'], datos2['11'], datos2['12']]
            var yValue3 = [datos3['1'], datos3['2'], datos3['3'], datos3['4'], datos3['5'], datos3['6'], datos3['7'], datos3['8'], datos3['9'], datos3['10'], datos3['11'], datos3['12']]
            var data = [
                {
                    x: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                    y: yValue,
                    type: 'bar',
                    name: 'Ordenes activas',
                    text: yValue.map(String),
                    textposition: 'auto',
                    hoverinfo: 'none',
                    marker: {
                        // color: ['rgb(255,248,182)', 'rgb(255,228,163)', 'rgb(255,189,145)', 'rgb(255,141,113),rgb(255,112,126),rgb(231,201,144),rgb(217,234,157),rgb(133,229,188),rgb(126,185,240),rgb(195,150,234),rgb(255,158,27),rgb(255,123,8)'],
                        color: 'rgb(92, 138, 138)',
                        opacity: 0.6,
                        line: {
                            color: 'rgb(8,48,107)',
                            width: 1.5
                        }
                    }
                },
                {
                    x: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                    y: yValue2,
                    type: 'bar',
                    name: 'Ordenes Finalizadas',
                    text: yValue2.map(String),
                    textposition: 'auto',
                    hoverinfo: 'none',
                    marker: {
                        // color: ['rgb(255,248,182)', 'rgb(255,228,163)', 'rgb(255,189,145)', 'rgb(255,141,113),rgb(255,112,126),rgb(231,201,144),rgb(217,234,157),rgb(133,229,188),rgb(126,185,240),rgb(195,150,234),rgb(255,158,27),rgb(255,123,8)'],
                        color: 'rgb(46, 184, 46)',
                        opacity: 0.6,
                        line: {
                            color: 'rgb(8,48,107)',
                            width: 1.5
                        }
                    }
                },
                {
                    x: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                    y: yValue3,
                    type: 'bar',
                    name: 'Ordenes no resueltas',
                    text: yValue3.map(String),
                    textposition: 'auto',
                    hoverinfo: 'none',
                    marker: {
                        // color: ['rgb(255,248,182)', 'rgb(255,228,163)', 'rgb(255,189,145)', 'rgb(255,141,113),rgb(255,112,126),rgb(231,201,144),rgb(217,234,157),rgb(133,229,188),rgb(126,185,240),rgb(195,150,234),rgb(255,158,27),rgb(255,123,8)'],
                        color: 'rgb(179, 0, 0)',
                        opacity: 0.6,
                        line: {
                            color: 'rgb(8,48,107)',
                            width: 1.5
                        }
                    }
                }
            ];

            var layout = {
                title: 'Gráfica de ordenes anual #Ordenes : ' + json.length,
                barmode: 'stack'
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
    $("#badregequipo").hide()
    $("#okregequipo").hide()
    $("#divterms").hide()
    var subdep = ""
    var dept = ""

    $.ajax({
            url: "{% url 'tt:getSubDepartments' %}",
            type: 'GET',
            data: {'depto':$('#id_depto').val()},
            success: function (json) {
                console.log(json)
                var newOptions = {};
                var index = 0;
                json.subdepto.forEach(function(element){
                   newOptions[(index++).toString()] = element['nombre']+", Edificio: "+element['ubicacion__edificio']+" Piso: "+element['ubicacion__piso']+" Sala: "+element['ubicacion__sala']
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
            success: function (json) {
                console.log(json)
                var newOptions = {};
                var index = 0;
                json.subdepto.forEach(function(element){
                   newOptions[(index++).toString()] = element['nombre']+", Edificio: "+element['ubicacion__edificio']+" Piso: "+element['ubicacion__piso']+" Sala: "+element['ubicacion__sala']
                });
                newOptions[(index++).toString()] = "Ninguno"

                var $el = $("#id_subdepto");
                $el.empty();
                $.each(newOptions, function(key,value) {
                  $el.append($("<option></option>")
                     .attr("value", value).text(value));
                });

                if(valueSelected === dept)
                {
                    $("#id_subdepto").val(subdep)
                }
            }
        });
    });

    $.ajax({
        url : "{% url "tt:getUserInfo" %}",
        data : {},
        dataType : 'json',
        success : function(data) {
            console.log(data);
            $("#id_idEmpleado").val(data.data[0].pk)
            dept = data.data[0].departamento__nombre
            subdep = data.data[0].subdepartamento__nombre+", Edificio: "+data.data[0].subdepartamento__ubicacion__edificio+" Piso: "+data.data[0].subdepartamento__ubicacion__piso+" Sala: "+data.data[0].subdepartamento__ubicacion__sala
            $("#id_depto").val(data.data[0].departamento__nombre).trigger('change')
            $("#id_idEmpleado").attr('readonly', true);
            $("#id_email").val(data.data[0].email)
            $("#id_contra").val(data.data[0].password)
            $("#id_telefono").val(data.data[0].numero)
            $("#id_extension").val((data.data[0].ext === null) ? "" : data.data[0].ext)

            // console.log((data.data[0].subdepartamento__nombre+", Edificio: "+data.data[0].subdepartamento__ubicacion__edificio+" Piso: "+data.data[0].subdepartamento__ubicacion__piso+" Sala: "+data.data[0].subdepartamento__ubicacion__sala))

            $("#id_nombre").val(data.data[0].nombre)
            $("#id_ap").val(data.data[0].ap)
            $("#id_am").val(data.data[0].am)
            $('.ui.checkbox').checkbox()
            $('.ui.checkbox.showpass')
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
        '                  <p>No. Empleado : '+json.data[0].pk+'</p>\n' +
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

var standardHeader = $.fn.search.settings.templates.message;

var newHeader = function (message, type) {
    var
    html = '';
    if (message !== undefined && type !== undefined) {
        html += '' + '<div class="message ' + type + '">';
        // message type
        if (type == 'empty') {
            html += '' + '<div class="header">Sin resultados</div class="header">' + '<div class="description">' + message + '</div class="description">';
        } else {
            html += ' <div class="description">' + message + '</div>';
        }
        html += '</div>';
    }
    return html;
};