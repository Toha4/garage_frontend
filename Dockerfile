# Stage 0, "build"
FROM node:16.17.1-alpine as build

ARG REACT_APP_API_URL

WORKDIR /usr/src/app
COPY package*.json ./
COPY yarn*.lock ./
RUN yarn cache clean && yarn --update-checksums
COPY . ./

ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN yarn && yarn build

# Stage 1 ready for production with Nginx
FROM nginx:stable-alpine-perl

RUN apk add --no-cache nginx-mod-http-perl

## Copy build dir
COPY --from=build /usr/src/app/build /usr/share/nginx/html

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
