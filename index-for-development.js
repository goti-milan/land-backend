const express = require('express');
require('dotenv').config({ path: './local.env' });
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController');
const authRoutes = require('./routes/authRoutes');
const storyRoutes = require('./routes/storyRoutes');
const itemRoutes = require('./routes/itemRoutes');
const sentenceRoutes = require('./routes/sentenceRoutes');
const languageRoutes = require('./routes/languageRoutes');
const bodyParser = require('body-parser');

const app = express();

const PORT = process.env.PORT;

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION. Shutting down...');
  server.close(() => process.exit(1));
});

const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose.connect(
  db,
  () => {
    console.log('Connected');
  },
  (err) => console.log(err.message)
);

const origin =
  process.env.NODE_ENV === 'production'
    ? 'https://minr-admin-frontend.herokuapp.com'
    : process.env.FRONTEND_PORT;

  


app.use(cors({ credentials: true, origin }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/v1/users', authRoutes);
app.use('/api/v1/stories', storyRoutes);
app.use('/api/v1/sentences', sentenceRoutes);
app.use('/api/v1/items', itemRoutes);
app.use('/api/v1/languages', languageRoutes)

app.all('*', (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} is not defined!`, 404));
});

app.use(errorController);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
