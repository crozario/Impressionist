FROM debian:jessie

WORKDIR /tmp/nginx

RUN apt-get update && \
    apt-get -y install nginx

COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]