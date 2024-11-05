const cors = require('cors')
const express = require('express')
const usersRouter = require('./routes/users.router')
const responseMiddleware = require("./middlewares/responseHttp");

const app = express()

const projectRouter = require("./routes/project.router")
const paymentRouter = require("./routes/payment.router")
const project_status = require("./routes/project_status.router")
const type_recurring = require("./routes/type_recurring.router")
const area = require("./routes/area.router")

app.use(cors())
app.use(express.json())
app.use(responseMiddleware)

if (
   !process.env.STRIPE_SECRET_KEY ||
   !process.env.STRIPE_PUBLISHABLE_KEY 
) {
   console.log(
      "The .env file is not configured. Follow the instructions in the readme to configure the .env file. https://github.com/stripe-samples/subscription-use-cases"
   );
} 
else {
   console.log("Stripe environments, OK!");
   
}

// Rutas
app.use("/project", projectRouter)
app.use("/payment", paymentRouter)
app.use('/users', usersRouter)
app.use("/status", project_status)
app.use("/type_recurring", type_recurring)
app.use("/area", area)

app.get("/", (request, response) => {
   try {
      response.success({ message: "Stimate APIv1" })
   } catch (error) {
      const code = error.status
      const message = error.messages

      response.error(code, message)
   }
})

module.exports = app
