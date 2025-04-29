from flask import Flask, request, jsonify, render_template
import pickle
import numpy as np

app = Flask(__name__)



class FakeModel:
    def predict(self, features):
        crops = ['rice', 'wheat', 'maize', 'barley']
        return [crops[int(sum(features[0]) % len(crops))]]
model = FakeModel()

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        N = float(data['N'])
        P = float(data['P'])
        K = float(data['K'])
        features = np.array([[N, P, K]])
        prediction = model.predict(features)
        crop = prediction[0]
        return jsonify({'crop': crop})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
