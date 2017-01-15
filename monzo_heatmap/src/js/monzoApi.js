const App = App || {};
const google = google;

const params = getJsonFromUrl();

App.apiUrl        = 'http://localhost:3000/api';
App.clientId      = 'oauthclient_00009GHhx8useUIPuaxl2X';
App.clientSecret  =  'MVKUHgeLLnTeQ8eFqWNLbSTphaLJ4G8PQTZcGbXo2eZApnOtoJj5pHHtLobjTI835LwfkWHJpBV3gQ8HUDtg';
App.redirect_uri  = 'http%3A%2F%2Flocalhost%3A7000%2Fcallback';
App.account_id    = 'acc_00009FsRvpC42WhUgitVVx';

App.$monzo        = $('.monzo');
App.$header       = $('header');

App.heatMapArray  = [];

if (params.code) {
  $.get(`http://localhost:3000/handshake/?code=${params.code}`)
    .done(data => {
      App.setToken(data.access_token);
      App.home();
      App.reqTransactions();
    });
}

App.home = function(){
  $.get(`http://localhost:3000/`);
};

App.reqTransactions = function() {
  const url = `https://api.monzo.com/transactions?expand[]=merchant&account_id=${App.account_id}`;
  $.ajax({
    url,
    beforeSend: function(xhr) {
      return xhr.setRequestHeader('Authorization', `Bearer ${App.getToken()}`);
    }
  }).done(data => {
    App.heatMapGen(data);
    console.log(data);
  }).fail(data => {
    console.log(data);
  });
};

App.heatMapGen = function(data){
  $.each(data.transactions, (i, transaction) => {
    if (transaction.merchant) {
      App.heatMapArray.push({ location: new google.maps.LatLng(transaction.merchant.address.latitude, transaction.merchant.address.longitude), weight: (Math.abs(transaction.amount/100))});
    }
    App.initMap();
  });
};

App.loggedInState = function(){
  $('.loggedIn').show();
  $('.loggedOut').hide();
};

App.loggedOutState = function(){
  App.toggleHeatmap();
  App.monzoLoginForm();
  $('.loggedIn').hide();
  $('.loggedOut').show();
};

App.logout = function(e){
  e.preventDefault();
  this.removeToken();
  this.loggedOutState();
};

App.removeToken = function(){
  return window.localStorage.clear();
};

function getJsonFromUrl() {
  var query = location.search.substr(1);
  var result = {};
  query.split('&').forEach(function(part) {
    var item = part.split('=');
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}

App.setToken = function(token) {
  return window.localStorage.setItem('token', token);
};

App.getToken = function() {
  return window.localStorage.getItem('token');
};



App.init = function(){
  $('.logout').on('click', this.logout.bind(this));
  $('.login').on('click', this.login.bind(this));
  // App.$monzo.on('submit', 'form', this.handleForm);
  $('.button-collapse').sideNav();
  if (this.getToken()) {
    App.loggedInState();
  } else {
    App.loggedOutState();
  }
};

App.login = function(e) {
  console.log(e);
  e.preventDefault();
const clientIdField = $('.clientId');
const clientSecretField = $('.clientSecret');
  // set client id and secret
const clientId = clientIdField.val();
  console.log(clientIdField.val());
const clientSecret = clientSecretField.val();
  console.log(clientSecretField.val());


  var url = `https://auth.getmondo.co.uk/?client_id=${clientId}&redirect_uri=${App.redirectUri}&response_type=code&state=`;

  if(clientId && clientSecret) {
    window.location.href = url;
  }
};


App.clicked = function() {
  console.log('clicked');
};

App.monzoLoginForm = function(){
  console.log('monzoLoginModal');
  $('.monzo').html(`
    <div id="modal1" class="modal">
      <div class="modal-content">
      <div class="monzo_form loggedOut">
      <input type="text" class="clientId" placeholder="clientId" name="clientId">
      <input type="text" class="clientSecret" placeholder="clientSecret" name="clientSecret">
      <a class="btn btn-lg btn-primary HomeView__login-button___3I_YY login" href="">Login</a>
      </div>
      </div>
      <div class="modal-footer">
        <a href="#!" class=" modal-action modal-close waves-effect waves-green btn-flat">Agree</a>
      </div>
    </div>
    `);
  $('#modal1').modal('open');
};

App.handleForm = function(e){
  e.preventDefault();

  const url    = `${App.apiUrl}${$(this).attr('action')}`;
  const method = $(this).attr('method');
  const data   = $(this).serialize();

  return App.ajaxRequest(url, method, data, data => {
    if (data.token) App.setToken(data.token);
    App.loggedInState();
  });
};


// App.monzoCallback = function(req, res){
//   console.log('monzoAuth running clientside');
//   $.get(`${App.apiUrl}/callback`).done(data => {
//     console.log(data);
//     res.redirect('/');
//   });
//   // getAccessToken(code, state);
// };



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

$(App.init.bind(App));
