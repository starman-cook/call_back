FROM node:16-slim as build-stage

WORKDIR /call_back

ENV PATH ./node_modules/.bin:$PATH

COPY . .

RUN npm install --silent

RUN npm run build


FROM nginx:1.21.6-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /call_back/public /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
