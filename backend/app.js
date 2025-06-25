const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes/routes');
const path = require('path');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, './dist/golden-treasure/browser')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});