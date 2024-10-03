const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY_SANDBOX)
const createError = require("http-errors");
const validator = require("../libs/validator");

const router = express.Router();

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
      email: ["required"],
      name: ["required"]
   };
   const validate = validator(rules, req.body);

   if (!validate.validated) {
      res.status(400)
      res.send({ status: false, messages: validate.messages });
      return
   }
   const { email, name } = req.body
   const customer = await stripe.customers.create({
      email, name
   }
   )

   res.send(customer)
});

// store subscription
router.post("/subscription/create", async (req, res) => {
   const rules = {
      plan: ["required"],
      email: ["required"],
      stripeToken: ["required"]
   };
   const validate = validator(rules, req.body);

   if (!validate.validated) {
      res.status(400)
      res.send({ status: false, messages: validate.messages });
      return
   }

   const { plan, email, stripeToken } = req.body

   const customer = await stripe.customers.create({
      email: email,
      source: stripeToken,
   });

   const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ plan: plan }],
   });

   res.send({ subscription });
})

module.exports = router;
