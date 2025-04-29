const form = document.getElementById('cropForm');
const chartCanvas = document.getElementById('npkChart');
let chartInstance;

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const N = parseFloat(document.getElementById('N').value);
    const P = parseFloat(document.getElementById('P').value);
    const K = parseFloat(document.getElementById('K').value);
    const temperature = parseFloat(document.getElementById('temperature').value);
    const humidity = parseFloat(document.getElementById('humidity').value);
    const ph = parseFloat(document.getElementById('ph').value);
    const rainfall = document.getElementById('rainfall').value;

    const response = await fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ N, P, K, temperature, humidity, ph, rainfall }),
    });

    const data = await response.json();
    const resultDiv = document.getElementById('result');

    if (data.error) {
        resultDiv.textContent = 'Error: ' + data.error;
    } else {
        console.log(data);
        resultDiv.textContent = 'Recommended Crop: ' + data.crop;


        document.getElementById('chartWrapper').style.display = 'block';

        const recommendedN = data.recommended_n || 90;
        const recommendedP = data.recommended_p || 40;
        const recommendedK = data.recommended_k || 40;

        if (chartInstance) chartInstance.destroy();

        chartInstance = new Chart(chartCanvas, {
            type: 'bar',
            data: {
                labels: ['Nitrogen (N)', 'Phosphorus (P)', 'Potassium (K)'],
                datasets: [
                    {
                        label: 'Entered Value',
                        data: [N, P, K],
                        backgroundColor: 'rgba(75, 192, 192, 1)'
                    },
                    {
                        label: 'Recommended Value',
                        data: [recommendedN, recommendedP, recommendedK],
                        backgroundColor: 'rgba(255, 159, 64, 1)'
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: '#333',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'NPK Levels: Entered vs Recommended',
                        color: '#222',
                        font: {
                            size: 18,
                            weight: 'bold'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#333',
                            font: {
                                size: 12
                            }
                        }
                    },
                    x: {
                        ticks: {
                            color: '#333',
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }

        });
    }
});