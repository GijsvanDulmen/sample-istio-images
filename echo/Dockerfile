ARG ARCH=
FROM ${ARCH}node:15-buster-slim

WORKDIR /usr/src/app
COPY package.json /usr/src/app/

RUN apt-get update && apt-get install -y curl
RUN npm install --loglevel verbose --production

COPY index.js /usr/src/app/
COPY template.html /usr/src/app/

EXPOSE 8080

CMD [ "node", "/usr/src/app/index.js" ]