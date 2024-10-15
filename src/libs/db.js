require('dotenv').config()
const mongoose = require('mongoose')

const {
   DB_USER,
   DB_PASS,
   DB_HOST,
   DB_NAME
} = process.env

const URI = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/?retryWrites=true&w=majority&appName=${DB_NAME}`

function connect() {
   return mongoose.connect(URI)
}

function close() {
   mongoose.connection.close(() => {
      console.info("MongoDB connection closed.");
      process.exit(0);
   })
}

module.exports = { connect, close }