# Application Server Dockerfile

FROM ubuntu:latest

LABEL maintainer="Crossley Rozario <crozariodev@gmail.com"

RUN apt-get update && \
	apt-get -y install build-essential && \
    apt-get -y install python3 && \
    apt-get -y install python3-dev && \
    apt-get -y install python3-pip && \
    apt-get -y install nginx && \
    apt-get -y install autotools-dev && \
    apt-get -y install autoconf && \
    apt-get -y install libtool && \
    apt-get -y install ca-certificates && \
    apt-get -y install g++ && \
    apt-get -y install gcc && \
    apt-get -y install git

RUN pip3 install uwsgi && \
	pip3 install eventlet && \
	pip3 install Flask && \
	pip3 install Flask-SocketIO && \
	pip3 install --upgrade google-cloud-speech && \
	pip3 install scipy && \
	pip3 install urllib3 && \
	pip3 install matplotlib
	

COPY ./ ./app

WORKDIR ./app

# RUN pip3 install -r requirements.txt

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
	make install && \
	cd ../ && \
	rm -rf opensmile/

# COPY ./nginx.conf /etc/nginx/sites-enabled/default

# CMD service nginx start && uwsgi -s /tmp/uwsgi.sock --chmod-socket=666 --manage-script-name --mount /=app:app

EXPOSE 3000

ENTRYPOINT ["python3"]

CMD ["server.py"]

