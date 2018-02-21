import request from 'request';
import { Router } from 'express'
import { insertButtonClickedEvent, getAllEventsCount } from '../db/event';
import config from '../config';
import { sendSuccessToButton, sendFailToButton } from '../api/index';
import { wss } from '../index';
import { sendMessageToAllClients } from '../utils';

const router = Router();

router.post('/', async (req, res, next) => {
  const {
    CALLBACKURL: callbackUrl,
    ID: buttonId,
    // EID: eventId,
    CASHREGISTER: cashRegister,
   } = req.body;

   if (!callbackUrl) {
    return next(new Error('Callback URL must be specified for the event'));
  }
   
   if (!cashRegister) {
     return next(new Error('Cash register must be specified for the event'));
   }

  try {
    const allEventsCount = await getAllEventsCount();
    const isWinner = (allEventsCount + 1) % config.winnerDivisor === 0;

    const insertedEvent = await insertButtonClickedEvent({
      buttonId,
      cashRegister,
      isWinner,
    });

    if (isWinner) {
      sendSuccessToButton(callbackUrl);
      console.log(insertedEvent);
      sendMessageToAllClients(wss, {
        type: 'LAST_WINNER',
        data: {
          cashRegister,
          eventId: insertedEvent._id,
        },
      });
      
    } else {
      sendFailToButton(callbackUrl);
      sendMessageToAllClients(wss, {
        type: 'LAST_LOSER',
        data: {
          cashRegister,
          eventId: insertedEvent._id,
        },
      });
    }

  } catch (err) {
    console.log('Error', err);
    next(new Error(err));
  }

  res.set({
    'Connection': 'close',
    'Content-Length': '0',
  }).status(200).send();
});

export default router;