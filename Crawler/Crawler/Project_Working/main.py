from Project_Working import Json_Setup
from ND_Crawler_lib import ND_Crawler


#Smartphone
def nguyenkim_smartphone(self):
    nguyenkim = ND_Crawler.ND_crawler(
        "http://www.nguyenkim.com/dien-thoai-di-dong/")
    g_data = nguyenkim.Get_Page_Data("div", "nk-fgp-items")
    name = nguyenkim.Re_Contents(g_data, 1, "div", "label", 0)
    price = nguyenkim.Re_Contents(g_data, 1, "p", "price discount", 0)
    link = nguyenkim.Re_Contents(g_data, 1,"a","",0)
    Json_Setup.Json_Setup.Add_Json(len(price), name, price,price, "03_SMARTPHONE.txt", "SMA_NK", "Single", "03")
def TGDD_smartphone(self):
    TGDD = ND_Crawler.ND_crawler(
        "file:///Users/tuanh/Downloads/DATN/13520178-PhanNhatDang-Crawler_Updated/Crawler/Html_page/Smartphone/TGDD.html")
    g_data = TGDD.Get_Page_Data("figure","bginfo")
    name = TGDD.Re_Find_All(g_data, "span", 0)
    price = TGDD.Re_Find_All(g_data, "strong", 0)
    g_data_link = TGDD.Get_Page_Data("a")
    link = TGDD.Re_Find_All(g_data_link, "https://www.thegioididong.com", "",'/dtdd/',"http")
    Json_Setup.Json_Setup.Add_Json(len(link), name, price, link, "03_SMARTPHONE.txt", "SMA_TGDD", "Single",
                                   "03")
#Laptop
def TGDD_laptop(self):
    TGDD = ND_Crawler.ND_crawler(
        "file:///Users/tuanh/Downloads/DATN/13520178-PhanNhatDang-Crawler_Updated/Crawler/Html_page/Laptop/TGDD.html")
    g_data = TGDD.Get_Page_Data("h3","notClassName")
    name = TGDD.Re_Find_All(g_data,"",0,' ', '***')
    g_data = TGDD.Get_Page_Data("strong","notClassName")
    price = TGDD.Re_Find_All(g_data, "", 0,'.','online')
    g_data = TGDD.Get_Page_Data("a")
    link = TGDD.Re_Find_All(g_data, "https://www.thegioididong.com","",'/laptop/','http')
    Json_Setup.Json_Setup.Add_Json(len(link), name, price, link, "02_LAPTOP.txt", "LAP_TGDD", "Single",
                                   "02")
def nguyenkim_laptop(self):
    nguyenkim = ND_Crawler.ND_crawler(
        "http://www.nguyenkim.com/may-tinh-xach-tay/")
    g_data = nguyenkim.Get_Page_Data("a", "nk-fgp-in-items")
    name = nguyenkim.Re_Contents(g_data, 5)
    price = nguyenkim.Re_Find_All(g_data, "span", 3)
    link = nguyenkim.Re_Find_All(g_data)
    Json_Setup.Json_Setup.Add_Json(len(link), name, price, link, "02_LAPTOP.txt", "LAP_NK", "Single",
                                   "02")

#Tivi
def nguyenkim_tivi(self):
    nguyenkim = ND_Crawler.ND_crawler(
        "https://www.nguyenkim.com/tivi-man-hinh-lcd/")
    g_data = nguyenkim.Get_Page_Data("a","nk-fgp-in-items")
    name = nguyenkim.Re_Find_All(g_data, "p", 0)
    price = nguyenkim.Re_Find_All(g_data, "span", 0)
    link = nguyenkim.Re_Find_All(g_data)
    Json_Setup.Json_Setup.Add_Json(len(link), name, price, link, "01_TIVI.txt", "TIV_NK", "Single",
                                   "01")
def dienmayxanh_tivi(self):
    dienmayxanh = ND_Crawler.ND_crawler(
        'file:///Users/tuanh/Downloads/DATN/13520178-PhanNhatDang-Crawler_Updated/Crawler/Html_page/Tivi/dienmayxanh.html')
    g_data = dienmayxanh.Get_Page_Data("h3", "code")
    name = dienmayxanh.Re_Find_All(g_data, "loopOneTime")
    g_data = dienmayxanh.Get_Page_Data("strong","notClassName")
    price = dienmayxanh.Re_Find_All(g_data, "none","none", ".")
    g_data = dienmayxanh.Get_Page_Data("a")
    link = dienmayxanh.Re_Find_All(g_data,'https://www.dienmayxanh.com',"",'/tivi/', "http")
    Json_Setup.Json_Setup.Add_Json(len(link), name, price, link, "01_TIVI.txt", "TIV_DMX", "Single",
                                  "01")

def tuoitre(self):
    tuoitre = ND_Crawler.ND_crawler(
        'http://tuoitre.vn/tin/phap-luat/20170617/nghi-an-con-ruot-dam-chet-cha-roi-tu-sat/1333332.html')
    g_data = tuoitre.Get_Page_Data("h1", "title-2")
    title = tuoitre.Re_Find_All(g_data, "","","")
    g_data = tuoitre.Get_Page_Data("h2", "txt-head")
    highlight = tuoitre.Re_Find_All(g_data, "","","")
    g_data = tuoitre.Get_Page_Data("div","fck")
    content = tuoitre.Re_Find_All_Text(g_data)
    g_data = tuoitre.Get_Page_Data("span", "date")
    time = tuoitre.Re_Find_All(g_data,"","","")
    g_data = tuoitre.Get_Page_Data("div", "author")
    author = tuoitre.Re_Find_All(g_data,"", "", "")
    Json_Setup.Json_Setup.Add_DetailJson(len(time), title, highlight, content, "TUOITRE.txt", time, author)

def thanhnien(self):
    thanhnien= ND_Crawler.ND_crawler(
        'http://thanhnien.vn/the-gioi/')
    g_data = thanhnien.Get_Page_Data("article", "list-article cate-list-article clearfix")
    time = thanhnien.Re_Find_All(g_data,"time",0)
    name = thanhnien.Re_Find_All(g_data, "h2", 0)
    highlight = thanhnien.Re_Find_All(g_data,"div",1)
    Json_Setup.Json_Setup.Add_NewJson(len(time), name, highlight,time, "NEWS.txt", "THANHNIEN_THEGIOI")



def main(self):
    dienmayxanh_tivi(self)
    TGDD_smartphone(self)
    TGDD_laptop(self)
    nguyenkim_laptop(self)
    nguyenkim_tivi(self)



if __name__ == "__main__":
    main("")