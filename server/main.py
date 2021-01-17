from flask import Flask, render_template
import computation
app = Flask(__name__)

@app.route('/')
def index():
  return render_template('main.html')

@app.route('/my-link/')
def my_link():
  return computation.color_weight_pred('map.jpg')

if __name__ == '__main__':
  app.run(debug=True)