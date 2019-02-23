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
                backgroundColor: window.chartColors.pink
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
