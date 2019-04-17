
import requests
import bs4
from bs4 import BeautifulSoup
from scrapeHelpers import *

# page = requests.get("http://www.livesinabox.com/friends/season2/212toasb.htm")
# try the following first just because
page = requests.get("http://www.livesinabox.com/friends/season2/215rryk.htm")
# print(page.content)

soup = BeautifulSoup(page.content, 'html.parser')

# [type(item) is bs4.element.Tag for item in list(soup.children)]
tmp = list(soup.children)
# found that 4th idx has everything (Al)
tmp = tmp[4]
# print(len(tmp))
print(tmp)

print("=============================================================")
tmp2 = list(tmp.children)
# print(len(tmp2))
print(tmp2)

# for i, item in enumerate(tmp):
  # if (type(item) is bs4.element.Tag):
    # print(i)
