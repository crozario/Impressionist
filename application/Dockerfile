FROM ubuntu:latest

RUN apt-get update && \
	apt-get install -y build-essential && \
    apt-get -y install python3 && \
    apt-get -y install python3-pip && \
    apt-get -y install autotools-dev && \
    apt-get -y install autoconf && \
    apt-get -y install libtool && \
    apt-get -y install autotools-dev && \
    apt-get -y install ca-certificates && \
    apt-get -y install g++ && \
    apt-get -y install gcc && \
    apt-get -y install git

RUN pip3 install Flask && \
	pip3 install Flask-SocketIO && \
	pip3 install --upgrade google-cloud-speech && \
	pip3 install scipy && \
	pip3 install urllib3

RUN export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/lib && \
	echo "export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/lib" >> ~/.bashrc

RUN git clone https://github.com/naxingyu/opensmile.git && \ 
	cd opensmile/ && \
	bash autogen.sh && \
	bash autogen.sh && \
	bash configure && \
	sed -i '117s/(char)/(unsigned char)/g' src/include/core/vectorTransform.hpp && \
	make && \
	make && \
	make install
	
WORKDIR /usr/src/app

COPY . .

EXPOSE 3000

CMD [ "python3", "server.py" ]

