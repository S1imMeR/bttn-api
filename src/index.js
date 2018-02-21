import express from 'express';
import bodyParser from 'body-parser';
import request from 'request';
import http from 'http';
import WebSocket from 'ws';
import Raven from 'raven';
import config from './config';
import { getWinners } from './db/event';
import eventRouter from './routes/event';
import { sendMessageToAllClients, formatWinners } from './utils';
const app = express();
const server = http.createServer(app);
export const wss = new WebSocket.Server({ server });


Raven.config(config.sentryDSN, {
  captureUnhandledRejections: true,
}).install();

app.use(Raven.requestHandler());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/event', eventRouter);

app.use(Raven.errorHandler());

app.get('/health-check', (req, res) => {
  res.status(200).json({
    status: 'ok',
  });
});

wss.on('connection', async (ws) => {
  try {
    const winners = await getWinners();
  
    ws.send(JSON.stringify({
      type: 'LAST_WINNERS_LIST',
      data: {
        winners: formatWinners(winners),
      },
    }));
  } catch(err) {
    console.log('Error while sending list of winners');
    console.log(err);
  }

  ws.on('message', (message) => {
      //log the received message and send it back to the client
      console.log('received: %s', message);
      ws.send(`Hello, you sent -> ${message}`);
  });

  ws.on('error', () => console.log('errored'));
});

server.listen(8080, () => console.log('Example app listening on port 8080!'));