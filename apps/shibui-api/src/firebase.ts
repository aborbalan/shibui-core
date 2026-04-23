import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import express from 'express';
import { onRequest } from 'firebase-functions/v2/https';

const server = express();

const createApp = async () => {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  await app.init();
};

const appReady = createApp();

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const api = onRequest((req, res) => {
  void appReady.then(() => {
    server(req, res);
  });
});
