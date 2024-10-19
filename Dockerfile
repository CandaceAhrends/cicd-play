# Use Node.js 20 as the base image
FROM node:20

 
# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY ../package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

ENV POLYGON_APIKEY=test
ENV POLYGON_SOCKET_PORT=8082
ENV POLYGON_SOCKET_URL=wss://delayed.polygon.io/stocks

 

# Expose the port the app runs on (change 3000 to your app's port)
EXPOSE 8082

# Command to run the application
CMD ["npm", "run", "start:socket"]
