const express = require('express');
const cors = require('cors');

const healthRoutes = require('./routes/health');
const testDbRoutes = require('./routes/testdb');
const placesRouter = require('./routes/places');

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/health', healthRoutes);
app.use('/testdb', testDbRoutes);
app.use('/places', placesRouter);

app.get('/', (req, res) => {
  res.json({
    message: 'Istanbul Tarihi backend is running',
    status: 'ok',
  });
});

module.exports = app;
