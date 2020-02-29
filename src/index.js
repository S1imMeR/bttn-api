import express from 'express';
import bodyParser from 'body-parser';
import request from 'request';
import http from 'http';
import WebSocket from 'ws';
import Raven from 'raven';
import config from './config';
import { getWinnersCountToday, getAllEventsCount } from './db/event';
import eventRouter from './routes/event';
import { sendMessageToAllClients, formatWinners } from './utils';
const app = express();
const server = http.createServer(app);
export const wss = new WebSocket.Server({ server });
/*
Raven.config(config.get('sentryDSN'), {
  captureUnhandledRejections: true,
}).install();

app.use(Raven.requestHandler());
*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/event', eventRouter);

//app.use(Raven.errorHandler());

app.get('/health-check', (req, res) => {
  res.status(200).json({
    status: 'ok',
  });
});

wss.on('connection', async (ws) => {
  setInterval(() => {
      try {
        ws.send(JSON.stringify({event: 'ping', type: 'test'}));
      } catch (err) {

      }
  }, 60000);
  /*
  try {
    const eventsCount = await getAllEventsCount();

    ws.send(JSON.stringify({
      type: 'ONCONNECT',
      count: 'TODAY EVENTS: ' + eventsCount,
    }));

    ws.send(JSON.stringify({
      type: 'TEST',
    }));

  } catch(err) {
    console.log('Error while sending list of events');
    console.log(err);
  }
*/

  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message);
    //console.log(message);

//    if (parsedMessage.type !== 'SAVE_OPTIONS' || !parsedMessage.options) {
//      return;
//    }
//
//   const {options} = parsedMessage;
//    
//    if (options.winnerDivider) {
//      config.set('winnerDivider', options.winnerDivider);
//    }
  });

  ws.on('error', (err) => console.log('errored', err));
});

server.listen(8081, () => console.log('Example app listening on port 8081!'));