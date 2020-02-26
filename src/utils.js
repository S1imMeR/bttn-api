export function sendMessageToAllClients(wss, message) {
  const messageObj = JSON.stringify(message);
  //wss.binaryType = 'arraybuffer';
  wss
    .clients
    .forEach(client => {
      client.send(messageObj);
    });
}
/*
export function formatWinners(docs) {
  return docs.map(item => ({
    eventId: item._id,
    cashRegister: item.cashRegister,
    createdAt: item.createdAt,
  }));
}
*/