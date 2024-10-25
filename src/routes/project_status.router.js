const express = require("express");
const statusUseCase = require("../usecases/project_status.usecase")

const router = express.Router();

router.get("/", statusUseCase.index);
router.get("/:id", statusUseCase.getOneStatus);
router.post("/", statusUseCase.CreateStatus);
router.put("/:id", statusUseCase.updateStatus);
router.delete("/:id", statusUseCase.deleteStatus);

module.exports = router;