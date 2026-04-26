const express = require('express');
const cors = require('cors');
require('dotenv').config();

const personsRouter = require('./routes/persons');
const readingsRouter = require('./routes/readings');
const recordsRouter  = require('./routes/records');

const app = express();

app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
  ],
  credentials: true,
}));
app.use(express.json());

app.use('/api/persons',  personsRouter);
app.use('/api/readings', readingsRouter);
app.use('/api/records',  recordsRouter);

app.get('/health', (_, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));