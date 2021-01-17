from flask import Flask, render_template
import computation
app = Flask(__name__)

@app.route('/')
def index():
  return render_template('index.html')

@app.route('/my-link/')
def my_link():
  return computation.color_weight_pred('tree.png')

if __name__ == '__main__':
  app.run(debug=True)