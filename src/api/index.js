import request from 'request';
import config from '../config';

function sendResponseToButton(callbackUrl, responseMessage) {
  console.log(callbackUrl, responseMessage);
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
  console.log('success');
  sendResponseToButton(callbackUrl, config.callbackSuccessResultMessage);
}

export function sendFailToButton(callbackUrl) {
  console.log('fail');
  sendResponseToButton(callbackUrl, config.callbackFailResultMessage);
}