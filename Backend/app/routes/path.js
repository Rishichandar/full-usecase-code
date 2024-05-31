const express = require("express");
const routeController = require("../controllers/routes/drop.js");
const router = express.Router();

router.delete("/user/clear", routeController.deleteAll);
module.exports = router;
