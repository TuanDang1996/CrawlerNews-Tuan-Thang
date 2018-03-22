import json, codecs
import time
import os

class Json_Setup:
    def Read_Text_File(self, directoryName, fileName):
        with open("//Users//tuanh//Downloads//CrawlerNews-Tuan-Thang//Crawler//Crawler//JSON//" + directoryName + "//" + fileName + '.json') as myfile:
            return json.load(myfile)