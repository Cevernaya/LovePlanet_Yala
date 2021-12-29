const btcData = async () => {
    const response = await fetch('https://api.coindesk.com/v1/bpi/historical/close.json?start=2021-06-01&end=2021-11-23');
    const json = await response.json();
    const data = Object.entries(json.bpi)
    console.log(data);
    const times = data.map(obj => obj[0])
    const prices = data.map(obj => obj[1])
    return {
      times,
      prices
    }
  }

  let createBtcChart

  async function printBtcChart() {
    let { times, prices } = await btcData()
    times = times.map(timestamp => `${timestamp.split('-')[1]}-${timestamp.split('-')[2]}`)
    console.log(times, prices)
  
    let btcChart = document.getElementById('lovecoin_chart').getContext('2d');
  
    let gradient = btcChart.createLinearGradient(0, 0, 0, 400);
  
    gradient.addColorStop(0, 'rgba(247,161,173,.5)');
    gradient.addColorStop(0.7, 'rgba(255,161,173,0)');
  
    // Chart.defaults.global.defaultFontFamily = 'Red Hat Text';
    // Chart.defaults.global.defaultFontSize = 12;
  
    createBtcChart = new Chart(btcChart, {
      type: 'line',
      data: {
        labels: times,
        datasets: [{
          label: '$',
          data: prices,
          backgroundColor: gradient,
          borderColor: '#ffa1ad',
          borderJoinStyle: 'round',
          borderCapStyle: 'round',
          borderWidth: 4,
          pointRadius: 0,
          pointHitRadius: 10,
          lineTension: .2,
          fill: true
        }]
      },
  
      options: {
        title: {
          display: false,
          text: 'Heckin Chart!',
          fontSize: 35
        },
  
        legend: {
          display: false
        },

        plugins: {
            legend: {
                display: false
            }
        },
  
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }
        },
  
        scales: {
            y: {
                grid: {
                    display: false,
                }
            },
            x: {
                grid: {
                    display: false,
                }
            },
          
        },
  
        tooltips: {
          callbacks: {
            //This removes the tooltip title
            title: function() {}
         },
          //this removes legend color
          displayColors: false,
          yPadding: 10,
          xPadding: 10,
          position: 'nearest',
          caretSize: 10,
          backgroundColor: 'rgba(255,255,255,.9)',
          bodyFontSize: 15,
          bodyFontColor: '#303030' 
        }
      }
    });
  }

  printBtcChart()