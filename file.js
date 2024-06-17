const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

router.post('/upload', auth, (req, res) => {
  const file = req.body.file;
  const filename = req.body.filename;
  const filePath = path.join(__dirname, '../uploads', filename);

  fs.writeFileSync(filePath, file, 'base64');
  res.send({ success: true });
});

module.exports = router;
