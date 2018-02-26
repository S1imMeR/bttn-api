import request from 'request';
import config from '../config';

function sendResponseToButton(callbackUrl, responseMessage) {
  request({
    uri: callbackUrl,
    method: 'POST',
    headers: {
      'X-Api-Key': config.get('ttnApiKey'),
    },
    json: {
      result: responseMessage,
    },
  });
}

export function sendSuccessToButton(callbackUrl) {
  sendResponseToButton(callbackUrl, config.get('callbackSuccessResultMessage'));
}

export function sendFailToButton(callbackUrl) {
  sendResponseToButton(callbackUrl, config.get('callbackFailResultMessage'));
}