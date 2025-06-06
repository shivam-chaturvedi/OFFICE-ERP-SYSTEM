const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth.routes');
const authMiddleware = require('./middlewares/auth.middleware');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(authMiddleware.verifyToken(['/api/auth/login','/api/auth/verify-token']))

mongoose.connect('mongodb://localhost:27017/erpdb').then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err)); 

app.use('/api/auth', authRoutes); 

const PORT = 3000;
app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server running on port localhost:${PORT}`);
});
