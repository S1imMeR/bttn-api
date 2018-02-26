import request from 'request';
import config from '../config';

function sendResponseToButton(callbackUrl, responseMessage) {
  request({
    uri: callbackUrl,
    method: 'POST',
    headers: {
      'X-Api-Key': '201410AK5a6b2cfboBV3BWnJu-jWn4VP7QBhaePMTL3QbdPyXU0VHK3YwMg69Dcc',
    },
    json: {
      result: responseMessage,
    },
  });
}

export function sendSuccessToButton(callbackUrl) {
  sendResponseToButton(callbackUrl, 'success');
}

export function sendFailToButton(callbackUrl) {
  sendResponseToButton(callbackUrl, 'fail');
}