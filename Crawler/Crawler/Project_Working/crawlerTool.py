from Project_Working import Json_Setup
from ND_Crawler_lib import ND_Crawler

class crawlerTool:
    def __init__(self, jsonObject):
        self.jsonOject = jsonObject

    def getListSourceArticle(self):
        json = self.jsonOject
        article = json['article']
        htmlPage = ND_Crawler.ND_crawler(json['htmlLink'])
        self.htmlPage = htmlPage

        if 'className' in article:
            return htmlPage.Get_Page_Data(article['htmlTag'], article['className'])
        else:
            return htmlPage.Get_Page_Data(article['htmlTag'], "notClassName")

    def getDetailElement(self, item, nameElement):
        json = self.jsonOject
        htmlPage = self.htmlPage
        element = json[nameElement]
        result = ''

        if('attribute' not in element):
            # kiểm tra chuỗi cần lấy có nằm bên trong các tag con của tag hiện tại hay không
            if ('tagName' in element) and ('className' in element):
                result = result + htmlPage.Re_Contents(item, element['parentElement'], element['tagName'],
                                                        element['index'],element['className'])
            elif ('tagName' in element) and ('className' not in element):
                result = result + htmlPage.Re_Contents(item, element['parentElement'], element['tagName'],
                                                       element['index'])
            else:
                result = result + htmlPage.Re_Contents(item, element['parentElement'])
        else:
            #lấy giá trị cua thuộc tính
            if(('parentElement' in element) and ('className' in element)):
                result = result + htmlPage.Re_Find_Attribute(item, element['tagName'], element['attribute'], element['index'],
                                                             element['parentElement'], element['className'])
            elif(('parentElement' in element) and ('className' not in element)):
                result = result + htmlPage.Re_Find_Attribute(item, element['tagName'], element['attribute'],
                                                             element['index'], element['parentElement'])
            else:
                result = result + htmlPage.Re_Find_Attribute(item, element['tagName'], element['attribute'],element['index'])
        return result

    def getListJsonArticle(self):
        listSourceArticle = self.getListSourceArticle()
        listArticle = []

        for article in listSourceArticle:
            jsonArticle = {}
            jsonArticle['Title'] = self.getDetailElement(article, 'Title')
            jsonArticle['Sapo'] = self.getDetailElement(article, 'Sapo')
            jsonArticle['Image'] = self.getDetailElement(article, 'Image')
            jsonArticle['LinkDetail'] = self.getDetailElement(article, 'LinkDetail')
            listArticle.append(jsonArticle)

        return listArticle