const express = require("express");
const PaymentUseCase = require("../usecases/payments.usecase")

const router = express.Router();

router.get("/", PaymentUseCase.index); // check status
router.post("/webhook", express.json({ type: 'application/json' }), PaymentUseCase.webhook); // check status
router.get("/config", PaymentUseCase.getPrices); // configuration
router.get("/products", PaymentUseCase.getProducts); // products index
router.post("/product/create", PaymentUseCase.createProduct); // product store
router.get("/customers", PaymentUseCase.getCustomers); // customers index
router.post("/customer", PaymentUseCase.getCustomer); // customer index
router.post("/customer/create", PaymentUseCase.createCustomer); // customer store
router.get("/subscriptions", PaymentUseCase.getSubscriptions); // subscriptions index
router.post("/subscriptions/customer", PaymentUseCase.getSubscriptionsCustomer); // subscriptions customer index
router.post("/subscription/create", PaymentUseCase.createSubscription); // subscription store
router.post("/subscription/cancel", PaymentUseCase.cancelSubscription); // subscription cancel
router.get("/payments", async (request, response) => {
   try {
      //Buscar transacciones pendientes del usuario
      const subscriptions = {}

      response.success({ subscriptions })

   } catch (error) {
      response.error(error.status, error.message )
   }
})

module.exports = router;
