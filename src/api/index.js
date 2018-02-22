import request from 'request';
import config from '../config';

function sendResponseToButton(callbackUrl, responseMessage) {
  request({
    uri: callbackUrl,
    method: 'POST',
    headers: {
      'X-Api-Key': config.bttnApiKey,
    },
    json: {
      result: responseMessage,
    },
  });
}

export function sendSuccessToButton(callbackUrl) {
  sendResponseToButton(callbackUrl, config.callbackSuccessResultMessage);
}

export function sendFailToButton(callbackUrl) {
  sendResponseToButton(callbackUrl, config.callbackFailResultMessage);
}