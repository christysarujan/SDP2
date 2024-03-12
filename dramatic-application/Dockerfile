# build
FROM node:18.16.1 as build
WORKDIR /usr/src/app
COPY package*.json ./
COPY .npmrc .
RUN npm ci
COPY . .
ENV NODE_OPTIONS=--max_old_space_size=2048
RUN npm run build

#run
FROM nginxinc/nginx-unprivileged:mainline
USER root



WORKDIR /usr/share/nginx/html
#change this dist/projectname to your project name
COPY --from=build /usr/src/app/dist/app-name/ .
COPY /nginx/nginx.conf /etc/nginx/nginx.conf

RUN chown -R nginx:nginx *

USER nginx
EXPOSE 8080
CMD ["/bin/sh",  "-c", "nginx -g 'daemon off;'"]