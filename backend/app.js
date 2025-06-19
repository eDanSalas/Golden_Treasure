const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes/routes');

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api/mail', routes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});