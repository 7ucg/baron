var express = require('express');
var router = express.Router();
const path = require('path');
const __path = path.join(__dirname, 'views');
/* GET users listing. */
router.get('/', (req, res) => {
  res.render('lock', { title: 'tempban' });
});

module.exports = router;
