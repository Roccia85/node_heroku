FROM node:20

WORKDIR /app/src

COPY . .

RUN npm install

ENV MESSAGE="Default message"

ENV PORT=3000

EXPOSE 3000

CMD ["npm", "run", "dev"]