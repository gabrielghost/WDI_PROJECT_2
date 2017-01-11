const MonzoApi = require('monzo-api');

const clientId = 'oauthclient_00009GHhx8useUIPuaxl2X';
const clientSecret = 'MVKUHgeLLnTeQ8eFqWNLbSTphaLJ4G8PQTZcGbXo2eZApnOtoJj5pHHtLobjTI835LwfkWHJpBV3gQ8HUDtg';
const verificationCode = 'code-that-server-gets-after-the-redirection';
const verificationStateToken = 'state-token-received-in-query-string-after-redirection';
const monzoApi = new MonzoApi(clientId, clientSecret);

monzoApi.redirectUrl = 'http://127.0.0.1/monzo-validation';

console.log('Redirect the user to', monzoApi.authorizationUrl);

monzoApi.authenticate(code, 'exampleStateToken')
        .then((res) => {
            console.log("Congrats, you're logged in", res);
        })
        .catch((err) => {
            console.error('Uh Oh! Something wrong happened. :(');
            console.error(err);
        });
