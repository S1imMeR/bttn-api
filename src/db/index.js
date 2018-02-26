import Datastore from 'nedb';

const db = {
  events: new Datastore({
    filename: '../events.db',
    autoload: true,
    timestampData: true,
  }),
};

export default db;