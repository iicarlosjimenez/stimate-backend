const express = require("express");
const types_recurring = require("../usecases/type_recurring.usecase")

const router = express.Router();

router.get("/", statusUseCase.index);
router.get("/:id", statusUseCase.getOneStatus);
router.post("/", statusUseCase.CreateStatus);
router.put("/:id", statusUseCase.updateStatus);
router.delete("/:id", statusUseCase.deleteStatus);

module.exports = router;