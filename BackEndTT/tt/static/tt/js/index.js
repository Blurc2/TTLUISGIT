{% load static %}

function showRegisterModal()
{
    $('#regform')
      .modal('show')
    ;
}

$("form#registro").submit(function(e) {
e.preventDefault();
var formData = new FormData(this);
    $("form#registro").addClass( "loading" )
    $.ajax({
    url: "{% url 'tt:Registrar' %}",
    type: 'POST',
    data: formData,
    success: function (data) {
    console.log(data.code)
    $("form#registro").removeClass( "loading" )
    if(data.code == 0)
        $("#badreg").fadeIn("slow");
    else
        $("#okreg").fadeIn("slow");
    },
    cache: false,
    contentType: false,
    processData: false
});

});