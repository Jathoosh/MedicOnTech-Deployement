FROM mysql:8.0.26
COPY ./scripts/init.sql /docker-entrypoint-initdb.d/
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=db_medicontech

EXPOSE 3306