const express = require("express");
const statusUseCase = require("../usecases/project_status.usecase")

const router = express.Router();

router.get("/", statusUseCase.index);
router.get("/:code", statusUseCase.show);
//router.post("/", statusUseCase.create);
//router.put("/:code", statusUseCase.update);
//router.delete("/:code", statusUseCase.delete);

module.exports = router;