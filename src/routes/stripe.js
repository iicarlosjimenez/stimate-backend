const express = require("express");
const utils = require("../libs/utils");
const createError = require("http-errors");
const validator = require("../libs/validator");
const { default: slugify } = require("slugify");

const router = express.Router();

// store
router.post("/create-customer", async (req, res) => {
   const { email, name } = req.body
   const customer = await stripe.customers.create({
      email: "test@gmail.com",
      name: "Test_User"
   }
   )

   res.send(customer)
});

// show
router.get("/create-subscription", async (req, res) => {
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
