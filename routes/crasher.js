var express = require("express");
var router = express.Router();

/* Crash application on every request */
router.get('/', function (req, res) {
   process.exit(75);
});

module.exports = router;