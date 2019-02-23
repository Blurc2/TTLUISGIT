/* =====================================
 Template Name: geep
 Author Name: vargasdesignMx
 Description: Point of sale
 Version:  3.2.4
 ========================================*/
// JavaScript Document

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

function lineChart1ModA() {
    var lineChart1 = {
        type: 'line',
        data: {
            labels: ['0', '5', '10', '15', '20', '25', '30'],
            datasets: [
                {
                    label: 'Visitas',
                    fill: false,
                    backgroundColor: window.chartColors.red,
                    borderColor: window.chartColors.red,
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
    var ctx = document.getElementById('line-chart').getContext('2d');
    window.lineChart1ModA = new Chart(ctx, lineChart1);
}

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
function varline1() {
    var varline1ModC = {
        type: 'bar',
        data: {
            labels: ['SEMANA 1', 'SEMANA 2', 'SEMANA 3', 'SEMANA 4', 'SEMANA 5'],
            datasets: [
                {
                    label: 'bar',
                    backgroundColor: window.chartColors.orange,
                    borderColor: window.chartColors.orange,
                    data: [300, 400, 300, 700, 0],
                }, {
                    label: 'line',
                    fill: false,
                    backgroundColor: window.chartColors.green,
                    borderColor: window.chartColors.green,
                    data: [400, 500, 300, 900, 0],

                    type: 'line'

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
            },
            scales: {
                xAxes: [{
                        gridLines: {
                            display: false
                        }

                    }],
                yAxes: [{
                        gridLines: {
                            display: false
                        }
                    }]

            }
        }
    };
    var ctx = document.getElementById('varline1').getContext('2d');
    window.varline1 = new Chart(ctx, varline1ModC);
}

function threeline1() {
    var threeModC = {
        type: 'line',
        data: {
            labels: ['0', '5', '10', '15', '20', '25', '30'],
            datasets: [
                {
                    label: 'bar',
                    fill: false,
                    backgroundColor: window.chartColors.blue,
                    borderColor: window.chartColors.blue,
                    data: [10, 75, 80, 125, 7, 14, 18],
                }, {
                    label: 'line',
                    fill: false,
                    backgroundColor: window.chartColors.green,
                    borderColor: window.chartColors.green,
                    data: [27, 1, 85, 90, 0, 4, 12, 0],

                    type: 'line'

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
            },
            
        }
    };
    var ctx = document.getElementById('threeline').getContext('2d');
    window.threeline1 = new Chart(ctx, threeModC);
}

function threeline2() {
    var threeline2ModE = {
        type: 'line',
        data: {
            labels: ['SEMANA 1', 'SEMANA 2', 'SEMANA 3', 'SEMANA 4', 'SEMANA 5'],
            datasets: [
                {
                    label: 'pedido original',
                    fill: false,
                    backgroundColor: window.chartColors.blue,
                    borderColor: window.chartColors.blue,
                    data: [0, 250, 20, 50, 500],
                }, {
                    label: 'pedido sugerido 1',
                    fill: false,
                    backgroundColor: window.chartColors.green,
                    borderColor: window.chartColors.green,
                    data: [500, 600, 200, 800, 250],

                    type: 'line'

                },{
                    label: 'pedido sugerido 2',
                    fill: false,
                    backgroundColor: window.chartColors.orange,
                    borderColor: window.chartColors.orange,
                    data: [10, 200, 700, 500, 900],

                    type: 'line'

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
            },
            scales: {
                xAxes: [{
                        gridLines: {
                            display: false
                        }

                    }],
                yAxes: [{
                        gridLines: {
                            display: false
                        }
                    }]

            }
        }
    };
    var ctx = document.getElementById('treslineas2').getContext('2d');
    window.threeline2 = new Chart(ctx, threeline2ModE);
}

function bar1ModD() {
    var lineChart1 = {
        type: 'bar',
        data: {
            labels: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
            datasets: [
                {
                    backgroundColor: window.chartColors.red,
                    borderColor: window.chartColors.red,
                    data: [50, 500, 1010, 700, 750, 1000, 100, 20, 1700, 500, 3000, 10, 400, 5, 0,60],
                }]
        },
        options: {
            responsive: true,
           
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
                        gridLines: {
                            display: false}
                    }],
                yAxes: [{
                        gridLines: {
                            display: true
                        }
                    }]
            }}};
    var ctx = document.getElementById('bar1').getContext('2d');
    window.bar1ModD = new Chart(ctx, lineChart1);
}

function bar2ModD() {
    var lineChart2 = {
        type: 'bar',
        data: {
            labels: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
            datasets: [
                {
                    backgroundColor: window.chartColors.red,
                    borderColor: window.chartColors.red,
                    data: [50, 500, 1010, 700, 750, 1000, 100, 20, 1700, 500, 3000, 10, 400, 5, 0,60],
                }]
        },
        options: {
            responsive: true,
           
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
                        gridLines: {
                            display: false}
                    }],
                yAxes: [{
                        gridLines: {
                            display: true
                        }
                    }]
            }}};
    var ctx = document.getElementById('bar2').getContext('2d');
    window.bar2ModD = new Chart(ctx, lineChart2);
}
function bar3ModD() {
    var lineChart3 = {
        type: 'bar',
        data: {
            labels: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
            datasets: [
                {
                    backgroundColor: window.chartColors.red,
                    borderColor: window.chartColors.red,
                    data: [50, 500, 1010, 700, 750, 1000, 100, 20, 1700, 500, 3000, 10, 400, 5, 0,60],
                }]
        },
        options: {
            responsive: true,
           
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
                        gridLines: {
                            display: false}
                    }],
                yAxes: [{
                        gridLines: {
                            display: true
                        }
                    }]
            }}};
    var ctx = document.getElementById('bar3').getContext('2d');
    window.bar3ModD = new Chart(ctx, lineChart3);
}
function bar4ModD() {
    var lineChart4 = {
        type: 'bar',
        data: {
            labels: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
            datasets: [
                {
                    backgroundColor: window.chartColors.red,
                    borderColor: window.chartColors.red,
                    data: [50, 500, 1010, 700, 750, 1000, 100, 20, 1700, 500, 3000, 10, 400, 5, 0,60],
                }]
        },
        options: {
            responsive: true,
           
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
                        gridLines: {
                            display: false}
                    }],
                yAxes: [{
                        gridLines: {
                            display: true
                        }
                    }]
            }}};
    var ctx = document.getElementById('bar4').getContext('2d');
    window.bar4ModD = new Chart(ctx, lineChart4);
}

function lineChart1ModF() {
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
    var ctx = document.getElementById('multiaxisE').getContext('2d');
    window.lineChart1ModF = new Chart(ctx, lineChart2MultiAxis);
}



















