FROM debian:jessie

WORKDIR /tmp/nginx

RUN apt-get update && \
    apt-get -y install nginx

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]