FROM debian:jessie

WORKDIR /tmp/nginx

RUN apt-get update && \
    apt-get -y install nginx openssl && \
    openssl req \
      -x509 \
      -subj "/C=US/ST=NJ/L=JerseyCity/O=NastyDevs/CN=ec2-34-227-109-120.compute-1.amazonaws.com" \
      -nodes \
      -days 365 \
      -newkey rsa:2048 \
      -keyout /etc/ssl/private/nginx-selfsigned.key \
      -out /etc/ssl/certs/nginx-selfsigned.crt

COPY nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]