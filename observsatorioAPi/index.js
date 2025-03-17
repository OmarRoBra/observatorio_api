const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const newsRoutes = require('./src/routes/newsRoutes');
const userRoutes = require('./src/routes/userRoutes');
/* const dataRoutes = require('./src/routes/dataRoutes');
 */ const authMiddleware = require('./src/middlewares/auth');

const app = express();
require('dotenv').config();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/public', express.static('public'));

// Conexión a MongoDB
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error conectando a MongoDB', err));

// Rutas
app.use('/api/news', newsRoutes);
app.use('/api/users', userRoutes);
/* app.use('/api/data', authMiddleware, dataRoutes);
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
