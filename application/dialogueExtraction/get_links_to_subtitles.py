"""
Get links to Friends episodes 

From http://www.livesinabox.com/friends/scripts.shtml
"""

from bs4 import BeautifulSoup
import requests

import re

linkHome = "http://www.livesinabox.com/friends/"
linkEpisodes = linkHome + "scripts.shtml"
page = requests.get(linkEpisodes) # try the following

soup = BeautifulSoup(page.content, 'html5lib')

# html = soup.children()
links_with_tags = soup.find_all('li')

# pilot = links_with_tags[0]
episode_details = [] # info tuples (str link, str seasonNum, str episodeNum, str episodeTitle)
couldntParse = [] # tuples (str tag, str error)
for ii, tag in enumerate(links_with_tags):
    strtag = str(tag)
    text = tag.get_text()
    tmp = text.split(":") # splitting `episode ###: The one with...`
    
    if (len(tmp) is not 2):
        couldntParse.append((strtag, "Couldn't parse tag.get_text(). Skipping..."))
        continue

    episode = tmp[0]
    episode = episode.split() # splitting `episode ###` into two
    if (len(episode) is not 2): 
        couldntParse.append((strtag, "Expected episode (`episode ###`) to split into 2. Skipping..."))
        continue
    
    # get seasonNum and episodeNum
    episode = episode[1]
    if (len(episode) is 3): # for seasons 1-9 (Friends)
        seasonNum = episode[0]
        episodeNum = episode[1:]
    elif (len(episode) is 4): # if season is 10
        seasonNum = episode[:2]
        episodeNum = episode[2:]
    else:
        couldntParse.append((strtag, "Unable to parse episodeNum (#### or ###). Skipping..."))
        continue

    # get epiodeTitle
    episodeTitle = tmp[1]
    episodeTitle = episodeTitle.strip()
    episodeTitle = " ".join(episodeTitle.split())
    
    # get link
    link = re.findall(r'(?:href=\")(.*html?)(?=\">)', str(tag))
    if len(link) is 1: 
        link = link[0]
    else:
        couldntParse.append((strtag, "Unable to find link. Skipping..."))
        continue
    
    info = (linkHome + link, seasonNum, episodeNum, episodeTitle)
    episode_details.append(info)
    print(info)


