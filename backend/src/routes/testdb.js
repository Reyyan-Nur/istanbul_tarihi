const express = require('express');
const { testDbConnection } = require('../config/db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const dbInfo = await testDbConnection();

    res.json({
      status: 'ok',
      message: 'Database connection successful',
      database: dbInfo.database_name,
      serverTime: dbInfo.now,
    });
  } catch (error) {
    console.error('Database test failed:', error);

    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message,
    });
  }
});

module.exports = router;
