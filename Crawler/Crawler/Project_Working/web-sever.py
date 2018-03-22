from flask import Flask, Response
from flask_jsonpify import jsonify
from Project_Working import crawlerTool
from Project_Working import Json_Setup

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
textJson = Json_Setup.Json_Setup()



def crawlerFunction(template):
    crawler = crawlerTool.crawlerTool(template)
    return jsonify(crawler.getListJsonArticle())


@app.route("/")
def hello():
    return "Hello World!"


@app.route('/getJson/<string:category>/<string:vendor>', methods=['GET'])
def get_json(category, vendor):
    return crawlerFunction(textJson.Read_Text_File(category,vendor))


if __name__ == '__main__':
    app.run(port=8888, debug=True)
