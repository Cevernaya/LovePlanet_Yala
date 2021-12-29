const DATA_COUNT = 7;
const NUMBER_CFG = { count: DATA_COUNT, min: -100, max: 100 };
const CHART_CANVAS = document.getElementById("chart_canvas");

const lovecoin_chart_sizer = () => {
    var parentRect = CHART_CANVAS.parentNode.getBoundingClientRect();
    CHART_CANVAS.width = parentRect.width;
    CHART_CANVAS.height = parentRect.height;
};
lovecoin_chart_sizer();

const randBetween = (a, b) => Math.floor(Math.random() * (b-a) + a)

const labels = [1, 2, 3, 4, 5, 6, 7];
const data = {
    labels: labels,
    datasets: [
        {
            label: 'Dataset 1',
            data: [[-50, -30], [-90, -20], [-70, 20], [10, 70], [-50, 80], [20, 50], [50, 120]],
            backgroundColor: 'rgb(255, 99, 132, 0.5)',
            borderWidth: 2,
            borderColor: 'rgb(255, 99, 132)',
        },
        {
            label: 'Dataset 2',
            data: [[-40, -20], [-130, -35], [-10, 30], [20, 50], [-30, 100], [20, 50], [50, 120]],
            backgroundColor: 'rgb(54, 162, 235, 0.5)',
            borderWidth: 2,
            borderColor: 'rgb(54, 162, 235)',
        },
    ]
};

const config = {
    type: 'bar',
    data: data,
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false,
                position: 'top',
            },
            title: {
                display: false,
                text: 'Chart.js Floating Bar Chart'
            }
        },
    }
};

const myChart = new Chart(
    CHART_CANVAS,
    config
);