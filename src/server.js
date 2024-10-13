const express = require('express')
const cors = require('cors')
require('dotenv').config();

const app = express()

const projectRouter = require('./routes/project.router')
const stripeRouter = require('./routes/stripe.router')

app.use(cors())
app.use(express.json())
if (
   !process.env.STRIPE_SECRET_KEY ||
   !process.env.STRIPE_PUBLISHABLE_KEY 
) {
   console.log(
      'The .env file is not configured. Follow the instructions in the readme to configure the .env file. https://github.com/stripe-samples/subscription-use-cases'
   );
   console.log('');
} 
else {
   console.log('Stripe environments, OK!');
   
}

// Rutas
app.use('/project', projectRouter)
app.use('/stripe', stripeRouter)

app.get('/', (request, response) => {
   response.json({
      message: 'Stimate APIv1'
   })
})

module.exports = app
