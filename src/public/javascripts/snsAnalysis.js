const chart_sizer = (chart_object) => {
    Object.entries(chart_object).map(a => {
        const canvas = a[1];
        var parentRect = canvas.parentNode.getBoundingClientRect();
        canvas.width = parentRect.width;
        canvas.height = parentRect.height;
    })
};

CHART_1_1 = document.getElementById("chart1_1")
CHART_1_2 = document.getElementById("chart1_2")
CHART_1_3 = document.getElementById("chart1_3")
CHART_2_2 = document.getElementById("chart2_2")
CHART_2_3 = document.getElementById("chart2_3")

const CHARTS = {
    1_1: CHART_1_1,
    1_2: CHART_1_2,
    1_3: CHART_1_3,
    2_2: CHART_2_2,
    2_3: CHART_2_3,
}

// chart_sizer(CHARTS);

const randBetween = (a, b) => Math.floor(Math.random() * (b - a) + a)

CHART_COLORS = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};

CHART_COLORS_TRANS = {
    red: 'rgba(255, 99, 132, 0.5)',
    orange: 'rgba(255, 159, 64, 0.5)',
    yellow: 'rgba(255, 205, 86, 0.5)',
    green: 'rgba(75, 192, 192, 0.5)',
    blue: 'rgba(54, 162, 235, 0.5)',
    purple: 'rgba(153, 102, 255, 0.5)',
    grey: 'rgba(201, 203, 207, 0.5)',
};

const DATA_COUNT = 7;
const NUMBER_CFG = { count: DATA_COUNT, min: -100, max: 100 };

const labels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
const data11 = {
    labels: labels,
    datasets: [
        {
            label: 'Dataset 1',
            data: labels.map(_ => randBetween(0, 100)),
            backgroundColor: 'rgb(255, 99, 132, 0.5)',
            borderWidth: 2,
            borderColor: 'rgb(255, 99, 132)',
        },
        {
            label: 'Dataset 2',
            data: labels.map(_ => randBetween(50, 100)),
            backgroundColor: 'rgb(54, 162, 235, 0.5)',
            borderWidth: 2,
            borderColor: 'rgb(54, 162, 235)',
        },
    ]
};

const config11 = {
    type: 'line',
    data: data11,
    options: {
        responsive: false,
        plugins: {
            title: {
                display: false,
                text: 'Chart.js Line Chart - Cubic interpolation mode'
            },
            legend: {
                display: false
            }
        },
        interaction: {
            intersect: false,
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: false
                }
            },
            y: {
                display: true,
                title: {
                    display: false,
                    text: 'Value'
                },
                suggestedMin: -10,
                suggestedMax: 200
            }
        }
    },
};

const labels12 = [1, 2, 3, 4, 5, 6, 7];
const data12 = {
    labels: labels12,
    datasets: [
        {
            label: 'Friendship Ratio',
            data: labels12.map(_ => randBetween(0, 100)),
            backgroundColor: Object.values(CHART_COLORS),
            borderWidth: 2,
            borderColor: Object.values(CHART_COLORS),
        }
    ]
}

const config12 = {
    type: 'pie',
    data: data12,
    options: {
        responsive: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false,
                text: 'Friendship Ratio'
            }
        }
    },
};

const labels13 = [1, 2, 3, 4, 5, 6, 7];
const data13 = {
    labels: labels13,
    datasets: [
        {
            label: 'Friendship Ratio',
            data: labels13.map(_ => randBetween(0, 100)),
            backgroundColor: Object.values(CHART_COLORS).reverse(),
            borderWidth: 2,
            borderColor: Object.values(CHART_COLORS).reverse(),
        }
    ]
}

const config13 = {
    type: 'pie',
    data: data13,
    options: {
        responsive: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false,
                text: 'Friendship Ratio'
            }
        }
    },
};

const myChart11 = new Chart(
    CHARTS['11'],
    config11
);

const myChart12 = new Chart(
    CHARTS['12'],
    config12
);

const myChart13 = new Chart(
    CHARTS['23'],
    config13
);

const data22 = {
    labels: labels13,
    datasets: [
        {
            label: 'Friendship Ratio',
            data: labels13.map(_ => randBetween(20, 100)),
            backgroundColor: Object.values(CHART_COLORS_TRANS).reverse(),
            borderWidth: 2,
            borderColor: Object.values(CHART_COLORS_TRANS).reverse(),
        }
    ]
}

const config22 = {
    type: 'polarArea',
    data: data22,
    options: {
        responsive: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false,
                text: 'Friendship Ratio'
            }
        }
    },
};

const data23 = {
    labels: labels13,
    datasets: [
        {
            label: 'Friendship Ratio',
            data: labels13.map(_ => randBetween(70, 100)),
            backgroundColor: Object.values(CHART_COLORS_TRANS).reverse(),
            borderWidth: 2,
            borderColor: Object.values(CHART_COLORS_TRANS).reverse(),
        }
    ]
}

const config23 = {
    type: 'polarArea',
    data: data23,
    options: {
        responsive: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false,
                text: 'Friendship Ratio'
            }
        }
    },
};

const myChart22 = new Chart(
    CHARTS['22'],
    config22
);

const myChart23 = new Chart(
    CHARTS['13'],
    config23
);


setTimeout(() => {
    const loader = document.getElementsByClassName('loading')[0]
    const display = document.getElementsByClassName('arrange_row')[0]

    loader.setAttribute("style", "display: none;")
    display.setAttribute("style", "")
}, 1500)

setTimeout(() => {
    const loader = document.getElementsByClassName('loading')[1]
    const display = document.getElementsByClassName('arrange_row')[1]

    loader.setAttribute("style", "display: none;")
    display.setAttribute("style", "")
}, 2000)

setTimeout(() => {
    const loader = document.getElementsByClassName('loading')[2]
    const display = document.getElementsByClassName('arrange_row')[2]

    loader.setAttribute("style", "display: none;")
    display.setAttribute("style", "")
}, 2300)