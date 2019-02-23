window.chartColors = {
              red: 'rgb(255, 99, 132)',
              orange: 'rgb(255, 159, 64)',
              yellow: 'rgb(255, 205, 86)',
              green: '#53c228',
              blue: 'rgb(54, 162, 235)',
              purple: 'rgb(153, 102, 255)',
              grey: 'rgb(201, 203, 207)'
                      //colorsbars
          };

function crearGraficaTreslinea(labels1, info1, info2, info3, idGrafica)
{
  new Chart(document.getElementById(idGrafica), {
    type: 'line',
        data: {
          labels: labels1,
          datasets: [ {
              label: "Pedido Original",
              data: info1,
              borderColor: "#0039e6",
              fill: false
            },
            {
              label: "Pedido Sugerido 1",
              data: info2,
              borderColor: "#99ccff",
              fill: false
            },
            {
              label: "Pedido Sugerido 2",
              data: info3,
              borderColor: "#ff8533",
              fill: false
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
