const cors = require('cors')
const express = require('express')
const usersRouter = require('./routes/users.router')

const app = express()

const projectRouter = require('./routes/project')

app.use(cors())
app.use(express.json())
app.use('/users', usersRouter)

// Rutas
app.use('/project', projectRouter)

app.get('/', (request, response) => {
   response.json({
      message: 'Stimate APIv1'
   })
})

module.exports = app