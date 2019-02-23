var map;
var map2;
var htmlaux;
var anioActual;
var selactual="semanal";
var arraymarker={};
var usuariosmarker={};
document.getElementById("resetf").style.cursor = "pointer";
var vendedor = initpath + 'izzi/vend_v.png';
var indexmodal="modalSellin";
var mayorGap = parseFloat({{gapmaximo.0.porcentaje_gap}});
var razonGap = 100/mayorGap;
var stringtem = (("{{enfriadoresmaximo.0.equipamiento_existencia}}")).split(":");
var razonEnfriador = 255/parseInt(stringtem[0]);
var idp="modal";
var InfoAnalisis =
{
  ArrVisitas: [],
  ArrIngreso: [],
  ArrTamGap: [],
  ArrColorGap: [],
  ArrText: [],
};

var icons = {
 modv: {
     leyenda: 'Gap menor a 25%',
     icon: initpath + 'i_m1.png'
 },
 modam: {
     leyenda: 'Gap mayor a 25% y menor a 45%',
     icon: initpath + 'i_m2.png'
 },
 modr: {
     leyenda: 'Gap mayor a 45%',
     icon: initpath + 'i_m3.png'
 }
};

function init(){
 if ("WebSocket" in window) {
   console.log("si inicializa");
   ws = new WebSocket("ws://54.215.142.181:7080/v2/broker/?topics=modulos");
   ws.onopen = function() {
   console.log("W")
   };
   ws.onmessage = function(e){
   //alert(e.data);
     datasocket = JSON.parse(e.data);
     mensajesocket = JSON.parse(datasocket.message);
     if((parseInt(mensajesocket.latitud) != 0) && (parseInt(mensajesocket.longitud) != 0) && usuariosmarker[String(mensajesocket.id_marker)]){
       distancia = haversine(usuariosmarker[String(mensajesocket.id_marker)].latitud,usuariosmarker[String(mensajesocket.id_marker)].longitud,mensajesocket.latitud,mensajesocket.longitud)
      if(distancia < 10.0){
         console.log("Moviendo id: "+String(mensajesocket.id_marker) +" : "+distancia);
         usuariosmarker[String(mensajesocket.id_marker)].latitud = mensajesocket.latitud;
         usuariosmarker[String(mensajesocket.id_marker)].longitud = mensajesocket.longitud;
         usuariosmarker[String(mensajesocket.id_marker)].marker.setPosition({lat:mensajesocket.latitud,lng:mensajesocket.longitud});
      }
     }
   }
 }
}

//deben llamar init() en su $(document).ready
//Haversine, calclular la distancia de dos puntos en kilometros

Math.radians = function(degrees){
  return degrees * Math.PI / 180.0;
};

function haversine(lat1,lon1,lat2,lon2){
  var R = 6371; // Radio de la tierra en kilometros
   var l1 = Math.radians(lat1);
   var l2 = Math.radians(lat2);
   var res = Math.radians(lat2-lat1);
   var res1 = Math.radians(lon2-lon1);
   var a = Math.sin(res/2.0) * Math.sin(res/2.0) + Math.cos(l1) * Math.cos(l2) *Math.sin(res1/2.0) * Math.sin(res1/2.0);
   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
   var d = R * c;
   return d;
}

function initMap() {
  $('#analisis').hide();
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 19.4284700, lng: -99.1276600},
    zoom: 6
  });

  map2 = new google.maps.Map(document.getElementById('map2'), {
      center: {lat: 19.4284700, lng: -99.1276600},
      zoom: 6
    });
  setTimeout(function(){ htmlaux=$("#map2").html(); $("#map2").remove() }, 1000);
  CargarMarcadores();

var simbologia = document.getElementById('legend');
      for (var index in icons) {
        var fila = icons[index];
        var name = fila.leyenda;
        var icon = fila.icon;
        var div = document.createElement('div');
        div.innerHTML = '<img src="' + icon + '"> ' + name;
        legend.appendChild(div);
      }

      map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(simbologia);
  }

  function CargarMarcadores() {
  var contador=[0,0,0,0];
      {% for marcador in puntos %}
          arraymarker[({{ marcador.id_pdv }}).toString()] = {marker:0,nombre:"{{marcador.nombre_pdv}}",latitud:{{ marcador.lat }},longitud:{{ marcador.lon }},ingreso:{{marcador.ingreso_bruto}},enfriadores:("{{marcador.pdv_num_enfriadores}}").split(":")[0],visitas:{{marcador.pdv_num_visitas_sum}},porcengap:{{marcador.porcengap}},clase:"{{ marcador.clase }}",cluster:{{ marcador.cluster }} };
      {% endfor %}
      var points = [];
      {% for marcador in usuarios %}
          points=[];
          {% for cor in marcador.markers %}
               points.push({ lat:{{cor.latitud}},lng:{{cor.longitud}} });
          {% endfor %}
          usuariosmarker[({{ marcador.id_marker }}).toString()]={ marker:0,latitud:points[points.length-1].lat,longitud:points[points.length-1].lng,puntos:points};
      {% endfor %}
      //alert(JSON.stringify(usuariosmarker['9684']));
  var content=[];
      for(var h in arraymarker)
      {
          content.push({title:h+" "+arraymarker[h].nombre});
          var icono = geticon(arraymarker[h].porcengap);
                  arraymarker[h].marker = new google.maps.Marker({
                      position: new google.maps.LatLng(arraymarker[h].latitud, arraymarker[h].longitud),
                      icon: icono,
                      title: h
                  });
                  arraymarker[h].marker.setMap(map);
                  var mark=arraymarker[h].marker;
                  google.maps.event.addListener(mark, 'click', (function(mark, h) {
                                                  return function() {
                                              cargarmodal(h,"m3");
                                                  }
                                              })(mark, h));
                  /*if(parseFloat(arraymarker[h].porcengap) > 0 && parseFloat(arraymarker[h].porcengap) <=200){
                  InfoAnalisis.ArrVisitas.push(arraymarker[h].visitas);
                  InfoAnalisis.ArrIngreso.push(arraymarker[h].ingreso);
                  InfoAnalisis.ArrTamGap.push(arraymarker[h].porcengap*razonGap);
                  InfoAnalisis.ArrColorGap.push(SeleccionColor(arraymarker[h].enfriadores,razonEnfriador));
                  InfoAnalisis.ArrText.push("ID_PDV:"+h);
                  }*/
               //   if(h.localeCompare("1873009")!=0)
                 //  {
                   // arraymarker[h].marker.setVisible(false);
                    //}
                  if(arraymarker[h].porcengap < 25)
                  contador[1]++;
                else if(arraymarker[h].porcengap >= 25 && arraymarker[h].porcengap <= 45)
                  contador[2]++;
                else if(arraymarker[h].porcengap > 45)
                  contador[3]++;
                 contador[0]++;
      }
      $("#ctotal").text(contador[0]);
      $("#cgapv").text(contador[1]);
      $("#cgapa").text(contador[2]);
      $("#cgapr").text(contador[3]);
      $('.ui.search')
        .search({
          source: content,
          onSelect: function(result,response)
          {
            cargarmodal(result['title'].split(" ")[0],"m3");
            var center = new google.maps.LatLng(arraymarker[result['title'].split(" ")[0]].latitud, arraymarker[result['title'].split(" ")[0]].longitud);
                map.panTo(center);
                map.setZoom(12);
          }
        })
      ;
  }

  function cargarmodal(idpdv,modal)
     {
         $("#loader2").show();
         idp="modal"+idpdv;
         $.ajax({
                 url: "{% url "gepp:returnModal" %}",
                 data: { 'id_pdv': idpdv, 'modal':modal},
                 dataType: 'html',
                 success: function(data){
                     indexmodal="modalSellin";

                     $('body').append("<div class=\"ui fullscreen modal event-modal modalC transition\" id="+idp+">"+data);
                     $("#"+idp)
                     .modal({
                     allowMultiple: true,
                     onHide: function(){
                        setTimeout(function(){
                        $("#"+idp).remove();
                        $('#modalgaleria').remove(); },250);
                     },
                     inverted: true,
                     transition:'fade',
                     })
                     .modal('show');

                     $(".dimmer").css("background-color",'rgba(26,26,26,0.5)');

                     if(modal.localeCompare("m1")==0)
                     {

                       setTimeout(function(){ setTimeout(function(){ $("#map2").append(htmlaux); map2 = new google.maps.Map(document.getElementById('map2'), {
                                                                                                        center: {lat: usuariosmarker[idpdv].puntos[0].lat, lng: usuariosmarker[idpdv].puntos[0].lng},
                                                                                                        zoom: 14
                                                                                                      });
                                                                                                           for(pos in usuariosmarker[idpdv].puntos)
                                                                                                           {
                                                                                                           var mark = new google.maps.Marker({
                                                                                                                 position: new google.maps.LatLng(usuariosmarker[idpdv].puntos[pos].lat, usuariosmarker[idpdv].puntos[pos].lng),
                                                                                                                 icon: initpath + 'izzi/dom_contratado.png',
                                                                                                                 title: idpdv+" , Latitud: "+usuariosmarker[idpdv].puntos[pos].lat+" , Longitud: "+usuariosmarker[idpdv].puntos[pos].lng
                                                                                                            });
                                                                                                            mark.setMap(map2);
                                                                                                            }
                                                                                                               var lineSymbol = {
                                                                                                                 path: 'M 0,-1 0,1',
                                                                                                                 strokeOpacity: 1,
                                                                                                                 scale: 2
                                                                                                               };

                                                                                                               var line = new google.maps.Polyline({
                                                                                                                 path: usuariosmarker[idpdv].puntos,
                                                                                                                 strokeOpacity: 0,
                                                                                                                 icons: [{
                                                                                                                   icon: lineSymbol,
                                                                                                                   offset: '0',
                                                                                                                   repeat: '20px'
                                                                                                                 }],
                                                                                                                 map: map2
                                                                                                               });

                                                                                                      $("#loader2").fadeOut("slow");}, 1000);}, 1000);
                     }
                     else
                     {
                     $("#loader2").fadeOut("slow");
                     }

                 }
             });
     }

     function geticon(porgap)
     {
         var icono;
         if(porgap < 25)
         {
             var icono=icons['modv'].icon;
         }
         else if(porgap >= 25 && porgap <= 45)
         {
             var icono=icons['modam'].icon;
         }
         else if(porgap > 45)
         {
             var icono=icons['modr'].icon;
         }
         return icono;
     }

  function borrar(){
  var contador=[0,0,0,0];
      for(var h in arraymarker)
          {
              if(arraymarker[h].porcengap < 25)
                  contador[1]++;
              else if(arraymarker[h].porcengap >= 25 && arraymarker[h].porcengap <= 45)
                  contador[2]++;
              else if(arraymarker[h].porcengap > 45)
                  contador[3]++;
              contador[0]++;
              arraymarker[h].marker.setVisible(true);
              $("#fgap").text("Seleccione uno");
              $("#fclases").text("Seleccione uno");
              $("#fcluster").text("Seleccione uno");
          }
      $('#filtroclases > a').each(function () {
          $(this).removeClass("active");
      });
      $('#filtrogap > a').each(function () {
                  $(this).removeClass("active");
      });
      $('#filtrocluster > a').each(function () {
                  $(this).removeClass("active");
      });
      if($("#analisis").is(":visible"))
          {
            Analisis();
          }
      $("#ctotal").text(contador[0]);
      $("#cgapv").text(contador[1]);
      $("#cgapa").text(contador[2]);
      $("#cgapr").text(contador[3]);

  }

function filtrado()
{
  var contador=[0,0,0,0];
  var condicion="";
  var an = [];

  $('#filtrogap > a').each(function () {
        if($(this).hasClass('active'))
            {
                $("#fgap").text($(this).text());
                an[0]=$(this).prop('id');
            }
  });
  switch(an[0]){
      case "gaprf": an[0] = "(arraymarker[h].porcengap <= 45)"; break;
      case "gapaf": an[0] = "(arraymarker[h].porcengap < 25 || arraymarker[h].porcengap > 45)"; break;
      case "gapvf": an[0] = "(arraymarker[h].porcengap > 25)"; break;
      default: an[0] = "SS";
  }

  $('#filtroclases > a').each(function () {
    if($(this).hasClass('active'))
        {
            $("#fclases").text($(this).text());
            an[1]=$(this).prop('id');
        }
  });
  switch(an[1]){
      case "CA": an[1] = " (arraymarker[h].clase.localeCompare(\"A\")!=0)"; break;
      case "CB": an[1] = " (arraymarker[h].clase.localeCompare(\"B\")!=0)"; break;
      case "CC": an[1] = " (arraymarker[h].clase.localeCompare(\"C\")!=0)"; break;
      case "CD": an[1] = " (arraymarker[h].clase.localeCompare(\"E\")!=0)"; break;
      case "CE": an[1] = " (arraymarker[h].clase.localeCompare(\"D\")!=0)"; break;
      default: an[1] = "SS";
  }
  an[2] = "SS";
  $('#filtrocluster > a').each(function () {
    if($(this).hasClass('active'))
        {
            $("#fcluster").text($(this).text());
            an[2]=$(this).prop('id');
        }
  });
  if(an[2].localeCompare("SS")!=0)
      an[2] = "(arraymarker[h].cluster != "+an[2]+")";

  for(var i = 0; i < 3; i++)
      if(an[i].localeCompare("SS")!=0)
          condicion += an[i] + "||";
  condicion = condicion.slice(0, -2)
  for(var h in arraymarker)
  {
      if(eval(condicion))
          arraymarker[h].marker.setVisible(false);
      else
      {
          if(arraymarker[h].porcengap < 25)
              contador[1]++;
          else if(arraymarker[h].porcengap >= 25 && arraymarker[h].porcengap <= 45)
              contador[2]++;
          else if(arraymarker[h].porcengap > 45)
              contador[3]++;
          contador[0]++;
          arraymarker[h].marker.setVisible(true);

      }

  }
  if($("#analisis").is(":visible"))
    {
      Analisis();
    }
  $("#ctotal").text(contador[0]);
  $("#cgapv").text(contador[1]);
  $("#cgapa").text(contador[2]);
  $("#cgapr").text(contador[3]);


}


function SeleccionColor(Razon, numeroEnfriadores)
{
  var red = 255 - (Razon * numeroEnfriadores);
  var green = 0 + (Razon * numeroEnfriadores);
  var rgb = "rgb("+red+","+green+",0)";
  return rgb;
}

function Analisis() {
    $('#map').fadeOut('slow');

    InfoAnalisis =
    {
      ArrVisitas: [],
      ArrIngreso: [],
      ArrTamGap: [],
      ArrColorGap: [],
      ArrText: [],
    };
    for(var h in arraymarker){
        if(arraymarker[h].marker.getVisible())
        {
            var porcgap;
            if(arraymarker[h].porcengap*razonGap < 10)
                porcgap=10;
            else if(arraymarker[h].porcengap*razonGap > 100)
                porcgap=100;
            else
                porcgap=arraymarker[h].porcengap*razonGap;
            InfoAnalisis.ArrVisitas.push(arraymarker[h].visitas);
            InfoAnalisis.ArrIngreso.push(arraymarker[h].ingreso);
            InfoAnalisis.ArrTamGap.push(porcgap);
            InfoAnalisis.ArrColorGap.push(SeleccionColor(arraymarker[h].enfriadores,razonEnfriador));
            InfoAnalisis.ArrText.push("ID_PDV:"+h);

        }
    }
    var trace1 = {
        x: InfoAnalisis.ArrIngreso,
        y: InfoAnalisis.ArrayVisitas,
        text: InfoAnalisis.ArrText,
        mode: 'markers',
        marker: {
            color: InfoAnalisis.ArrColorGap,
            size: InfoAnalisis.ArrTamGap
        }
    };
    var data = [trace1];
    var layout = {
        title: 'Ventas VS Visitas VS GAP VS Enfriadores',
        showlegend: false,
        height: window.innerHeight*.9,
        width: window.innerWidth
    };

    var myPlot = document.getElementById('analisis'),
        d3 = Plotly.d3,
        data = [trace1],
        layout = {
                title: 'Ventas VS Visitas VS GAP VS Enfriadores',
                showlegend: false,
                height: window.innerHeight*.9,
                width: window.innerWidth
            };

    $( '#analisis' ).css( {"z-index":1 ,"position":"absolute", "height":"480px", "width":"480px"});

    Plotly.newPlot('analisis', data, layout);
    myPlot.on('plotly_click', function(data){
        var pts = '';
        for(var i=0; i < data.points.length; i++){
            pts = data.points[i].text;
        }
        cargarmodal(pts.substring(7),"m3");
    });
    setTimeout(function(){$('#analisis').fadeIn('slow');},250);
}

function inicio()
{
  $('#analisis').fadeOut('slow');
  $('#map').fadeIn('slow');
  $( '#analisis' ).css( {"z-index":-2 ,"position":"absolute", "height":"480px", "width":"480px"});
}



$(document).ready(function(){

     for(var key in usuariosmarker)
     {
          usuariosmarker[key].marker = new SlidingMarker({
                              position: {lat:usuariosmarker[key].latitud,lng:usuariosmarker[key].longitud},
                              map: map,
                              title: key,
                              duration: 4000,
                              icon: vendedor,
                              id_marker: key,
                              tipo:"vendedor",
                          });
          var mark=usuariosmarker[key].marker;
          google.maps.event.addListener(mark, 'click', (function(mark, key) {
                                                             return function() {
                                                               cargarmodal(key,"m1");

                                                             }
                                                         })(mark, key));
     }

     var url1 = window.location.href;
     var ur = url1.split("/");
     $('#filtroan > a').each(function () {
        if($(this).text().includes(String(ur[ur.length -2])))
            $(this).addClass('active');
        else
            $(this).removeClass('active');
     });

    init();
    anioActual = String(ur[ur.length -2]);
    $("#redir3").attr("href", "/MostrarGraficas/"+anioActual+"/1/99999/"+selactual);
    $("#fan").text("Año "+String(anioActual))
});

function selector(event)
{
if (event.target != this) {

if(event.target.id.localeCompare("SELLIN")==0)
    {

        selactual="semanal";
        $("#redir3").attr("href", "/MostrarGraficas/"+anioActual+"/1/99999/"+selactual);
    }
else
    {
        selactual="semanals";
        $("#redir3").attr("href", "/MostrarGraficas/"+anioActual+"/1/99999/"+selactual);
    }

}
}

function move()
{
 usuariosmarker['9684'].marker.setPosition({lat:18.9,lng:-99.2});
}

$( "#filtroclases" ).on('click', filtrado);
$( "#filtrogap" ).on('click', filtrado);
$( "#filtrocluster" ).on('click', filtrado);

function hidesym()
{
   if($("#legend").is(":hidden"))
       $("#legend").fadeIn('slow');
   else
       $("#legend").fadeOut('slow');
}


