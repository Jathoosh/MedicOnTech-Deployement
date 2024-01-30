FROM node:lts

ARG port=3000
ENV PORT=$port

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
RUN npm install
EXPOSE $port
CMD ["npm", "start"]