var express = require("express");
var router = express.Router();
require("dotenv").config();

const useController = require("../controllers/usersController");

router.post("/signIn", useController.signIn);
router.post("/bookSession", useController.bookSession);
router.post("/list/bookedSession", useController.bookedSession);
router.post("/updateSession", useController.updateSession);

module.exports = router;
