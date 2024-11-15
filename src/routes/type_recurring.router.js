const express = require("express");
const type_recurringUseCase = require("../usecases/type_recurring.usecase")

const router = express.Router();

router.get("/", type_recurringUseCase.index);
router.get("/:code", type_recurringUseCase.show);
//.post("/", type_recurringUseCase.create);
//router.put("/:code", type_recurringUseCase.update);
//router.delete("/:code", type_recurringUseCase.delete);

module.exports = router;