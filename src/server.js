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
const sendEmail = require("./libs/email");

app.use(cors())
app.use(express.json())
app.use(responseMiddleware)

if (
   !process.env.STRIPE_SECRET_KEY ||
   !process.env.STRIPE_PUBLISHABLE_KEY 
) {
   console.error(
      "The .env file is not configured. Follow the instructions in the readme to configure the .env file. https://github.com/stripe-samples/subscription-use-cases"
   );
} 
else {
   console.error("Stripe environments, OK!");
   
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

app.post('/send-email', async (request, response) => {
   // NO se requiere una ruta, esto solo es de ejemplo, de como utilizar sendEmail() 
   // Dirigite a users.usecase.js:21
   try {
      const to = request.body.email;
      const subject = "Stimate - Verificación de correo"
      const html = `<button style="background: blue;">Verificar correo</button>`
      const result = await sendEmail({
         to,
         subject,
         html: html || ''
      });
      response.success({ ...result });
   } catch (error) {
      response.error(error.status || 500, error.message)
   }
});

module.exports = app
