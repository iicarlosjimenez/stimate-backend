const express = require("express");
const areaUseCase = require("../usecases/area.usecase")

const router = express.Router();

router.get("/", areaUseCase.index);
router.get("/:id", areaUseCase.show);
router.post("/", areaUseCase.create);
router.put("/:id", areaUseCase.update);
router.delete("/:id", areaUseCase.delete);

module.exports = router;