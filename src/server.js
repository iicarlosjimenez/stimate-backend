const cors = require('cors')
const express = require('express')

const app = express()

app.use(cors())
app.use(express.json()) // Middleware

// Rutas
app.get('/', (request, response) => {
   response.json({
      message: 'Stimate APIv1'
   })
})

module.exports = app