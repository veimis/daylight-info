FROM nginx:alpine

COPY src/ /www/data/
COPY nginx.conf /etc/nginx/nginx.conf

