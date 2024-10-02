const cors = require('cors')
const express = require('express')

const app = express()

const projectRouter = require('./routes/project')

app.use(cors())
app.use(express.json())

// Rutas
app.use('/project', projectRouter)

app.get('/', (request, response) => {
   response.json({
      message: 'Stimate APIv1'
   })
})

module.exports = app