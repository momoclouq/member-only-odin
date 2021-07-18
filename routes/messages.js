var express = require('express');
var router = express.Router();

const message_controller = require("../controllers/message_controller");

/* GET users listing. */
router.get('/', message_controller.message_list);

router.get("/:id", message_controller.message_detail);

module.exports = router;
