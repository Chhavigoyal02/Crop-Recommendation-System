const form = document.getElementById('cropForm');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const N = parseFloat(document.getElementById('N').value);
    const P = parseFloat(document.getElementById('P').value);
    const K = parseFloat(document.getElementById('K').value);

    const response = await fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ N, P, K }),
    });

    const data = await response.json();
    const resultDiv = document.getElementById('result');
    if (data.error) {
        resultDiv.textContent = 'Error: ' + data.error;
    } else {
        console.log(data);
        resultDiv.textContent = 'Recommended Crop: ' + data.crop;
    }
});