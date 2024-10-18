const express = require("express")
const cors = require("cors")
const responseMiddleware = require("./middlewares/responseHttp");

const app = express()

const projectRouter = require("./routes/project.router")
const paymentRouter = require("./routes/payment.router")
const project_status = require("./routes/project_status.router")

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
   console.log("");
} 
else {
   console.log("Stripe environments, OK!");
   
}

// Rutas
app.use("/project", projectRouter)
app.use("/payment", paymentRouter)
app.use("/status", project_status)

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
