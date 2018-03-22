import json, codecs
import time
import os

class Json_Setup:
    def Open_folder(self):
        now = time.strftime("%c")
        d = time.strftime("%x" + "_")
        d = d.replace("/", "_")
        t = time.strftime("%X")
        t = t.replace(":", "_")
        dt = d + t
        dt = dt[0:14]
        path = "//Users//tuanh//Downloads//DATN//13520178-PhanNhatDang-Crawler_Updated//Crawler//JSON//" + str(dt)
        newpath = path
        if not os.path.exists(newpath):
            os.makedirs(newpath)
        return dt

    def Add_Json(g_da, name, price,link, json_name, H_I, U, C_Id):
        product = {}
        count = 0

        for num in range(0, g_da):
            product_id = H_I + str(count)
            product[product_id] = {
                'PRODUCTID': product_id,
                'PRODUCTNAME': name[count],
                'UNIT': U,
                'PRICE': price[count],
                'LINK': link[count],
                'CAT_ID': C_Id
            }
            count = count +1
            s = json.dumps(product[product_id])
            with open("//Users//tuanh//Downloads//DATN//13520178-PhanNhatDang-Crawler_Updated//Crawler//JSON//" + Json_Setup.Open_folder(
                    "") + "//" + json_name, "a", encoding='utf8') as f:
                f.write(s)




    def Add_NewJson(g_da, name, highlight,date, json_name, H_I):
        product = {}
        count = 0

        for num in range(0, g_da):
            product_id = H_I + str(count)
            product[product_id] = {
                'PRODUCTID': product_id,
                'NAME': name[count],
                'HIGHLIGHT': highlight[count],
                'DATE': date[count],

            }
            count = count +1
            s = json.dumps(product[product_id])
            with open("//Users//tuanh//Downloads//DATN//13520178-PhanNhatDang-Crawler_Updated//Crawler//JSON//" + Json_Setup.Open_folder(
                    "") + "//" + json_name, "a", encoding='utf8') as f:
                f.write(s)



    def Add_DetailJson(g_da, title, highlight, content, json_name, t_time, author):
        product = {}


        product["0"] = {
                'TITLE': title[0],
                'HIGHLIGHT': highlight[0],
                'CONTENT': content[0],
                'TIME': t_time[0],
                'AUTHOR': author[0]
        }
        return product["0"]
        # s = json.dumps(product["0"],ensure_ascii=False)
        # with open("//Users//tuanh//Downloads//DATN//13520178-PhanNhatDang-Crawler_Updated//Crawler//JSON//" + Json_Setup.Open_folder(
        #          "") + "//" + json_name, "w", encoding='utf8') as f:
        #     f.write(s)
    def Read_Text_File(self, directoryName, fileName):
        with open("//Users//tuanh//Downloads//DATN//13520178-PhanNhatDang-Crawler_Updated//Crawler//JSON//" + directoryName + "//" + fileName + '.json') as myfile:
            return json.load(myfile)