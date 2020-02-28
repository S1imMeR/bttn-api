import request from "request";
import { Router } from "express";
import {
  insertButtonClickedEvent,
  getAllEventsCount,
  getWinnersCountToday,
  getAllEvents,
  getAllWinnersToday,
  getAllWinners,
  getAllEventsToday
} from "../db/event";
import config from "../config";
import { sendSuccessToButton, sendFailToButton } from "../api/index";
import { wss } from "../index";
import { sendMessageToAllClients } from "../utils";
import throttle from "lodash.throttle";

const router = Router();

router.post("/", async (req, res, next) => {
  const {
    CALLBACKURL: callbackUrl,
    ID: buttonId,
    // EID: eventId,
    Event: Event
  } = req.body;

  if (!callbackUrl) {
    return next(new Error("Callback URL must be specified for the event"));
  }

  if (!Event) {
    return next(new Error("Cash register must be specified for the event"));
  }

  try {
    const winnerDivider = config.get("winnerDivider");
    const allEventsCount = await getAllEventsCount();
    const isWinner = (allEventsCount + 1) % winnerDivider === 0;
    const insertedEvent = await insertButtonClickedEvent({
      buttonId,
      Event,
      isWinner,
      divisor: winnerDivider
    });

    if (isWinner) {
      sendSuccessToButton(callbackUrl);
      sendMessageToAllClients(wss, {
        type: "LAST_WINNER",
        data: {
          Event,
          eventId: insertedEvent._id
        }
      });

      const winnersCount = await getWinnersCountToday();

      sendMessageToAllClients(wss, {
        type: "WINNERS_COUNT_TODAY",
        data: {
          count: winnersCount
        }
      });
    } else {
      sendFailToButton(callbackUrl);
      sendMessageToAllClients(wss, {
        type: "NEW EVENT",
        data: {
          Event,
          eventId: insertedEvent._id
        }
      });
    }
  } catch (err) {
    console.log("Error", err);
    next(new Error(err));
  }

  res
    .set({
      Connection: "close",
      "Content-Length": "0"
    })
    .status(200)
    .send();
});

router.get("/today", async (req, res) => {
  const events = await getAllEventsToday();

  res.json(events);
});

router.get("/today/winners", async (req, res) => {
  const events = await getAllWinnersToday();

  res.json(events);
});

router.get("/all", async (req, res) => {
  const events = await getAllEvents();

  res.json(events);
});

router.get("/all/winners", async (req, res) => {
  const events = await getAllWinners();

  res.json(events);
});

// ** For local conversation ** //
router.get(
  "/:Event",
  throttle((req, res) => {
    const { Event } = req.params;

    try {
      // const winnerDivider = config.get("winnerDivider");
      // const allEventsCount = await getAllEventsCount();
      // const isWinner = (allEventsCount + 1) % winnerDivider === 0;
      // const insertedEvent = await insertButtonClickedEvent({
      //   Event,
      //   isWinner,
      //   divisor: winnerDivider
      // });
      // Отсылаю ивент (любой), без условий
      // res.status(200).send();
      sendMessageToAllClients(wss, {
        type: "NEW_CLICK", // переименовал из LAST_WINNER
        event: Event
      });

      // Тут была проверка на победителя, убрал
      /*
    if (isWinner) {
      res.status(200).send();
      sendMessageToAllClients(wss, {
        type: 'EVENT (OLD WINNER)', // переименовал из LAST_WINNER
        data: {
          Event,
          //eventId: insertedEvent._id,
          //isWinner,
        },
      });

/* Убрал вывод всех победителей если ивент победитель
      const winnersCount = await getWinnersCountToday();

      sendMessageToAllClients(wss, {
        type: 'WINNERS_COUNT_TODAY',
        data: {
          count: winnersCount,
        },
      });


    } else {
      res.status(400).send();
      sendMessageToAllClients(wss, {
        type: 'EVENT (OLD_LOSER)',
        data: {
          Event,
          //eventId: insertedEvent._id,
        },
      });
    }
*/
    } catch (err) {
      console.log("Error", err);
      next(new Error(err));
    }

    res
      .set({
        Connection: "close",
        "Content-Length": "0"
      })
      .status(200)
      .send();
  }, 5000)
);

export default router;
