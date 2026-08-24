const express = require('express');

const router = express.Router(); // endpointleri ayrı dosyalarda duzenlemek için router oluşturuyoruz

router.get('/', (req, res) => { // GET /health
  res.json({
    status: 'ok',
    message: 'Backend is healthy',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
