
import subprocess
import sys
import os

pemFile = "../../appServer_nvirginia_ubuntu.pem"

if (len(sys.argv) < 2):
    print("Usage: python", sys.argv[0], "<directory containing features/ folder>")
    exit()
# remotePath = sys.argv[2]  # ex: /home/ubuntu/contentData/tvShows/Friends/02/
episodeFolder = sys.argv[1] # tvShows/Friends/02/2-The-One-With-The-Breast-Milk/

origFeaturesDir = os.path.join(episodeFolder, "features")
assert os.path.isdir(origFeaturesDir), "no features/ folder found inside "+episodeFolder

tmpsplit = episodeFolder.split("/")
if tmpsplit[-1] == "": tmpsplit = tmpsplit[:-1]
episodeFolderName = tmpsplit[-1]

# send tmpRepeatDirectory that has features folder inside it
remotePath = os.path.join("~", "contentData")
remotePath = os.path.join(remotePath, episodeFolder)

# remotePath = os.path.join(remotePath, episodeFolderName)
# cmd = " ".join(["scp -i", pemFile, "-r", tmpRepeatDirectory, "ubuntu@3.91.111.9:"+remotePath])
cmd = " ".join(["scp -i", pemFile, "-r", origFeaturesDir, "ubuntu@3.91.111.9:"+remotePath])
print("running $", cmd)
result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, shell=True)
print(result)

print("features added to ", remotePath)
print("----------------- Pce ✌ ------------------")

