const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const validator = require("../libs/validator");

const router = express.Router();

// stripe configuration
router.get("/config", async (req, res) => {
   const prices = await stripe.prices.list();
 
   res.send({
     publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
     prices: prices.data,
   });
 });

 // stripe check status
router.get("/", (req, res) => {
   res.json({message: "Stripe"})
})

// index product
router.get("/product", async (req, res) => {
   const products = await stripe.products.list();
   res.send(products)
})

// store product
router.post("/product/create", async (req, res) => {
   const rules = {
      name: ["required"]
   };
   const validate = validator(rules, req.body);

   if (!validate.validated) {
      res.status(400)
      res.send({ status: false, messages: validate.messages });
      return
   }

   const products = await stripe.products.search({
      query: 'name: \'' + req.body.name + '\'', limit: 1
    });

   let product = null
   if (products.data.length) 
      product = products.data[0]
   else 
      product = await stripe.products.create(req.body)

   const prices = await stripe.prices.search({
      query: 'product:\'' + product.id + '\' ',
   });

   let price = null
   if (prices.data.length)
      price = prices.data[0]
   else
      price = await stripe.prices.create({
         unit_amount: 100,
         currency: 'usd',
         recurring: {
            interval: 'month',
         },
         product: product.id
      })
   
   res.send({product, price})
})

// store customer
router.post("/customer/create", async (req, res) => {
   const rules = {
      email: ["required", "email"]
   };
   const validate = validator(rules, req.body);

   if (!validate.validated) {
      res.status(400)
      res.send({ status: false, messages: validate.messages });
      return
   }
   const { email } = req.body

   // Validar si existe el correo en nuestra base de datos
   // Si no existe, crearlo en stripe
   // Si existe, validar si cuenta con id de stripe
   let customer = null 
   const customers = await stripe.customers.search({
      query: 'email:\'' + email + '\' '
   })
   
   // si no cuenta con id, crearlo en stripe 
   try {
      if (!customers.data.length)
         customer = await stripe.customers.create({ email })
      else 
         customer = customers.data[0]

      res.send(customer)
   } catch (error) {
      return res.status(400).send({ error: { message: error.message } });
   }
});

// store subscription
router.post("/subscription/create", async (req, res) => {
   const rules = {
      customer: ["required"],
      price: ["required"]
   };
   const validate = validator(rules, req.body);

   if (!validate.validated) {
      return res.status(400).send({ status: false, messages: validate.messages });
   }

   const { customer, price } = req.body

   // El cliente debe tener un método de pago predeterminado...
   try { 
      const subscription = await stripe.subscriptions.create({
         customer,
         items: [{ price }],
         payment_behavior: "default_incomplete",
         expand: ["latest_invoice.payment_intent"],
      });
   
      res.send({
         subscriptionId: subscription.id,
         clientSecret: subscription.latest_invoice.payment_intent.client_secret,
       });

   }
   catch (error) {
      return res.status(400).send({ error: { message: error.message } });
   }
})

// index subscriptions
router.get("/subscriptions", async (req, res) => {

   const subscriptions = {
      data: {}
   }

   res.send({ subscriptions })
})

//Buscar transacciones pendientes del usuario
router.get("/payments", async (req, res) => {

   const subscriptions = {
      data: {}
   }

   res.send({ subscriptions })
})

module.exports = router;
