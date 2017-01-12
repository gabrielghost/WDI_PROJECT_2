const App = App || {};

console.log('working');
App.API = '';
App.clientId = 'oauthclient_00009GHhx8useUIPuaxl2X';
App.clientSecret =  'MVKUHgeLLnTeQ8eFqWNLbSTphaLJ4G8PQTZcGbXo2eZApnOtoJj5pHHtLobjTI835LwfkWHJpBV3gQ8HUDtg';
App.redirect_uri = 'http%3A%2F%2Flocalhost%3A7000%2Fcallback';

App.init = function(){
  // App.monzoCallback();
  App.apiUrl = 'http://localhost:3000/api';
  App.redirect_uri = 'http%3A%2F%2Flocalhost%3A7000%2Fcallback';
  App.monzoAuth();
};

App.monzoAuth = function(){
  console.log('running');
  $.get('http://localhost:3000/api/monzo-redirect')
  .done(data => {
    $('.monzo').html(`<a target="_blank" href="https://auth.getmondo.co.uk/?redirect_uri=${App.redirect_uri}&client_id=${data.url}&response_type=code">login to monzo</a>`);
  });
};


// App.monzoCallback = function(req, res){
//   console.log('monzoAuth running clientside');
//   $.get('http://localhost:3000/callback').done(data => {
//     console.log(data);
//   });
  // getAccessToken(code, state);
  // return res.redirect('/');
// };

$(App.init.bind(App));

// function getAccessToken(code, state){
//   console.log('getAccessToken'+code);
//   let url = "https://api.getmondo.co.uk/oauth2/token";
//   let authData = {
//     grant_type: 'authorization_code',
//     client_id: clientId,
//     client_secret: clientSecret,
//     redirect_uri: redirect_uri,
//     code: code
//   };
//   monzoRequest(url, authData);
// }
//
// function monzoRequest(url, authData){
//   App.ajax({
//     type: 'POST',
//     url: url,
//     data: authData,
//     success: authToken,
//     dataType: String
//   });
// }
//
// function authToken(){
//   console.log('you got here!!');
// }
