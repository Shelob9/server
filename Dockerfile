FROM node:10-alpine
EXPOSE 3000
COPY . /home/app
WORKDIR /home/app
RUN npm install
CMD ./scripts/start.sh
