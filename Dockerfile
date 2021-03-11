FROM node:15.11.0
#alpine image does not work because of avatar-builder

#add user and change ownership of files
RUN adduser --disabled-password --home /home/appuser appuser
RUN chown -R appuser /home/appuser

WORKDIR /home/appuser

#copy package json
COPY ./src/package.json ./
#install dependencies
RUN npm install 

#copy application source
COPY ./src/ ./

#run as user
USER appuser

EXPOSE 8080

#CMD ["/bin/sh"]
CMD ["node","app.js"]
