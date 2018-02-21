import db from './index';

// data: {buttonId: number; cashRegister: string; isWinner: boolean;}

export function insertButtonClickedEvent(data) {
  return new Promise((resolve, reject) => {
    db.events.insert(data, (err, insertedDocument) => {
      if (err) {
        return reject(err);
      }

      return resolve(insertedDocument);
    });
  });
}

export function getAllEventsCount() {
  return new Promise((resolve, reject) => {
    db.events.count({}, (err, count) => {
      if (err) {
        return reject(err);
      }

      return resolve(count);
    });
  });
}

export function getLastWinner() {
  return new Promise((resolve, reject) => {
    db.findOne({ isWinner: true }, (err, doc) => {
      if (err) {
        return reject(err);
      }

      return resolve(doc);
    });
  });
}

export function getWinners() {
  return new Promise((resolve, reject) => {
    db.events
      .find({ isWinner: true }, { _id: 1, cashRegister: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .limit(10)
      .exec((err, docs) => {
        if (err) {
          console.log(err);
          return reject(err);
        }

        return resolve(docs);
      });
  });
}