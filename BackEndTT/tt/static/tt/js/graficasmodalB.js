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

          function lineChart1ModB() {
              var lineChart2MultiAxis = {
                  type: 'line',
                  data: {
                      labels: ['0', '5', '10', '15', '20', '25', '30'],
                      datasets: [
                          {
                              label: 'Line 1',
                              fill: false,
                              backgroundColor: window.chartColors.red,
                              borderColor: window.chartColors.red,
                              data: [0, 40, 10, 5, 5, 45, 0],
                          }, {
                              label: 'Line 2',
                              fill: false,
                              backgroundColor: window.chartColors.blue,
                              borderColor: window.chartColors.blue,
                              data: [0, 5, 20, 2, 10, 35, 0],

                          }]
                  },
                  options: {
                      responsive: true,
                      title: {
                          display: true,
                          text: ''
                      },
                      tooltips: {
                          mode: 'index',
                          intersect: false,
                      },
                      hover: {
                          mode: 'nearest',
                          intersect: false
                      },
                      legend: {
                          display: false,
                          position: 'right',
                      },
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
                      }}};
              var ctx = document.getElementById('multiaxis').getContext('2d');
              window.lineChart1ModB = new Chart(ctx, lineChart2MultiAxis);
          }

          function lineChart2ModB() {
              var lineChart2M = {
                  type: 'line',
                  data: {
                      labels: ['0', '5', '10', '15', '20', '25', '30'],
                      datasets: [
                          {
                              label: 'Visitas',
                              fill: false,
                              backgroundColor: window.chartColors.blue,
                              borderColor: window.chartColors.blue,
                              data: [0, 25, 10, 5, 80, 40, 0],
                          }]
                  },
                  options: {
                      responsive: true,
                      title: {
                          display: true,
                          text: 'RELACIÓN DE VISITAS POR MES'
                      },
                      tooltips: {
                          mode: 'index',
                          intersect: false,
                      },
                      hover: {
                          mode: 'nearest',
                          intersect: false
                      },
                      legend: {
                          display: false,
                          position: 'right',
                      },
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
                      }}};
              var ctx = document.getElementById('line1').getContext('2d');
              window.lineChart2ModB = new Chart(ctx, lineChart2M);
          }
          function lineChart3ModB() {
              var lineChart3M = {
                  type: 'line',
                  data: {
                      labels: ['0', '5', '10', '15', '20', '25', '30'],
                      datasets: [
                          {
                              label: 'Visitas',
                              fill: false,
                              backgroundColor: window.chartColors.blue,
                              borderColor: window.chartColors.blue,
                              data: [0, 25, 10, 5, 80, 40, 0],
                          }]
                  },
                  options: {
                      responsive: true,
                      title: {
                          display: true,
                          text: 'RELACIÓN DE VISITAS POR MES'
                      },
                      tooltips: {
                          mode: 'index',
                          intersect: false,
                      },
                      hover: {
                          mode: 'nearest',
                          intersect: false
                      },
                      legend: {
                          display: false,
                          position: 'right',
                      },
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
                      }}};
              var ctx = document.getElementById('line2').getContext('2d');
              window.lineChart3ModB = new Chart(ctx, lineChart3M);
          }
          function lineChart4ModB() {
              var lineChart4M = {
                  type: 'line',
                  data: {
                      labels: ['0', '5', '10', '15', '20', '25', '30'],
                      datasets: [
                          {
                              label: 'Visitas',
                              fill: false,
                              backgroundColor: window.chartColors.blue,
                              borderColor: window.chartColors.blue,
                              data: [0, 25, 10, 5, 80, 40, 0],
                          }]
                  },
                  options: {
                      responsive: true,
                      title: {
                          display: true,
                          text: 'RELACIÓN DE VISITAS POR MES'
                      },
                      tooltips: {
                          mode: 'index',
                          intersect: false,
                      },
                      hover: {
                          mode: 'nearest',
                          intersect: false
                      },
                      legend: {
                          display: false,
                          position: 'right',
                      },
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
                      }}};
              var ctx = document.getElementById('line3').getContext('2d');
              window.lineChart4ModB = new Chart(ctx, lineChart4M);
          }
          function lineChart5ModB() {
              var lineChart5M = {
                  type: 'line',
                  data: {
                      labels: ['0', '5', '10', '15', '20', '25', '30'],
                      datasets: [
                          {
                              label: 'Visitas',
                              fill: false,
                              backgroundColor: window.chartColors.blue,
                              borderColor: window.chartColors.blue,
                              data: [0, 25, 10, 5, 80, 40, 0],
                          }]
                  },
                  options: {
                      responsive: true,
                      title: {
                          display: true,
                          text: 'RELACIÓN DE VISITAS POR MES'
                      },
                      tooltips: {
                          mode: 'index',
                          intersect: false,
                      },
                      hover: {
                          mode: 'nearest',
                          intersect: false
                      },
                      legend: {
                          display: false,
                          position: 'right',
                      },
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
                      }}};
              var ctx = document.getElementById('line4').getContext('2d');
              window.lineChart5ModB = new Chart(ctx, lineChart5M);
          }




