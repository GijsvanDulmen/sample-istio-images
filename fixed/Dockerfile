FROM node:15-buster-slim

WORKDIR /usr/src/app
COPY package.json /usr/src/app/

RUN npm install --loglevel verbose --production

COPY index.js /usr/src/app/
COPY template.html /usr/src/app/

EXPOSE 8082

CMD [ "node", "/usr/src/app/index.js" ]