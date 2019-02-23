function imagen(img) {
  var ModalImagen ="<div class=\"ui large event-modal modal transition\" id=\"modalgaleria\" style=\"z-index:1000000; position:absolute;\">"+
    "<div class=\"header\">"+
     " Galeria"+
    "</div>"+
    "<div class=\"content\">"+
     " <div class=\"bxslider\">"+
     "   <div><img src=\"{% static 'gepp/img/geep/ook/01.jpg' %}\" style=\"width:100%; heigth:100%;\" /></div>"+
      "  <div><img src=\"{% static 'gepp/img/geep/ook/02.png' %}\" style=\"width:100%; heigth:100%;\" /></div>"+
      "  <div><img src=\"{% static 'gepp/img/geep/ook/03.jpg' %}\" style=\"width:100%; heigth:100%;\" /></div>"+
      "  <div><img src=\"{% static 'gepp/img/geep/ook/06.jpg' %}\" style=\"width:100%; heigth:100%;\" /></div>"+
     " </div>"+
    "</div>"+
    "<div class=\"actions\">"+
       "<button class=\"ui button\" onclick= \"CerrarModal()\"> "+
        "Cerrar"+
       "</button> "+
    "</div>"+
  "</div>";
  $("body").append(ModalImagen);

  var vslider;
  $('#modalgaleria')
    .modal({
      onHide: function(){
        vslider.destroySlider();
        $('#modalgaleria').remove();
      },
      allowMultiple: true,
      transition:'fade',
    }).modal('show');

  var vslider= $('.bxslider').bxSlider({
  mode: 'fade',
  startSlide: parseInt(img.substring(img.length-1,img.length))-1
  });
}

function CerrarModal() {
  $("#modalgaleria").modal("hide");
}
