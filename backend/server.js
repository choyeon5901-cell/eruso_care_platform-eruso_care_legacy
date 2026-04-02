const express = require('express');
const app = express();

app.use(express.json());

app.get('/reservations', (req, res) => {
  res.json([]);
});

app.listen(4000, () => console.log('Server running on 4000'));
