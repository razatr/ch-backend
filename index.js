import express, { json } from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connect } from 'mongoose';
import router from './router/index.js';
import errorMiddleware from './middlewares/error-middleware.js';

const PORT = process.env.PORT || 5000;
const app = express();

app.use(json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));
app.use('/api', router);
app.use(errorMiddleware);

const start = async () => {
  try {
    await connect(process.env.DATABASE_URI)
    app.listen(PORT, () => console.log('server started'));
  } catch(e) {
    console.log(e);
  }
}

start();

app.get('/', (req, res) => {
  res.status(200).json('sdfhglkhdf')
});
