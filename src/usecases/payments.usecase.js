const CreateError = require("../libs/CreateError");
const validator = require("../libs/validator");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

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
   
         response.error({ code, message })
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
         response.error({ code: error.status, message: error.messages });
      }
   }
   
   // ### Productos
   getProducts = async (request, response) => {
      try {
         const products = await stripe.products.list();
   
         response.success({ products: products.data })
      } catch (error) {
         response.error({ code: error.status, message: error.messages })
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
         response.error({ code: error.status, message: error.messages })
      }
   }
   
   // ### Clientes 
   getCustomers = async (request, response) => {
      try {
         const customerLists = await stripe.customers.list()
         const customers = customerLists.data
   
         response.success({ customers })
      } catch (error) {
         response.error({ code: error.status, message: error.messages })
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
         response.error({ code: error.status, message: error.messages })
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
   
         // si no cuenta con id, crearlo en stripe 
   
         // Validar si existe el correo en nuestra base de datos
         // Si no existe, crearlo en stripe
         // Si existe, validar si cuenta con id de stripe
         let customer = null
         const customers = await stripe.customers.search({
            query: 'email:\'' + email + '\' '
         })
   
         if (!customers.data.length)
            customer = await stripe.customers.create({ email })
         else
            customer = customers.data[0]
   
         response.success({customer})
      } catch (error) {
         response.error({ code: error.status, message: error.messages })
      }
   }
   
   // ### Suscripciones
   getSubscriptions = async (request, response) => {
      try {
         const subscriptions = await stripe.subscriptions.list()

         response.success({ subscriptions: subscriptions.data })
      } catch (error) {
         response.error({ code: error.status, message: error.messages })
      }
   }
   
   getSubscriptionsCustomer = async (request, response) => {
      try {
         const rules = {
            customer: ["required", "string"]
         };
         const validate = validator(rules, request.body);
      
         if (!validate.validated) {
            throw new CreateError(400, validate.messages);
         }
      
         const { customer } = request.body
         const subscriptions = await stripe.subscriptions.list({
            customer,
            expand: ['data.plan.product']
         });

         response.success({ subscriptions: subscriptions.data })
      } catch (error) {
         response.error({ code: error.status, message: error.messages })
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
            return response.error({ response, code: 400, message: validate.messages })
         }
      
         const { customer, price } = request.body
      
         const subscription = await stripe.subscriptions.create({
            customer,
            items: [{ price }],
            payment_behavior: "default_incomplete",
            expand: ["latest_invoice.payment_intent"],
         });
         
         response.success({ subscription })
      } catch (error) {
         response.error({ code: error.status, message: error.messages })
      }
   }

}

module.exports = new PaymentUseCase();