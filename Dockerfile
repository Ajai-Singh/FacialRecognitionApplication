FROM node:14-alpine

WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

RUN npm install

# Copy the rest of the application code to the container
COPY . .

EXPOSE 3000

CMD ["npm", "start"]