FROM node:lts

ARG port=8080
ENV PORT=$port
ARG server_port=3000
ENV SERVER_PORT=$server_port

COPY ./client /app
WORKDIR /app
EXPOSE $port
CMD ["npm", "run", "dev"]