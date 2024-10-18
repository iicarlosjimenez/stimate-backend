const express = require("express");
const statusUseCase = require("../usecases/project_status.usecase")

const router = express.Router();

router.get("/", statusUseCase.index);
router.get("/status", statusUseCase.getStatus)
router.post("/Create", statusUseCase.CreateStatus)

module.exports = router;