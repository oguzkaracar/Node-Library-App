const express = require('express');
const router = express.Router();

// index sayfası route.
router.get('/', (req, res) =>{ 
    res.render('index');
})

module.exports = router;
