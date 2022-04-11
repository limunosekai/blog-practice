require('dotenv').config();
import koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import api from './api';
import JwtMiddleware from './lib/jwtMiddleware';
import serve from 'koa-static';
import path from 'path';
import send from 'koa-send';

const { PORT, MONGO_URI } = process.env;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((e) => {
    console.log(e);
  });

const app = new koa();
const router = new Router();

router.use('/api', api.routes());

app.use(bodyParser());
app.use(JwtMiddleware);

app.use(router.routes()).use(router.allowedMethods());

const buildDirectory = path.resolve(__dirname, '../../client/build');
app.use(serve(buildDirectory));
app.use(async (ctx) => {
  if (ctx.status === 404 && ctx.path.indexOf('/api') !== 0) {
    await send(ctx, 'index.html', { root: buildDirectory });
  }
});

const port = PORT || 4000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
