FROM jwilder/nginx-proxy
ADD nginx.tmpl /app/nginx.tmpl
ADD custom.conf /etc/nginx/conf.d/custom.conf
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod 0777 /app/docker-entrypoint.sh

