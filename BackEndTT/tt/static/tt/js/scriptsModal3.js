<script>
var table="semanal",an=anioActual,mes="Todos",opci="mes";
var v1, v2, v3;
var anios=[];
var grafo = [];
var dibujos = [];
var recargar = false;
var ClusterActual;
var ModalImagen;
var anioAc = (new Date()).getFullYear();
var mesActual = (new Date()).getMonth();
var InfoStack =
   {
       Volumen:  [],
       Cantidad: [],
       VolumenGap: [],
       CantidadGap: []
   };
var infoGraficaDonut =
   {
       Volumen:  [0,0,0,0,0,0,0,0],
       Cantidad: [0,0,0,0,0,0,0,0],
       VolumenGap: [0,0,0,0,0,0,0,0],
       CantidadGap: [0,0,0,0,0,0,0,0]
   };
var labelsGraf = [];
var GraficasCorrelacion = {};
var GraficasMatriz = {};


function animation(numero){
var width = 1960,
    height = 700;

var fill = d3.scale.category10();
var colorsgap=['#FF0000','#00F600','F3CB52']
var nodes = [],
    foci = [{x: 900, y: 450}];

var svg = d3.select("#w_div").append("svg")
    .attr("width", width)
    .attr("height", height);

var force = d3.layout.force()
    .nodes(nodes)
    .links([])
    .gravity(0)
    .size([width, height])
    .on("tick", tick);

var node = svg.selectAll("circle");

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function tick(e) {
  var k = .04 * e.alpha;

  // Push nodes toward their designated focus.
  nodes.forEach(function(o, i) {
    o.y += (foci[o.id].y - o.y) * k;
    o.x += (foci[o.id].x - o.x) * k;
  });

  node
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
}

var interval = setInterval(function(){
 if(nodes.push({id: ~~(Math.random() * foci.length)})==numero) {
  clearInterval(interval)
  svg.style("opacity", 1)
  .transition()
  .duration(2000)
  .style("opacity", 0)
  };
  force.start();

  node = node.data(nodes);

  node.enter().append("circle")
      .attr("class", "node")
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", 8)
      .style("fill", function(d) { return colorsgap[getRandomInt(0,2)]; })
      .style("stroke", function(d) { return '#FFFFFF'; })
      .call(force.drag);


}, 8000/numero);

}

window.chartColors = {
              red: 'rgb(255, 99, 132)',
              orange: 'rgb(255, 159, 64)',
              yellow: 'rgb(255, 205, 86)',
              green: '#53c228',
              blue: 'rgb(54, 162, 235)',
              purple: 'rgb(153, 102, 255)',
              grey: 'rgb(201, 203, 207)',
              pink: 'rgb(255, 153, 153)'
                      //colorsbars
          };

function crearGraficaTreslinea(labels1, info1, info2, info3, idGrafica)
{
  new Chart(document.getElementById(idGrafica), {
    type: 'bar',
        data: {
          labels: labels1,
          datasets: [
            {
              label: "Pedido Sugerido 1",
              data: info2,
              borderColor: "#2eb82e",
              fill: false,
              type: 'line'
            },
            {
              label: "Pedido Sugerido 2",
              data: info3,
              borderColor: "#ff8533",
              fill: false,
              type: 'line'
            },
             {
                           label: "Pedido Original",
                           data: info1,
                           backgroundColor: "#00aaff",
                           fill: false
                         },]
        },
        options: {
          title: {
              display: false,
              text: ''
          },
          legend: { display: true }
        }
    });
}

function crearGraficaBarra(labels1, info1, idGrafica, idparent)
{
    $('#'+idGrafica).remove();
    $('#'+idparent).append("<canvas id="+idGrafica+" width=\"150\" height=\"35\"></canvas>");
    var temp = new Chart(document.getElementById(idGrafica), {
        type: 'bar',
          data: {
            labels: labels1,
            datasets: [ {
                label: " ",
                data: info1,
                backgroundColor: '#66a3ff'
              } ]
          },
          options: {
            title: {
                  display: false,
                  text: ''
            },
            legend: { display: false },
            scales: {
                        xAxes: [{
                            ticks: {
                                display: false
                            }
                        }]
                    }
          }
      });
    dibujos.push(temp);
    for(var h=0;h<info1.length;h++)
    {
        grafo.push(info1[h]);
    }
}

$(document).ready(function(){

$("#chosecanio").text(String(anioActual));
$("#canio").find("#"+String(anioActual)).addClass('active');
v1 = "{{ reco.visitas }}";
v2 = "{{ reco.recom_visitas }}";

t1 = v1.split(":");
t2 = v2.split(":");
cont = 0;
con2 = 0;
for(var i = 0; i < t2.length; i++ ){
   cont += parseInt(t2[i]);
}

for(var i = 0; i < t1.length; i++ ){
   con2 += parseInt(t1[i]);
}
cont = cont * 4;
con2 = con2 * 4;
v1 = con2;
v2 = cont;
v3 = (cont * 100 / parseInt(v1))-100;
$('#Visitas').text(v1);
$('#VisitasR').text(v2);
if(v3>=0)
    $('#VisitasP').text(v3.toFixed(2)+" %");
else
    $('#VisitasP').text("0 %");
if($('#VisitasR').text().localeCompare("NaN")==0)
{
    $('#VisitasR').text("0");
    $('#VisitasP').text("0 %");
}
else if($('#Visitas').text().localeCompare("0")==0)
    $('#VisitasP').text("0 %");
table="semanal";
recargarmodal(mes,an,"nombre_sku",table);
recargartabla(mes,an,opci,table);
$('#misventas').attr('onclick', 'csellin()');
ClusterActual = "{{info.cluster}}";
calendario();


    $('#canio > div').each(function () {
            anios.push($(this).text());
      });
      $('.ui.dropdown').dropdown();
});
$("#nombretienda").text("{{info.nombre_pdv}}");
$("#idtienda").text("{{info.id_pdv}}");
//$("#numprod").text("{{ info.cantidad_productos }}");


function clkcluster(){
    var idpdv1= "#modal"+{{ info.id_pdv }};
    $(idpdv1).fadeTo( "slow", 0 );
     borrar();
    $('#filtrocluster > a').each(function () {
                        if($(this).prop('id').localeCompare(({{ info.cluster }}).toString())==0)
                            $(this).addClass('active');
                    });
                    filtrado();
    //$(".ui.fullscreen.modal.event-modal.modalC.transition").modal("hide");
                    $("#particles-js").show();
                     particlesJS('particles-js',
                    {
                      "particles": {
                        "number": {
                          "value": 10,
                          "density": {
                            "enable": false,
                            "value_area": 1683.5826639087988
                          }
                        },
                        "color": {
                          "value": "#29a8b9"
                        },
                        "shape": {
                          "type": "circle",
                          "stroke": {
                            "width": 1,
                            "color": "#edf4f5"
                          },
                          "polygon": {
                            "nb_sides": 12
                          },
                          "image": {
                            "src": "img/github.svg",
                            "width": 100,
                            "height": 100
                          }
                        },
                        "opacity": {
                          "value": 0.5772283419115882,
                          "random": true,
                          "anim": {
                            "enable": false,
                            "speed": 1,
                            "opacity_min": 0.1,
                            "sync": false
                          }
                        },
                        "size": {
                          "value": 148.31561563006085,
                          "random": true,
                          "anim": {
                            "enable": true,
                            "speed": 153.4825931249542,
                            "size_min": 12.993235396821524,
                            "sync": false
                          }
                        },
                        "line_linked": {
                          "enable": true,
                          "distance": 1747.7191463434199,
                          "color": "#0808b6",
                          "opacity": 0.5932624625202434,
                          "width": 1.9240944730386271
                        },
                        "move": {
                          "enable": true,
                          "speed": 4.810236182596568,
                          "direction": "none",
                          "random": false,
                          "straight": false,
                          "out_mode": "out",
                          "bounce": false,
                          "attract": {
                            "enable": false,
                            "rotateX": 2966.312312601217,
                            "rotateY": 2966.312312601217
                          }
                        }
                      },
                      "interactivity": {
                        "detect_on": "canvas",
                        "events": {
                          "onhover": {
                            "enable": false,
                            "mode": "grab"
                          },
                          "onclick": {
                            "enable": false,
                            "mode": "push"
                          },
                          "resize": true
                        },
                        "modes": {
                          "grab": {
                            "distance": 400,
                            "line_linked": {
                              "opacity": 1
                            }
                          },
                          "bubble": {
                            "distance": 400,
                            "size": 40,
                            "duration": 2,
                            "opacity": 8,
                            "speed": 3
                          },
                          "repulse": {
                            "distance": 200,
                            "duration": 0.4
                          },
                          "push": {
                            "particles_nb": 4
                          },
                          "remove": {
                            "particles_nb": 2
                          }
                        }
                      },
                      "retina_detect": false
                    }

                    );
                    $( "body" ).append('<div class="ui active dimmer" id="w_div"  style="background: rgba(168,167,168,0.8);"><p align=\"center\" style=\"position: relative; color: white; top: 50%; transform: translateY(-50%); z-index:10000; font-size:24px;\">Clusterizando... Por favor espere.</p></div>');
                    if(parseInt($("#ctotal").text())>100)
                        animation(100);//$("#ctotal").text()
                    else
                        animation(parseInt($("#ctotal").text()));
  $("#ejecucion").removeClass("active");
  $("#sellin").removeClass("active");
  $("#sellout").removeClass("active");
  if(indexmodal.localeCompare("modalCluster")!=0 && indexmodal.localeCompare("modalFamilia")!=0)
  {
      $("#parteizquierda").remove();
      $("#cuerpodelmodal").remove();
      $("#partederecha").remove();
      $.ajax({
          url: "{% url "gepp:returnModal" %}",
          data: { 'id_pdv': {{ info.id_pdv }}, 'modal':"modal-fourn.html"},
          dataType: 'html',
          success: function(data){
            $('#principal').append(data);
            $("#distribucion").on("click",function(){
                   // $("#loader2").show();
                indexmodal="modalCluster";
                $.ajax({
                  url: "{% url "gepp:clusterdist" %}",
                  data: {'cluster':{{ info.cluster }}, 'tabla':table},
                  dataType: 'json',
                  success: function(data){
                    var labels2=data[4];

                    for(var i=0;i<data[5].length;i++)
                    {
                           $("#best"+(i+1)).text(data[5][i]);
                    }
                    for(var i=0;i<4;i++)
                      {
                        var info2=[];
                        for(var k in data[i])
                        {
                            var datos=JSON.parse(data[i][k]);
                            for( var cat in labels2)
                            {
                                if(k==0)
                                    info2.push(0);
                                //alert(datos['nombre']+" : "+labels2[cat])
                                if(datos['nombre'].localeCompare(labels2[cat])==0)
                                    info2[cat]=(parseInt(datos['venta']));
                            }


                        }
                        crearGraficaBarra(labels2,info2,"bar"+(i+1).toString(),"graf"+(i+1).toString());
                      }

                        //$("#loader2").fadeOut();
                  }
              });
            });

            $("#familia").on("click",function(){

                    //$("#loader2").show();
                indexmodal="modalFamilia";
                $.ajax({
                  url: "{% url "gepp:consultacluster" %}",
                  data: {'cluster':{{ info.cluster }}, 'tabla':table},
                  dataType: 'json',
                  success: function(data){;
                  for(var i=0; i<4; i++)
                  {
                    var info2=[];
                    var labels2 = [];
                    for(var j=0; j<14;j++)
                    {
                        var datos2 = JSON.parse(data[4][j]);
                         if(data[i][j]===undefined)
                            info2.push(0);
                        else
                            {
                                var datos = JSON.parse( data[i][j]);
                                info2.push(parseInt(datos['venta']));
                            }


                        labels2.push(datos2['id']+" : "+datos2['nombre']);
                    }

                    crearGraficaBarra(labels2,info2,"bar"+(i+1).toString(),"graf"+(i+1).toString());
                  }
                  for(var i=0; i<data[5].length;i++)
                  {
                    var datos = JSON.parse(data[5][i]);
                    $("#best"+(i+1)).text(datos['nombre']);
                  }

                        //$("#loader2").fadeOut();

                  }});
            });

            document.getElementById("familia").click();
          }});
  }
   setTimeout(function(){
  $( "#w_div" ).remove();
  $("#particles-js").fadeOut('slow');
  $(idpdv1).fadeTo( "slow", 1 );},10000);
  }

$("#ejecucion").on('click',function(){
  var Nombre;

  $("#ejecucion").addClass("active");
  $("#sellin").removeClass("active");
  $("#sellout").removeClass("active");
  if(indexmodal.localeCompare("modalEjecucion")!=0) //(indexmodal!=2)
  {
      cargaParte("moda-2-3-izq.html","indexmodal.localeCompare('modalCluster') == 0 || indexmodal.localeCompare('modalFamilia')==0 || indexmodal.localeCompare('modalAnalisis')==0");
      //$("#parteizquierda").remove();
      $("#cuerpodelmodal").remove();
      $("#partederecha").remove();
      $.ajax({
          url: "{% url "gepp:returnModal" %}",
          data: { 'id_pdv': {{ info.id_pdv }}, 'modal':"modal-two.html"},
          dataType: 'html',
          success: function(data){
                table="semanal";
                an=anioActual;
                mes="Todos";
                opci="mes";
                recargartabla(mes,an,opci,table);
                indexmodal="modalEjecucion"; //1
              $('#principal').append(data);
              $("#content-slider").hide();
              $("#direccionejecucion").text("{{ info.pdv_nombre_municipio }}, {{ info.pdv_nombre_estado }}");
              $.ajax({
                url: "{% url "gepp:Ejecucion" %}",
                data: { 'id_pdv': {{ info.id_pdv }} },
                dataType: 'json',
                success: function(data){
                    var info_pdv = data[0];
                    var info_user = data[1];
                    info_user = JSON.parse(info_user[0]);
                    info_pdv = JSON.parse(info_pdv[0]);
                    ModalImagen ="<div class=\"ui fullscreen event-modal modal transition\" id=\"modalgaleria\" style=\"z-index:1000000; position:absolute; right:0px; padding:10px;\">"+

                    "<div class=\"content\">"+
                        " <div class=\"bxslider\">";

                    for (var i = 1; i <= info_pdv['images'].length; i++)
                    {
                        $('#GaleriaFinal').append("<div class=\"row pa1-auto\"> <img  src=\""+info_pdv['images'][i-1]+"\" onclick=\"imagen('imagen"+i+"')\" width=\"100%\" height=\"120\" /> </div>");
                        ModalImagen+="<div><center><img src=\""+info_pdv['images'][i-1]+"\" width=\""+$(window).width()+"\" height=\""+$(window).height()*0.8+"\" /></center></div>";
                    }
                    var infoGraficaFinal = [];
                    for (var i = 0; i < info_pdv['exhibiciones_grafica'].length; i++)
                    {
                        infoGraficaFinal.push(info_pdv['exhibiciones_grafica'][i]['si']);
                    }

                    ModalImagen+=" </div>"+
                    "</div>"+
                    "<div class=\"ui bottom attached button blue\" tabindex=\"0\" onclick= \"CerrarModal()\" >Cerrar</div>" +
                    "</div>";

                    $('#NombreUs').text(info_user['usuario']);
                    $('#rol').text(info_user['usuario_rol']);
                    $('#graf1').text(info_pdv['exhibiciones'][0]['exhibicion']);
                    $('#graf2').text(info_pdv['exhibiciones'][1]['exhibicion']);
                    $('#graf3').text(info_pdv['exhibiciones'][2]['exhibicion']);
                    $('#graf4').text(info_pdv['exhibiciones'][3]['exhibicion']);
                    var Nombres=[];
                    var grafica = {};
                    var lab = ["0","5","10","15","20","25"];
                    for(var i = 0; i < 4; i ++)
                        {
                            Nombres.push(info_pdv['exhibiciones'][i]['exhibicion']);
                            grafica[Nombres[i]] = {x:[], y:[]};
                        }
                    for(var i = 0; i < info_pdv['exhibiciones'].length; i++)
                    {

                        if(Nombres.includes(info_pdv['exhibiciones'][i]['exhibicion']))
                        {
                            grafica[info_pdv['exhibiciones'][i]['exhibicion']].x.push(info_pdv['exhibiciones'][i]['si']);
                            grafica[info_pdv['exhibiciones'][i]['exhibicion']].y.push(info_pdv['exhibiciones'][i]['no']);

                        }
                    }
                    for(var i = 0; i < 4; i ++)
                    {
                            //crearGraficaLinea(lab, grafica[Nombres[i]].x,"line"+(i+1),"myGraf"+(i+1));
                            BarraLineaPlotly(grafica[Nombres[i]].x,grafica[Nombres[i]].y,"line"+(i+1));

                    }
                    crearGraficaLinea(lab, infoGraficaFinal, "multiaxis", "myGrafFinal");



                    $("#content-slider").lightSlider({
                            loop: true,
                            keyPress: true
                        });
                    $("#content-slider").show()
                    $('#checkin').text(info_pdv['check_in']);
                    $('#checkout').text(info_pdv['check_out']);
                }
              });
          }
      });
  }
});

$("#sellout").on('click',csellout);

function BarraLineaPlotly( infox,infoy, divG)
{
var trace1 = {
  x: infox,
  y: infoy,
  type: 'scatter'
};


var layout = {
        title:"Relación de visitas por mes",
        titlefont: {
            size: 12
          },
        yaxis:{
              title:'PROSPECTOS',titlefont:
             {
               size:8,
               color:'#7f7f7f'
             },
             range: [0, 50],

          },
      xaxis:{
             title:'DIA DEL MES',
             titlefont:
             {
               size:8,
               color:'#7f7f7f'
             },
             range: [0, 50],
         },
        showlegend: false,
        autosize:false,
        width: 165,
        height: 125,
        margin: {
           l: 35,
           r: 5,
           b: 35,
           t: 25,
           pad:4
         },
    };
var data = [trace1];

Plotly.newPlot(divG, data,layout,{displayModeBar: false});
}

function csellout(){
  recargar = false;
  $("#ejecucion").removeClass("active");
  $("#sellin").removeClass("active");
  $("#sellout").addClass("active");
  if(indexmodal.localeCompare("modalSellin")!=0 || indexmodal.localeCompare("modalSellout")!=0)
  {
    if(indexmodal.localeCompare("modalSellout")!=0)
        $("#loader2").show();
    $("#cuerpodelmodal").remove();
    $("#partederecha").remove();
    cargaParte("moda-2-3-izq.html","indexmodal.localeCompare('modalCluster') == 0 || indexmodal.localeCompare('modalFamilia')==0 || indexmodal.localeCompare('modalAnalisis')==0");
    $.ajax({
          url: "{% url "gepp:returnModal" %}",
          data: { 'id_pdv': {{ info.id_pdv }}, 'modal':"modal-threen.html"},
          dataType: 'html',
          success: function(data){
            indexmodal="modalSellout";
              $('#principal').append(data);
              table="semanals";
              an=anioActual;
              mes="Todos";
              opci="mes";
              recargarmodal(mes,an,"nombre_sku",table);
              recargartabla(mes,an,opci,table);

              $('#misventas').attr('onclick', 'csellout()');
              $('#calendar').pignoseCalendar();
              $('#Visitas').text(v1);
              $('#VisitasR').text(v2);
              if(v3>=0)
                  $('#VisitasP').text(v3.toFixed(2)+" %");
              else
                  $('#VisitasP').text("0 %");
              if($('#VisitasR').text().localeCompare("NaN")==0)
                  {
                      $('#VisitasR').text("0")
                      $('#VisitasP').text("0 %")
                  }
                  else if($('#Visitas').text().localeCompare("0")==0)
                                                          $('#VisitasP').text("0 %")
                  calendario();
                  for( var x in anios)
                  {
                      if(anios[x].localeCompare(String(anioActual))==0)
                          $('#canio').append("<div class=\"item active\" id=\""+anios[x]+"\">"+anios[x]+"</a>");
                      else
                          $('#canio').append("<div class=\"item\" id=\""+anios[x]+"\">"+anios[x]+"</a>");
                  }
                  $("#chosecanio").text(String(anioActual));
                  $("#canio").find("#"+String(anioActual)).addClass('active');
                  $('.ui.dropdown').dropdown();
}
      });

  }
  else
  {
        table="semanals";
        recargarmodal(mes,an,"nombre_sku",table);
        recargartabla(mes,an,opci,table);
  }

}

$("#sellin").on('click',csellin);

function csellin(){

  recargar = false;
  $("#sellin").addClass("active");
  $("#sellout").removeClass("active");
  $("#ejecucion").removeClass("active");
  if(indexmodal.localeCompare("modalSellin")!=0 || indexmodal.localeCompare("modalSellout")!=0)
    {
    if(indexmodal.localeCompare("modalSellin")!=0)
            $("#loader2").show();

      cargaParte("moda-2-3-izq.html","indexmodal.localeCompare('modalCluster') == 0 || indexmodal.localeCompare('modalFamilia')==0 || indexmodal.localeCompare('modalAnalisis')==0");

      //$("#parteizquierda").remove();
      $("#cuerpodelmodal").remove();
      $("#partederecha").remove();
      $.ajax({
            url: "{% url "gepp:returnModal" %}",
            data: { 'id_pdv': {{ info.id_pdv }}, 'modal':"modal-threen.html"},
            dataType: 'html',
            success: function(data){
              indexmodal="modalSellin";
                $('#principal').append(data);
                $('#misventas').attr('onclick', 'csellin()');
                table="semanal";
                  an=anioActual;
                  mes="Todos";
                  opci="mes";
                recargarmodal(mes,an,"nombre_sku",table);
                recargartabla(mes,an,opci,table);
                $('#calendar').pignoseCalendar();
                $('#Visitas').text(v1);
                $('#VisitasR').text(v2);
                if(v3>=0)
                    $('#VisitasP').text(v3.toFixed(2)+" %");
                else
                    $('#VisitasP').text("0 %");
                if($('#VisitasR').text().localeCompare("NaN")==0)
                    {
                        $('#VisitasR').text("0")
                        $('#VisitasP').text("0 %")
                    }
                     else if($('#Visitas').text().localeCompare("0")==0)
                                        $('#VisitasP').text("0 %")
                    calendario();

                    for( var x in anios)
                  {
                      if(anios[x].localeCompare(String(anioActual))==0)
                          $('#canio').append("<div class=\"item active\" id=\""+anios[x]+"\">"+anios[x]+"</a>");
                      else
                          $('#canio').append("<div class=\"item\" id=\""+anios[x]+"\">"+anios[x]+"</a>");
                  }
                  $("#chosecanio").text(String(anioActual));
                  $("#canio").find("#"+String(anioActual)).addClass('active');
                  $('.ui.dropdown').dropdown();
            }
        });
    }
    else
    {
        table="semanal";
          recargarmodal(mes,an,"nombre_sku",table);
          recargartabla(mes,an,opci,table);
    }

}

function recargartabla(mes,an,opcion,tabla)
{
    $("#igb").css('color','');
    $("#igbp").css('color','');
    $("#valorgap").css('color','');
    $("#porcegap").css('color','');
   $.ajax({
      url: "{% url "gepp:recargar" %}",
      data: { 'mes': mes , 'id_pdv': {{ info.id_pdv }}, 'anio': an, 'opc':opcion, 'tabla':tabla},
      dataType: 'json',
      success: function(data){
      var cuerpo=""; // html cuerpo tabla ventas
      var cuerpop=""; //html cuerpo tabla potencial
      var cabecera=""; // titulos de la tabla
      var contador=0;
      var gappor=0; //porcentaje del gap
      var gapval=0; // valor del gap
      var ventasval=0; // valor de ventas(ingreso bruto)
      var potval=0; // valor potencial de ventas
      var infoGraficaVentas= []; // informacion para la grafica de ventas
      var infoGraficaPot = []; // informacion para la grafica de potencial
      var infoGraficaVentasP = []; // informacion para la grafica de predicción de ventas
      var infoGraficaPotP = []; // informacion para la grafica de predicción de potencial
      var labels = []; //cabeceras de las graficas
      var bandera = false;

        if(mes.localeCompare("Todos")!=0)
          {
            for(var j=1;j<=5;j++)
            {
                contador=5;
                cabecera+="\n<th class=\"noborder backgroundgrey1 padtopbottom\"><center>SEMANA "+j+"</center></th>";
                labels.push("Semana" + j);
            }
            bandera=false;
          }
          else
          {
          var indix=1,indix2=1;
            var dictmeses = [
               "ENERO",
               "FEBRERO",
               "MARZO",
               "ABRIL",
               "MAYO",
               "JUNIO",
               "JULIO",
               "AGOSTO",
               "SEPTIEMBRE",
               "OCTUBRE",
               "NOVIEMBRE",
               "DICIEMBRE"
            ];
            for(var j=0;j<12;j++)
            {
                contador=12;
                cabecera+="\n<th class=\"noborder backgroundgrey1 padtopbottom\"><center>"+dictmeses[j]+"</center></th>";
                labels.push(dictmeses[j]);
            }
            bandera=true;
          }
        var mcont=0;
        for(var i=0;i<data.length;i++)
        {
          var datos=JSON.parse(data[i]);
          indix=parseInt(datos['nombre']);
          if(mes.localeCompare("Todos")==0)
              for(var j=indix2;j<indix;j++)
                  {
                    mcont++;
                      infoGraficaVentas.push(parseFloat(0));
                      infoGraficaVentasP.push(0);
                      infoGraficaPot.push(parseFloat(0));
                      infoGraficaPotP.push(0);
                    cuerpo+="\n<td class=\"padtopbottom backgroundgreensweet noborder\"><center>$ 0</center></td>";
                    cuerpop+="\n<td class=\"padtopbottom backgroundorangesweet noborder\"><center>$ 0</center></td>";
                  }
          for(var llave in datos)
          {
            var valor=datos[llave];
            if(llave.localeCompare("sumaib")==0)
            {
                mcont++;
              valor=parseFloat(valor).toFixed(2);
              ventasval+=parseFloat(valor);
              if(valor < 0)
                valor = 0;
              if(an < anioAc && bandera == true)
              {
               infoGraficaVentas.push(parseFloat(valor));
               infoGraficaVentasP.push(0);
              }
              else
              {
               if(bandera){
               if( datos['nombre'] <= mesActual + 1 )
                   infoGraficaVentas.push(parseFloat(valor));
               else
                   infoGraficaVentasP.push(1000);
               }
               else
                   infoGraficaVentas.push(parseFloat(valor));
              }

              cuerpo+="\n<td class=\"padtopbottom backgroundgreensweet noborder\"><center>"+coinfor(valor,"$")+"</center></td>"
            }
            else if(llave.localeCompare("sumaibp")==0)
            {
              valor=parseFloat(valor).toFixed(2);
              potval+=parseFloat(valor);
              if(valor < 0)
                valor = 0;
              if(an < anioAc && bandera == true)
              {
               infoGraficaPot.push(parseFloat(valor));
               infoGraficaPotP.push(0);
              }
              else
              {
               if(bandera){
               if( datos['nombre'] <= mesActual + 1 )
                   infoGraficaPot.push(parseFloat(valor));
               else
                   infoGraficaPotP.push(1000);
               }
               else
                   infoGraficaPot.push(parseFloat(valor));
              }

              cuerpop+="\n<td class=\"padtopbottom backgroundorangesweet noborder\"><center>"+coinfor(valor,"$")+"</center></td>"
            }

          }
          indix2=parseInt(datos['nombre'])+1;
        }
            for(var i=0;i<contador-mcont;i++)
            {
            infoGraficaVentas.push(parseFloat(0));
            infoGraficaVentasP.push(0);
            infoGraficaPot.push(parseFloat(0));
            infoGraficaPotP.push(0);
             cuerpo+="\n<td class=\"padtopbottom backgroundgreensweet noborder\"><center>$ 0</center></td>";
             cuerpop+="\n<td class=\"padtopbottom backgroundorangesweet noborder\"><center>$ 0</center></td>";
            }

        $("#ventas").replaceWith("<tr class=\"backgroundgreensweet noborder\" id=\"ventas\"><td class=\"backgroundgreen padtopbottom noborder\">Ventas</td>\n"+cuerpo+"</tr>");
        $("#potencial").replaceWith("<tr class=\"backgroundorangesweet noborder\" id=\"potencial\"><td class=\"backgroundorange padtopbottom noborder\">Potencial</td>\n"+cuerpop+"</tr>");
        $("#columnas").replaceWith("<tr id=\"columnas\"><th class=\"noborder backgroundgrey1 padtopbottom\"></th>\n"+cabecera+"</tr>");
        $("#igb").text(coinfor(ventasval,"$"));
        potval=parseFloat(potval).toFixed(2);
        $("#igbp").text(coinfor(potval,"$"));
        gapval=potval-ventasval;
        if(gapval < 0)
          gapval = 0;
        gapval=parseFloat(gapval).toFixed(2);

        gappor=parseFloat(gapval)*100/ventasval;
        if(isFinite(gappor)==false)
        {
            gappor=0;
        }


        if(gappor < 0)
          gappor = 0;

        gappor=parseFloat(gappor).toFixed(2);
        $("#valorgap").text(coinfor(gapval,"$"));
        $("#porcegap").text("%"+gappor);
        crearGraficaBarraLinea(labels, infoGraficaVentas, infoGraficaPot,infoGraficaVentasP,infoGraficaPotP, "lineChart-mod2");
        if(parseFloat(gappor) > 45 )
          {
            $("#valorgap").css('color','#cc0000');
            $("#porcegap").css('color','#cc0000');
          }
          else if(parseFloat(gappor) >= 25 && parseFloat(gappor) <= 45)
          {
            $("#valorgap").css('color','#cca300');
            $("#porcegap").css('color','#cca300');
          }
          else if(parseFloat(gappor) < 25 )
          {
            $("#valorgap").css('color','#669900');
            $("#porcegap").css('color','#669900');
          }
        if($("#igb").text().localeCompare("$0.00")==0)
        {
            $("#igb").css('color','#cc0000');
            $("#igbp").css('color','#cc0000');
            $("#valorgap").css('color','#cc0000');
            $("#igb").text("Sin Datos");
            $("#igbp").text("Sin Datos");
            $("#valorgap").text("Sin Datos");

        }


        $("#loader2").fadeOut("slow");
      }
     });
}

function recargarmodal(mes,an,opcion,tabla)
{
  $.ajax({
      url: "{% url "gepp:recargar" %}",
      data: { 'mes': mes , 'id_pdv': {{ info.id_pdv }}, 'anio': an, 'opc':opcion, 'tabla':tabla},
      dataType: 'json',
      success: function(data){
      reloadmodal("datos",data);
      }
  });
}

function crearGraficaBarraLinea(labels1, infoVentas, infoPot, infoVentasP,infoPotP, idGrafica)
{
  $('#'+idGrafica).remove();
  $('#divGrafica').append("<canvas id="+idGrafica+" style=\"width:100%;height:auto;\"></canvas>");

 new Chart(document.getElementById(idGrafica), {
     type: 'bar',
     data: {
       labels: labels1,
       datasets: [
         {
           label: "Potencial",
           data: infoPot,
           borderColor: "#ff6600",
           fill: false,
           type:'line'
         },
         {
          label: "Predicción de Potencial",
          data: infoPotP,
          borderColor: "#ffff33",
          fill: false,
          type:'line'
        },
          {
         label: "Predicción de Ventas",
         data: infoVentasP,
         backgroundColor: "#3333ff"

       },
    {
       label: "Ventas",
      data: infoVentas,
      backgroundColor: "#2aa22a"
        },
       ]

     },
     options: {
       title: {
         display: false,
         text: ''
       },

       legend: { display: true }
     }
 });
}

function coinfor(n, currency) {
  return currency + parseFloat(n).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
}

function cargaParte (parte, condicion)
{
    if(eval(condicion))
    {
        $("#parteizquierda").remove();
        $.ajax({
          url: "{% url "gepp:returnModal" %}",
          data: { 'id_pdv': {{ info.id_pdv }}, 'modal':parte},
          dataType: 'html',
          success: function(data){
            $("#principal").prepend( data );
            //$("#numprod").text("{{ info.cantidad_productos }}");
          }});


    }
}

function recargaclicks(event, menu)
{

    if (event.target != this) {

    $('#'+menu+' > div').each(function () {
      if($(this).hasClass('active'))
      {
        $("#chose"+menu).text($(this).text());
        if(menu.localeCompare("canio")==0)
              an=$(this).prop('id');
          else
              mes=$(this).prop('id');
      }

    });
    if(menu.localeCompare("canio")==0)
    {
        mes=event.target.id;
        if(event.target.id.localeCompare("Todos")==0)
            opci="mes";
        else
            opci="numero_semana";
        $("#chosecmes").text(mes);
    }

    else
    {
        an=event.target.id;
        if(mes.localeCompare("Todos")==0)
            opci="mes";
        else
            opci="numero_semana";
        $("#chosecanio").text(an);

    }

    recargarmodal(mes,an,"nombre_sku",table);
    recargartabla(mes,an,opci,table);
  }
}

function escalagrafica(tipo)
{
    for(var indices=0;indices<dibujos.length;indices++)
    {

        if(tipo==2)
        {
            dibujos[indices].options.scales.yAxes[0].ticks.max = Math.round(Math.max.apply(null,grafo)/1000)*1000;
            dibujos[indices].options.scales.yAxes[0].ticks.stepSize = Math.round(Math.max.apply(null,grafo)/1000)*1000/4;
        }

        else
        {
            dibujos[indices].options.scales.yAxes[0].ticks.max = undefined;
            dibujos[indices].options.scales.yAxes[0].ticks.stepSize = undefined;

        }
        dibujos[indices].update();
    }
}

function calcpedido()
{
   if(indexmodal.localeCompare("modalPedido")!=0)
   {
       $("#cuerpodelmodal").remove();
       $("#partederecha").remove();
       $.ajax({
           url: "{% url "gepp:returnModal" %}",
           data: { 'id_pdv': {{ info.id_pdv }}, 'modal':"modal-fiven.html"},
           dataType: 'html',
           success: function(data){
               indexmodal="modalPedido";
               $('#principal').append(data);

               $.ajax({
                   url: "{% url "gepp:pedido" %}",
                   data: { 'id_pdv': {{ info.id_pdv }},'tabla':table},
                   dataType: 'json',
                   success: function(infod){
                       reloadmodal("datos1",infod);
                       reloadmodal("datos2",infod);
                       reloadmodal("datos3",infod);
                       graficaspedido();
                       $('#pedido1').find('tr').click(getrow);
                       $('#pedido2').find('tr').click(getrow);
                       $('#pedido3').find('tr').click(getrow);

                   }
               });
           }
       });
   }
}

function reloadmodal(idmodal,data)
{
    if(idmodal.localeCompare("datos")==0)
        var cond="llave.localeCompare(\"sumaib\")!=0 && llave.localeCompare(\"sumaibp\")!=0 && llave.localeCompare(\"ibfinal\")!=0 && llave.localeCompare(\"preciosku\")!=0 && llave.localeCompare(\"skur\")!=0 && llave.localeCompare(\"skurc\")!=0 && llave.localeCompare(\"skurp\")!=0";
    else if(idmodal.localeCompare("datos1")==0)
        var cond="llave.localeCompare(\"ibpavg\")!=0 && llave.localeCompare(\"cantidadp\")!=0 && llave.localeCompare(\"preciop\")!=0 && llave.localeCompare(\"preciosku\")!=0 && llave.localeCompare(\"skur\")!=0 && llave.localeCompare(\"skurc\")!=0 && llave.localeCompare(\"skurp\")!=0";
    else if(idmodal.localeCompare("datos2")==0)
        var cond="llave.localeCompare(\"ibavg\")!=0 && llave.localeCompare(\"cantidad\")!=0 && llave.localeCompare(\"precio\")!=0 && llave.localeCompare(\"preciosku\")!=0 && llave.localeCompare(\"skur\")!=0 && llave.localeCompare(\"skurc\")!=0 && llave.localeCompare(\"skurp\")!=0";
    else if(idmodal.localeCompare("datos3")==0)
        var cond="llave.localeCompare(\"ibpavg\")!=0 && llave.localeCompare(\"cantidadp\")!=0 && llave.localeCompare(\"preciop\")!=0 ";
    var cuerpo="";
    var clase="";

    for(var i=0;i<data.length;i++)
    {
       var aux=0;
       var datos=JSON.parse(data[i]);
       var porcgap = parseFloat(datos['porcengap']);
          if(isFinite(porcgap)==false)
          {
              porcgap=0;
          }
       if(idmodal.localeCompare("datos1")==0 || idmodal.localeCompare("datos2")==0 || idmodal.localeCompare("datos3")==0)
             cuerpo+="<tr style=\"cursor: pointer;\">";
           else
             cuerpo+="<tr>";
      if(porcgap < 0)
        porcgap = 0;
      if(porcgap > 45 )
      {
        clase="fontred";

      }
      else if(porcgap >= 25 && porcgap <= 45)
      {
        clase="fontyellow";
      }
      else if(porcgap < 25 )
      {
        clase="fontgreen";
      }
      else
      {
        continue;
      }

      for(var llave in datos)
      {
          if(eval(cond))
          {

          var valor=datos[llave];
          if(idmodal.localeCompare("datos3")==0 && datos['skur'].localeCompare("")!=0)
            if(llave.localeCompare("cantidad")==0 || llave.localeCompare("precio")==0)
                valor/=2;
          if(aux==1)
            {
              if(datos['skur'].localeCompare("")!=0)
              {
                  if(llave.localeCompare("skur")==0)
                    {
                    if(idmodal.localeCompare("datos1")==0 || idmodal.localeCompare("datos2")==0 || idmodal.localeCompare("datos3")==0)
                                               cuerpo+="</tr><tr style=\"cursor: pointer;\">";
                                             else
                                               cuerpo+="</tr><tr>";
                    }
                  if(llave.localeCompare("skurp")==0 || llave.localeCompare("preciosku")==0)
                  {
                    valor=parseFloat(valor).toFixed(2);
                    cuerpo+="<td class=\"fontgreen\">"+coinfor(valor,"$")+"</td>\n";
                  }
                  else
                    cuerpo+="<td class=\"fontgreen\">"+valor+"</td>\n";
                  if(llave.localeCompare("skurc")==0)
                      cuerpo+="<td class=\"fontgreen\">"+porcgap.toFixed(2)+"%</td>\n";
              }
              else
                 break;

            }
            else
            {
            if(llave.localeCompare("nombre")!=0)
                      {
                        valor=parseFloat(valor).toFixed(2);
                        if(valor < 0)
                          valor = 0;
                      }


                      if(llave.localeCompare("cantidad")!=0 && llave.localeCompare("cantidadp")!=0 && llave.localeCompare("gapcantidad")!=0 && llave.localeCompare("nombre")!=0 && llave.localeCompare("porcengap")!=0)
                            cuerpo+="<td class="+clase+">"+coinfor(valor,"$")+"</td>\n";
                      else if(llave.localeCompare("porcengap")==0)
                            {
                                aux=1;
                                cuerpo+="<td class="+clase+">"+porcgap.toFixed(2)+"%</td>\n";
                            }
                      else
                        cuerpo+="<td class="+clase+">"+valor+"</td>\n";
            }


          }
      }
      cuerpo+="</tr>";

    }
    $("#"+idmodal).replaceWith("<tbody class=\"font11\" id=\""+idmodal+"\">"+cuerpo+"</tbody>");

}

function graficaspedido()
{
$.ajax({
      url: "{% url "gepp:recargar" %}",
      data: { 'mes': "Pedido" , 'id_pdv': {{ info.id_pdv }}, 'anio': anioActual, 'opc':"numero_semana", 'tabla':table},
      dataType: 'json',
      success: function(data){
        var infoGraficaVentas= []; // informacion para la grafica de ventas
        var infoGraficaPot = []; // informacion para la grafica de potencial
        var infop3 = []; // informacion para la grafica de potencial
        var labels = ["Semana 1","Semana 2","Semana 3","Semana 4","Semana 5"]; //cabeceras de las graficas
      for(var i=0;i<data.length;i++)
              {
                var datos=JSON.parse(data[i]);
                for(var llave in datos)
                {

                  var valor=datos[llave];
                  if(llave.localeCompare("sumaib")==0)
                  {
                    valor=parseFloat(valor).toFixed(2);
                    if(valor < 0)
                      valor = 0;
                    infoGraficaVentas.push(parseFloat(valor));
                  }
                  else if(llave.localeCompare("sumaibp")==0)
                  {
                    valor=parseFloat(valor).toFixed(2);
                    if(valor < 0)
                      valor = 0;
                    infoGraficaPot.push(parseFloat(valor));
                  }
                  else if(llave.localeCompare("ibfinal")==0)
                    {
                      valor=parseFloat(valor).toFixed(2);
                      if(valor < 0)
                        valor = 0;
                      infop3.push(parseFloat(valor));
                    }

                }
              }
              crearGraficaTreslinea(labels, infoGraficaVentas, infoGraficaPot, infop3, "treslineas2")

      }
     });
}

function MostrarPotencial()
{

   $('#grafpastel').text("Distribucion del Potencial");
   $('#grafstack').text("Distribucion del Potencial");

  var infoGrafica = [];
  var infoGrafica2 = [];
  var infoGraficaG = [];
  var infoGraficaG2 = [];
  var aniosT = [];

  if(indexmodal.localeCompare("modalPotencial")!=0 && indexmodal.localeCompare("modalGap")!=0){
  $.ajax({
        url: "{% url "gepp:returnModal" %}",
        data: { 'id_pdv': {{ info.id_pdv }}, 'modal':'modal-potencial.html'},
        dataType: 'html',
        success: function(data){
              $("#partederecha").remove();
              $("#cuerpodelmodal").replaceWith( data );
              $('#filtroan > a').each(function () {
                    if($(this).hasClass('active'))
                        $('#filtroanioS').append("<a href=\"#\" class=\"item active\" id=\""+$(this).prop('id')+"\">"+$(this).prop('id')+"</a>");
                    else
                        $('#filtroanioS').append("<a href=\"#\" class=\"item\" id=\""+$(this).prop('id')+"\">"+$(this).prop('id')+"</a>");
              });

              indexmodal="modalPotencial";
              $("#fanio").text(String(anioActual));
              $("#fvol").text("Cantidad");
              $("#Cantidad").addClass('active');
              $("#Volumen").removeClass('active');


        }
  });
  if(recargar == false){
     CargarInfoGAP_Potencial("Cantidad", anioActual);
     recargar = true;

     }
     else
       {
           setTimeout(function(){

                $("#fanio").text(String(anioActual));
                $("#fvol").text("Cantidad");
                $("#Cantidad").addClass('active');
                $("#Volumen").removeClass('active');
               crearGraficaDonut(labelsGraf, infoGraficaDonut.Cantidad, "graficaDonut");
               crearGraficaBarraStack(labelsGraf, InfoStack.Cantidad, "graficaBarrasStack");
           },250);
       }
  }
  else if(indexmodal.localeCompare("modalGap")==0)
  {

      $("#fanio").text($("#filtroanioS").find(".item.active").text());
      $("#fvol").text("Cantidad");
      $("#Cantidad").addClass('active');
      $("#Volumen").removeClass('active');
      crearGraficaDonut(labelsGraf, infoGraficaDonut.Cantidad, "graficaDonut");
      crearGraficaBarraStack(labelsGraf, InfoStack.Cantidad, "graficaBarrasStack")
      indexmodal="modalPotencial"
  }
}

function MostrarGAP()
{
   $('#grafpastel').text("Distribucion del GAP");
   $('#grafstack').text("Distribucion del GAP");

  var infoGrafica = [];
  var infoGrafica2 = [];
  var infoGraficaG = [];
  var infoGraficaG2 = [];
   if(indexmodal.localeCompare("modalPotencial")!=0 && indexmodal.localeCompare("modalGap")!=0){
   $.ajax({
        url: "{% url "gepp:returnModal" %}",
        data: { 'id_pdv': {{ info.id_pdv }}, 'modal':'modal-potencial.html'},
        dataType: 'html',
        success: function(data){
              $("#partederecha").remove();
              $("#cuerpodelmodal").replaceWith( data );
              $('#filtroan > a').each(function () {
                  $('#filtroanioS').append("<a href=\"#\" class=\"item\" id=\""+$(this).prop('id')+"\">"+$(this).prop('id')+"</a>");
              });
              indexmodal="modalGap";
              $("#fanio").text(String(anioActual));
             $("#fvol").text("Cantidad");
             $("#Cantidad").addClass('active');
             $("#Volumen").removeClass('active');
        }
  });
  if(recargar == false){

       CargarInfoGAP_Potencial("CantidadGap", anioActual);
       recargar = true;
     }
     else
     {
       setTimeout(function(){
       $("#fanio").text($("#filtroanioS").find(".item.active").text());
       $("#fvol").text("Cantidad");
       $("#Cantidad").addClass('active');
       $("#Volumen").removeClass('active');
               crearGraficaDonut(labelsGraf, infoGraficaDonut.CantidadGap, "graficaDonut");
               crearGraficaBarraStack(labelsGraf, InfoStack.CantidadGap, "graficaBarrasStack");
           },250);

     }
  }
  else if(indexmodal.localeCompare("modalPotencial")==0)
  {
    $("#fanio").text($("#filtroanioS").find(".item.active").text());
    $("#fvol").text("Cantidad");
    $("#Cantidad").addClass('active');
    $("#Volumen").removeClass('active');
      crearGraficaDonut(labelsGraf, infoGraficaDonut.CantidadGap, "graficaDonut");
      crearGraficaBarraStack(labelsGraf, InfoStack.CantidadGap, "graficaBarrasStack")
      indexmodal="modalGap";
  }
}




function CargarInfoGAP_Potencial(tipo,anioCons)
{

    $.ajax({
         url: "{% url "gepp:ConsultaPotencial" %}",
         data: { 'id_pdv': {{ info.id_pdv }}, 'modal':'modal-potencial.html', 'categoria': table, 'anio': anioCons},
         dataType: 'json',
         success: function(data){

                 infoGraficaDonut.Volumen =  [0,0,0,0,0,0,0,0];
                 infoGraficaDonut.Cantidad=[0,0,0,0,0,0,0,0];
                 infoGraficaDonut.VolumenGap= [0,0,0,0,0,0,0,0];
                 infoGraficaDonut.CantidadGap= [0,0,0,0,0,0,0,0];
                 InfoStack.Volumen=[];
                 InfoStack.Cantidad=[];
                 InfoStack.VolumenGap=[];
                 InfoStack.CantidadGap=[];
               infoGrafica = [0,0,0,0,0,0,0,0,0,0,0,0,0];
               infoGrafica2 = [0,0,0,0,0,0,0,0,0,0,0,0,0];
               infoGraficaG = [0,0,0,0,0,0,0,0,0,0,0,0,0];
               infoGraficaG2 = [0,0,0,0,0,0,0,0,0,0,0,0,0];

               labelsGraf = [];
               var aux=0;
               var cont = 0;

               for (var index=0;index<data[1].length; index++)
               {
                   if(cont == 8)
                       break;
                   var datos = JSON.parse(data[1][index]);
                   if(aux==0)
                       var indice = datos['nombre']['sku'];
                   for(var llave in datos)
                   {

                       if(llave.localeCompare("nombre")==0)
                       {
                           if(datos[llave]['sku'].localeCompare(indice) == 0)
                           {

                               if(aux==0)
                                   labelsGraf.push(datos[llave]['sku']);

                               infoGraficaDonut.Cantidad[cont] += parseFloat(datos['suma']);
                               infoGraficaDonut.CantidadGap[cont] += parseFloat(datos['sumap']);
                               infoGraficaDonut.Volumen[cont] += parseFloat(datos['sumaC']);
                               infoGraficaDonut.VolumenGap[cont] += parseFloat(datos['sumaCP']);


                               infoGrafica[datos[llave]['mes']] = parseFloat(datos['suma']);
                               infoGrafica2[datos[llave]['mes']] = parseFloat(datos['sumaC']);
                               infoGraficaG[datos[llave]['mes']] = parseFloat(datos['sumap']);
                               infoGraficaG2[datos[llave]['mes']] = parseFloat(datos['sumaCP']);

                               aux=1;
                           }
                           else if(datos[llave]['sku'].localeCompare(indice) != 0)
                           {

                               infoGrafica.shift();
                               infoGrafica2.shift();
                               infoGraficaG.shift();
                               infoGraficaG2.shift();



                               InfoStack.Cantidad.push(infoGrafica);
                               InfoStack.Volumen.push(infoGrafica2);
                               InfoStack.CantidadGap.push(infoGraficaG);
                               InfoStack.VolumenGap.push(infoGraficaG2);


                               infoGrafica = [0,0,0,0,0,0,0,0,0,0,0,0,0];
                               infoGrafica2 = [0,0,0,0,0,0,0,0,0,0,0,0,0];
                               infoGraficaG = [0,0,0,0,0,0,0,0,0,0,0,0,0];
                               infoGraficaG2 = [0,0,0,0,0,0,0,0,0,0,0,0,0];

                               cont++;
                               infoGraficaDonut.Cantidad[cont] += parseFloat(datos['suma']);
                               infoGraficaDonut.CantidadGap[cont] += parseFloat(datos['sumap']);
                               infoGraficaDonut.Volumen[cont] += parseFloat(datos['sumaC']);
                               infoGraficaDonut.VolumenGap[cont] += parseFloat(datos['sumaCP']);

                               infoGrafica[datos[llave]['mes']] = parseFloat(datos['suma']);
                               infoGrafica2[datos[llave]['mes']] = parseFloat(datos['sumaC']);
                               infoGraficaG[datos[llave]['mes']] = parseFloat(datos['sumap']);
                               infoGraficaG2[datos[llave]['mes']] = parseFloat(datos['sumaCP']);

                               indice=datos[llave]['sku'];
                               aux=0;

                               }
                       }
                   }
               }
               crearGraficaBarraStack(labelsGraf, InfoStack[tipo], "graficaBarrasStack")
               crearGraficaDonut(labelsGraf, infoGraficaDonut[tipo], "graficaDonut");
          }

   });

}

function crearGraficaDonut(labels1, info, idGrafica, colors)
{
 $('#'+idGrafica).remove();
 $('#divGrafica1').append("<canvas id="+idGrafica+" style=\"width:100%;height:auto;\"></canvas>");
 var colors1 = ["#ffb400", "#3ab400", "#5b2872", "#282872", "#20a872", "#20eae1","#66ff66", "#663300","#cc6699","#336699","#ff99ff"];
 var colors = [];
 for (var i = 0; i < info.length; i++)
 {
   colors.push(colors1[i]);
 }
 new Chart(document.getElementById(idGrafica), {
 type: 'doughnut',
 data: {
     labels: labels1,
     datasets: [ {
         label: "Potencial",
         data: info,
         backgroundColor: colors
     } ]
 },
 options: {
     title: {
         display: false,
         text: ''
   },
     legend: { display: true }
  }
 });
}




function crearGraficaBarraStack(labels1, matriz, idGrafica)
{
 $('#'+idGrafica).remove();
 $('#divGrafica2').append("<canvas id="+idGrafica+" style=\"width:100%;height:auto;\"></canvas>");
 var colors1 = ["#ffb400", "#3ab400", "#5b2872", "#282872", "#20a872", "#20eae1","#66ff66", "#663300","#cc6699","#336699","#ff99ff"];
 var datas = [];
 for (var i = 0; i < matriz.length; i++){
   var tem = {
     label: labels1[i],
     data: matriz[i],
     backgroundColor: colors1[i]
   };
   datas.push(tem);
 }
 var dataX = {
   labels: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
   datasets: datas
 }

 var barras = new Chart(document.getElementById(idGrafica), {
   type: 'bar',
   data: dataX,
   options: {
     responsive: true,
     title:{
         display:true,
         text:'Potencial por familia'
     },
     elements: {
       rectangle: {
         borderSkipped: 'left',
       }
     },
     legend: {
           display: true,
           labels: {
               fontColor: 'rgb(255, 99, 132)',
               display: true
           }
     },
     scales: {
       xAxes: [{ stacked: true }],
       yAxes: [{ stacked: true }]
     }
   }
   });
}

function DropPedido(event)
{
   if(event.target != this )
   {
       $("#fvol").text(event.target.id);
       if(indexmodal.localeCompare("modalPotencial")==0){

           crearGraficaDonut(labelsGraf, infoGraficaDonut[event.target.id], "graficaDonut");
           crearGraficaBarraStack(labelsGraf, InfoStack[event.target.id], "graficaBarrasStack");
       }
       else{
       $("#fvol").text(event.target.id);
           crearGraficaDonut(labelsGraf, infoGraficaDonut[event.target.id+"Gap"], "graficaDonut");
           crearGraficaBarraStack(labelsGraf, InfoStack[event.target.id+"Gap"], "graficaBarrasStack");

       }
   }
}


function imagen(img) {
        $("body").append(ModalImagen);
        var vslider;
        $('#modalgaleria')
        .modal({
         onHide: function(){
           setTimeout(function(){
            vslider.destroySlider();
            $('#modalgaleria').remove();
           },250);
         },
         allowMultiple: true,
         inverted:true,
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

function crearGraficaLinea (labels1, info, idGrafica, divG)
{
    $('#'+idGrafica).remove();
    $("#"+divG).append("<canvas id="+idGrafica+" style=\"width:100%;height:auto;\"></canvas>");
	new Chart(document.getElementById(idGrafica), {
		type: 'line',
      	data: {
        	labels: labels1,
        	datasets: [ {
            	label: "",
            	data: info,
            	borderColor: "#3e95cd",
            	fill: false
          	} ]
      	},
      	options: {
        	title: {
          		display: false,
          		text: ''
        	},
        	legend: { display: false },
        	scales: {
                  xAxes: [{
                          display: true,
                          scaleLabel: {
                              display: true,
                              labelString: 'DÍA DEL MES'
                          }
                      }],
                  yAxes: [{
                          display: true,
                          scaleLabel: {
                              display: true,
                              labelString: 'PROSPECTOS'
                          }
                      }]
              }
      	}
  	});
}

function getrow(){
var ins=0;
 $("#prodname").fadeOut('slow');
 $("#razon").fadeOut('slow');
 $("#promven").fadeOut('slow');
 $("#precios").fadeOut('slow');
   $(this).find('td').each (function() {
       if(ins==0)
       {
           var name=$(this).text();
           $.ajax({
               url: "{% url "gepp:getprod" %}",
               data: { 'cluster': {{ info.cluster }},'producto':name, 'tabla':table},
               dataType: 'json',
               success: function(data){
                   $("#prodname").text(name);
                   $("#razon").text(data[1]+" / "+data[0]);
                   $("#promven").text(coinfor(parseFloat(JSON.parse(data[2])['suma']).toFixed(2),"$"));
                   $("#prodname").fadeIn('slow');
                    $("#razon").fadeIn('slow');
                    $("#promven").fadeIn('slow');
                    $("#precios").fadeIn('slow');
               }
           });

       }
       if(ins==2)
       {
           $("#precios").text($(this).text());
       }
       ins++;

   });
}

function calendario()
{
   var v2 = "{{ reco.recom_visitas }}"; //visitas recomendadas
   var v4 = "{{ reco.visitas }}";
   var myDate = new Date();
   var t2 = [];
   var t4 = [];
   var day_week = [];
   var day_week2 = [];

   t2 = v2.split(":"); //valores

   t4 = v4.split(":"); //valores

   var cont = 0;
   for(var i = 0; i < t2.length; i++ )
   {
       cont += parseInt(t2[i]);
       if(t2[i] == "1") // visitas recomendadas
           day_week.push(i+1);
       if(t4[i] == "1") // visitas recomendadas
           day_week2.push(i+1);
   }
   myDate.getFullYear();
   var dia = 1;
   var anio = myDate.getFullYear();
   var diasV = [];
   var Arr = 0;
   var diaTem;
   var mesTem;
   var estTem;
   while(myDate.getFullYear() == anio)
   {
       if(day_week.includes(myDate.getDay()) == true)
       {
           mesTem = ("0" + (myDate.getMonth()+1) ).slice(-2);
           diaTem = ("0" + myDate.getDate()).slice(-2);
           estTem = { name:'reco', date: (myDate.getFullYear() +"-"+ mesTem +"-"+ diaTem) };
           diasV.push(estTem);

       }
       if(day_week2.includes(myDate.getDay()) == true)
       {
           mesTem = ("0" + (myDate.getMonth()+1) ).slice(-2);
           diaTem = ("0" + myDate.getDate()).slice(-2);
           estTem = { name:'visitaN', date: (myDate.getFullYear() +"-"+ mesTem +"-"+ diaTem) };
           diasV.push(estTem);
       }

       myDate.setDate(myDate.getDate() + 1);
   }
   $('#calendar').pignoseCalendar({
       lang: 'es',
       scheduleOptions: {
           colors: {
               reco: '#0000ff',
               visitaN: '#00cc00'
           }
       },
       schedules: diasV,
    });
}

function cambiarAnioPotGAP(event)
{
   if(event.target != this )
       {
        $("#fanio").text(event.target.id);
        $("#fvol").text("Cantidad");
        $("#Cantidad").addClass('active');
        $("#Volumen").removeClass('active');
        if(indexmodal.localeCompare("modalGap")==0)
            CargarInfoGAP_Potencial("CantidadGap", event.target.id);
        else
            CargarInfoGAP_Potencial("Cantidad", event.target.id);
       }
}


function random_rgba() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + (.75).toFixed(1) + ')';
}


function analize(){
$("#sellin").removeClass("active");
  $("#sellout").removeClass("active");
  $("#ejecucion").removeClass("active");
  if(indexmodal.localeCompare("modalAnalisis") != 0)
             {
    var InfoModalAnalisis =
       {
         ArrVisitas: [],
         ArrIngreso: [],
         ArrTamGap: [],
         ArrColorGap: [],
         ArrText: []
       };

    $.ajax({
       url: "{% url "gepp:analisis" %}",
       data: { 'id_pdv': {{ info.id_pdv }},'anio':anioActual, 'tabla':table},
       dataType: 'json',
       success: function(data){
       var arrayTemp = []
                  for(i=0;i<data.length;i++){
                   var datos = JSON.parse(data[i]);
                   arrayTemp.push(datos['gap']);
                  }
                  arrayTemp.sort(function(a, b){return a - b});
                  var masNegativo = arrayTemp[0];
                  var masPositivo = arrayTemp[arrayTemp.length -1];
                  var diferencia;
                  var razon;

                  if(masNegativo < 0)
                  {
                   masNegativo = -(masNegativo);
                   diferencia = (masNegativo) + masPositivo;
                  }
                  else
                  {
                   diferencia = masPositivo - masNegativo;
                  }
                  razon = 100 / diferencia;

           for(i=0;i<data.length;i++)
           {
               var datos = JSON.parse(data[i]);
               InfoModalAnalisis.ArrVisitas.push(datos['cantidad']);
               InfoModalAnalisis.ArrIngreso.push(datos['ventas']);
               InfoModalAnalisis.ArrTamGap.push(razon * (arrayTemp[i]+ masNegativo) + 10);
               InfoModalAnalisis.ArrText.push(datos['id']);
               InfoModalAnalisis.ArrColorGap.push(random_rgba())
           }
            var valmax=Math.max.apply(null,InfoModalAnalisis.ArrTamGap);
            for(var m in InfoModalAnalisis.ArrTamGap)
            {
                InfoModalAnalisis.ArrTamGap[m]=InfoModalAnalisis.ArrTamGap[m]*100/valmax;
            }
            $("#parteizquierda").remove();
           $("#cuerpodelmodal").remove();
           $("#partederecha").remove();

               indexmodal = "modalAnalisis";
               $('#principal').append("<div class=\"fourteen wide computer sixteen wide tablet sixteen wide mobile column pal-auto1 paddleft1\" id=\"cuerpodelmodal\"> </div>");
               $('#cuerpodelmodal').append("<div class=\"row\"> <div class=\"column wide\"> <div id=\"GraficaAnalisis\" ></div> </div></div>");


               var data =[]
              for(var ix=0;ix<InfoModalAnalisis.ArrColorGap.length;ix++)
              {
                   data.push({
                        x: [InfoModalAnalisis.ArrIngreso[ix]],
                        y: [InfoModalAnalisis.ArrVisitas[ix]],
                        text: [InfoModalAnalisis.ArrText[ix]],
                        name: InfoModalAnalisis.ArrText[ix],
                        mode: 'markers',
                        marker: {
                            color: [InfoModalAnalisis.ArrColorGap[ix]],
                            size: [InfoModalAnalisis.ArrTamGap[ix]]
                        }

                    });
              }
               var layout = {
                   title: 'Cantidad VS Ventas VS GAP',
                   yaxis:{
                          title:'Cantidad',
                          titlefont:
                            {
                              family:'Courir New, monospace',
                              size:18,
                              color:'#7f7f7f'
                            },
                      },
                  xaxis:{
                         title:'Ventas',
                         titlefont:
                         {
                           family:'Courir New, monospace',
                           size:18,
                           color:'#7f7f7f'
                         },
                     },
                   showlegend: true,
                   height: window.innerHeight*.98,
                   width: window.innerWidth
               };
               var myPlot = document.getElementById('GraficaAnalisis'),
                   d3 = Plotly.d3,
                   data = data,
                   layout = {
                           title: 'Cantidad VS Ventas VS GAP',
                           yaxis:{
                                 title:'Cantidad',
                                 titlefont:
                                   {
                                     family:'Courir New, monospace',
                                     size:18,
                                     color:'#7f7f7f'
                                   },
                             },
                         xaxis:{
                                title:'Ventas',
                                titlefont:
                                {
                                  family:'Courir New, monospace',
                                  size:18,
                                  color:'#7f7f7f'
                                },
                            },
                           showlegend: true,
                           height: 600,
                           width: ($('#principal').width()) *.98,//window.innerWidth*.5,
                       };

               Plotly.newPlot('GraficaAnalisis', data, layout);



       }
   });

}
}



//indexmodal=2 modalEjecucion
//indexmodal=3 modalSellout
//indexmodal=5 modalSellin
//indexmodal=4 modalCluster
//indexmodal=5 modalSellin
//indexmodal=8 modalFamilia
//indexmodal=9 modalPedido
//indexmodal=10 modalPotencial
//indexmodal=11 modalGap
</script>

