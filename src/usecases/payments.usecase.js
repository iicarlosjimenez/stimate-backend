const CreateError = require("../libs/CreateError");
const validator = require("../libs/validator");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const logger = require("../libs/logger");
const User = require("../models/User.model");

class PaymentUseCase {
   constructor() {
      this.validator = validator;
      this.stripe = stripe;
   }

   // ### Test
   index = async (request, response) => {
      try {
         response.success({ message: "Stripe" })
      } catch (error) {
         const code = error.status
         const message = error.messages

         response.error(code, message)
      }
   }

   // ### Precios
   getPrices = async (request, response) => {
      try {
         const prices = await stripe.prices.list();
         const data = {
            publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
            prices: prices.data,
         }

         response.success(data)
      } catch (error) {
         response.error(error.status, error.messages);
      }
   }

   // ### Productos
   getProducts = async (request, response) => {
      try {
         const products = await stripe.products.list();

         response.success({ products: products.data })
      } catch (error) {
         response.error(error.status, error.messages)
      }
   }

   createProduct = async (request, response) => {
      try {
         const rules = {
            name: ["required"]
         };
         const validate = validator(rules, request.body);

         if (!validate.validated) {
            throw new CreateError(400, validate.messages);
         }

         const products = await stripe.products.search({
            query: 'name: \'' + request.body.name + '\'', limit: 1
         });

         let product = null
         if (products.data.length)
            product = products.data[0]
         else
            product = await stripe.products.create(request.body)

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

         response.success({ product, price })
      } catch (error) {
         response.error(error.status, error.messages)
      }
   }

   // ### Clientes 
   getCustomers = async (request, response) => {
      try {
         const customerLists = await stripe.customers.list()
         const customers = customerLists.data

         response.success({ customers })
      } catch (error) {
         response.error(error.status, error.messages)
      }
   }

   getCustomer = async (request, response) => {
      try {
         const rules = {
            email: ["required", "email"]
         };
         const validate = validator(rules, request.body);

         if (!validate.validated) {
            throw new CreateError(400, validate.messages);
         }
         const { email } = request.body

         const customers = await stripe.customers.search({
            query: 'email:\'' + email + '\' '
         })

         response.success({ customer: customers.data[0] })
      } catch (error) {
         response.error(error.status, error.messages)
      }
   }

   createCustomer = async (request, response) => {
      try {
         const rules = {
            email: ["required", "email"]
         };
         const validate = validator(rules, request.body);

         if (!validate.validated) {
            throw new CreateError(400, validate.messages);
         }
         const { email } = request.body
         let customer = null

         const customers = await stripe.customers.search({
            query: 'email:\'' + email + '\' '
         })

         if (!customers.data || customers.data.length === 0)
            customer = await stripe.customers.create({ email })
         else
            customer = customers.data[0]

         const user = await User.findByIdAndUpdate(
            request.user.id,
            {
               $set: {
                  'customer_ids.stripe': customer.id
               }
            },
            {
               new: true
            });

         response.success({ customer })
      } catch (error) {
         response.error(error.status, error.messages)
      }
   }

   // ### Suscripciones
   getSubscriptions = async (request, response) => {
      try {
         const subscriptions = await stripe.subscriptions.list()

         response.success({ subscriptions: subscriptions.data })
      } catch (error) {
         response.error(error.status, error.messages)
      }
   }

   getSubscriptionsCustomer = async (request, response) => {
      try {
         const rules = {
            email: ["required"]
         };
         const validate = validator(rules, request.body);

         if (!validate.validated) {
            throw new CreateError(400, validate.messages);
         }

         const { email } = request.body
         const customers = await stripe.customers.search({
            query: 'email:\'' + email + '\' '
         })

         if (!customers.data || customers.data.length === 0) {
            return response.success({ subscriptions: [] });
         }

         const customer = customers.data[0]

         const subscriptions = await stripe.subscriptions.list({
            // status: "active",
            customer: customer.id,
            expand: ["data.plan.product"]
         });

         response.success({
            subscriptions: subscriptions.data,
            customer: customer  // Optional: include customer details
         });
      } catch (error) {
         console.error('Error in getSubscriptionsCustomer:', error);
         response.error(error.status, error.message)
      }

   }

   createSubscription = async (request, response) => {
      try {
         const rules = {
            customer: ["required"],
            price: ["required"]
         };
         const validate = validator(rules, request.body);

         if (!validate.validated) {
            return response.error(400, validate.messages)
         }

         const { customer, price } = request.body

         const subscription = await stripe.subscriptions.create({
            customer,
            items: [{ price }],
            payment_behavior: "default_incomplete",
            expand: ["latest_invoice.payment_intent"],
         });

         response.success({
            subscriptionId: subscription.id,
            clientSecret: subscription.latest_invoice.payment_intent.client_secret
         })
      } catch (error) {
         response.error(error.status, error.messages)
      }
   }

   cancelSubscription = async (request, response) => {
      try {
         const rules = {
            subscriptionId: ["required", "string"]
         };
         const validate = validator(rules, request.body);

         if (!validate.validated) {
            return response.error(400, validate.messages)
         }

         const { subscriptionId } = request.body

         const subscription = await stripe.subscriptions.cancel(subscriptionId);

         response.success({ subscription })
      } catch (error) {
         response.error(error.status, error.messages)
      }
   }

   webhook = async (request, response) => {
      const event = request.body;

      // Archivo log en la carpeta ./log/webhook.log
      switch (event.type) {
         case "payment_intent.succeeded":
            const paymentIntent = event.data.object;
            // Then define and call a method to handle the successful payment intent.
            // handlePaymentIntentSucceeded(paymentIntent);
            await logger.logToFile(`${JSON.stringify(paymentIntent)}`);
            break;

         // ... handle other event types
         default:
            console.log(`Unhandled event type ${event.type}`);
      }

      return response.success({ received: true })
   }

}

module.exports = new PaymentUseCase();
