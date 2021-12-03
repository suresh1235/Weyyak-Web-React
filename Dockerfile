FROM node:14.17-slim

MAINTAINER krishna.chaitanya@zee.esselgroup.com

# make the 'weyyakweb' folder the current working directory
WORKDIR /var/www/projects/weyyak

# Copy the conf files into the docker container
COPY . /var/www/projects/weyyak

# Install npm
RUN npm install

# Install pm2
RUN npm install pm2 -g

# build app for production with minification
RUN npm run build

VOLUME /var/www/projects/weyyak

EXPOSE 3001

CMD [ "pm2-runtime", "start", "server/index.js" ]