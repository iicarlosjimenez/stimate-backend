const express = require("express")
const cors = require("cors")
const responseHttp = require("./libs/responseHttp")

const app = express()

const projectRouter = require("./routes/project.router")
const paymentRouter = require("./routes/payment.router")

app.use(cors())
app.use(express.json())
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

app.get("/", (request, response) => {
   try {
      responseHttp.success({ response, data: { message: "Stimate APIv1" } })
   } catch (error) {
      const code = error.status
      const message = error.message

      responseHttp.error({ response, code, message })
   }
})

module.exports = app
