var express = require("express");
var router = express.Router();
require("dotenv").config();

const sessionController = require("../controllers/sessionController");

router.get("/list", sessionController.sessionList);

module.exports = router;
