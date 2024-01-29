FROM node:lts

ARG port=3000
ENV PORT=$port

ARG client_host="client"
ENV CLIENT_HOST=$client_host
ARG client_port=8080
ENV CLIENT_PORT=$client_port

ARG db_username="root"
ENV DB_USERNAME=$db_username
ARG db_password="root"
ENV DB_PASSWORD=$db_password

ARG db_host="db"
ENV DB_HOST=$db_host
ARG db_port=3306
ENV DB_PORT=$db_port

COPY ./server /app
WORKDIR /app
EXPOSE $port
CMD ["npm", "run", "start"]