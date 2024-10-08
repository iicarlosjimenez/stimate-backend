const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY_SANDBOX)
const createError = require("http-errors");
const validator = require("../libs/validator");

const router = express.Router();

router.get('/config', async (req, res) => {
   const prices = await stripe.prices.list();
 
   res.send({
     publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
     prices: prices.data,
   });
 });

router.get("/", (req, res) => {
   res.json({message: "Stripe"})
})

// index
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
   if (products.data.length) {
      res.send(products.data[0])
      return
   }

   const product = await stripe.products.create(req.body)

   const price = await stripe.prices.create({
      unit_amount: 100,
      currency: 'usd',
      recurring: {
         interval: 'month',
      },
      product: product.id
   })
   
   res.send(product)
})

// store customer
router.post("/customer/create", async (req, res) => {
   const rules = {
      email: ["required"]
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
     // si no cuenta con id, crearlo en stripe 
   const customer = await stripe.customers.create({email})

   res.send(customer)
});

// store subscription
router.post("/subscription/create", async (req, res) => {
   const rules = {
      customerId: ["required"],
      price: ["required"]
   };
   const validate = validator(rules, req.body);

   if (!validate.validated) {
      res.status(400)
      res.send({ status: false, messages: validate.messages });
      return
   }

   const { customerId, price } = req.body

   // El cliente debe tener un método de pago predeterminado...
   try { 
      const subscription = await stripe.subscriptions.create({
         customer: customerId,
         items: [{ price }],
         payment_behavior: 'default_incomplete',
         expand: ['latest_invoice.payment_intent'],
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

module.exports = router;
