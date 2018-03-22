from urllib.request import Request, urlopen
from bs4 import BeautifulSoup
import ssl

from ND_Crawler_lib import Crawler_Roof


class ND_crawler(Crawler_Roof.Renew_Crawler):
    def __init__(self, h_p):
        self.html_page = h_p

    # OK
    def Get_Page_Data(self, g_data_tag, class_name=None):
        if class_name == "notClassName":
            req = Request(self.html_page, headers={'User-Agent': 'Mozilla/5.0'})
            gcontext = ssl.SSLContext(ssl.PROTOCOL_TLSv1)
            webpage = urlopen(req, context=gcontext).read()

            soup = BeautifulSoup(webpage, "html.parser")
            g_data = soup.find_all(g_data_tag)
        elif class_name == None:
            req = Request(self.html_page, headers={'User-Agent': 'Mozilla/5.0'})
            gcontext = ssl.SSLContext(ssl.PROTOCOL_TLSv1)
            webpage = urlopen(req, context=gcontext).read()

            soup = BeautifulSoup(webpage, "html.parser")

            g_data = soup.find_all(g_data_tag, href=True)
        else:
            req = Request(self.html_page, headers={'User-Agent': 'Mozilla/5.0'})
            gcontext = ssl.SSLContext(ssl.PROTOCOL_TLSv1)
            webpage = urlopen(req, context=gcontext).read()

            soup = BeautifulSoup(webpage, "html.parser")
            g_data = soup.find_all(g_data_tag, {"class": class_name})

        return g_data

    # OK
    def Re_Contents(self, item, parentElement, f_a_n=None, num_find_all=None, class_name=None):
        result = ''
        if f_a_n == None and class_name == None and num_find_all == None:
            element = item.find_all(parentElement['tagName'], {"class": parentElement['className']})
            if (element != []):
                element = element[parentElement['index']]
                str = element.text
                result = result + str
            else:
                result = ''
        else:
            try:
                if ('className' in parentElement):
                    element = item.find_all(parentElement['tagName'], {"class": parentElement['className']})[parentElement['index']]
                else:
                    element = item.find_all(parentElement['tagName'])[parentElement['index']]
                if class_name != None:
                    str = element.find_all(f_a_n, {"class": class_name})[num_find_all].text
                else:
                    str = element.find_all(f_a_n)[num_find_all].text
                result = result + str

            except:
                print('error')
        return result

    # OK
    def Re_Find_All_Text(self, g_da):
        result = []

        for item in g_da:
            string = item.find_all("p")

        def my_count(string, substring):
            string_size = len(string)
            substring_size = len(substring)
            count = 0
            for i in range(0, string_size - substring_size + 1):
                if string[i:i + substring_size] == substring:
                    count += 1
            return count

        num = my_count(str(string), "<p>")

        for item in g_da:
            str0 = ""
            for i in range(0, int(num)):
                str1 = item.find_all("p")[i].text
                str1 = ND_crawler.format_text(self, str1)
                str0 = str0 + str1
        result.insert(0, str0)
        return result

    # OK
    def Re_Find_Attribute(self, item, tagName, attribute, index, parentElement=None, className=None):
        result = ''
        if (parentElement == None):
            # kiem tra xem co class hay khong
            if (className == None):
                element = item.find_all(tagName)
            else:
                element = item.find_all(tagName, {"class": className})
                # kiem tra xem co element nao thao yeu cau khong
            if (element != []):
                str = element[index][attribute]
                result = result + str
            else:
                result = ''
        else:
            # lay thanh phan cha
            if ('className' in parentElement):
                parentItem = item.find_all(parentElement['tagName'], {"class": parentElement['className']})
            else:
                parentItem = item.find_all(parentElement['tagName'])
            if (parentItem != []):
                parent = parentItem[parentElement['index']]
                # kiem tra xem co class hay khong
                if (className == None):
                    element = parent.find_all(tagName)
                else:
                    element = parent.find_all(tagName, {"class": className})
                    # kiem tra xem co element nao thao yeu cau khong
                if (element != []):
                    str = element[index][attribute]
                    result = result + str
                else:
                    result = ''
            else:
                result = ''
        return result
