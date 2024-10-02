const cors = require('cors')
const express = require('express')

const app = express()

const projectRouter = require('./routes/project')
const stripeRouter = require('./routes/stripe')

app.use(cors())
app.use(express.json())

// Rutas
app.use('/project', projectRouter)
app.use('/stripe', stripeRouter)

app.get('/', (request, response) => {
   response.json({
      message: 'Stimate APIv1'
   })
})

module.exports = app