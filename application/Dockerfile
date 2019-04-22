# Flask Application Server Dockerfile

FROM ubuntu:latest

LABEL maintainer="Crossley Rozario <crozariodev@gmail.com"

RUN apt-get update && \
	apt-get -y install build-essential && \
    apt-get -y install python3 && \
    apt-get -y install python3-dev && \
    apt-get -y install python3-pip && \
    apt-get -y install autotools-dev && \
    apt-get -y install autoconf && \
    apt-get -y install libtool && \
	apt-get -y install ffmpeg && \
    apt-get -y install ca-certificates && \
    apt-get -y install g++ && \
    apt-get -y install gcc && \
    apt-get -y install git

WORKDIR /usr/src/app

COPY requirements.txt ./

RUN pip3 install -r requirements.txt	

COPY . .

# shell env variable
RUN export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/lib && \
	echo "export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/lib" >> ~/.bashrc

# get opensmile and install it
RUN git clone https://github.com/naxingyu/opensmile.git && \ 
	cd opensmile/ && \
	bash autogen.sh && \
	bash autogen.sh && \
	bash configure && \
	sed -i '117s/(char)/(unsigned char)/g' src/include/core/vectorTransform.hpp && \
	make && \
	make && \
	make install && \
	cd ../ && \
	rm -rf opensmile/

EXPOSE 3000

ENTRYPOINT ["python3"]

CMD ["server2.py"]


