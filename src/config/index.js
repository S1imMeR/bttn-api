import ConfigStore from 'configstore';

const conf = new ConfigStore('obi', {
  bttnApiKey: '201410AK5a6b2cfboBV3BWnJu-jWn4VP7QBhaePMTL3QbdPyXU0VHK3YwMg69Dcc',
  sentryDSN: 'https://5606586f7c69427e84d7d2e8a8be4224:29bd434d8c3f435fa2226f54d889b1fa@sentry.io/279306',
  winnerDivider: 2,
  callbackSuccessResultMessage: 'success',
  callbackFailResultMessage: 'fail',
});

export default conf;