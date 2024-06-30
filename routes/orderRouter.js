const express = require('express');
const router = express.Router();

// Define routes
router.get('/', (req, res) => {
  res.send('This is a Order Route');
});

module.exports = router;