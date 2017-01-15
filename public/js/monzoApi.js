'use strict';

var App = App || {};
var google = google;

var params = getJsonFromUrl();
var authCode = getURLParameter('code');

App.apiUrl = 'http://localhost:3000/api';
App.redirectUri = 'http%3A%2F%2Flocalhost%3A7000%2Fcallback';
App.redirect_uri_r = 'http://localhost:7000/callback';

App.$monzo = $('.monzo');
App.$header = $('header');

App.heatMapArray = [];

if (params.code) {
  var options = {
    method: 'POST',
    uri: 'https://api.monzo.com/oauth2/token'
  };
  options.data = {
    grant_type: 'authorization_code',
    client_id: window.localStorage.getItem('clientId'),
    client_secret: window.localStorage.getItem('clientSecret'),
    redirect_uri: App.redirect_uri_r,
    code: getURLParameter('code')
  };
  $.post(options.uri, options.data).done(function (data) {
    console.log(data);
    App.setToken(data.access_token);
    App.setId(data.user_id);
    App.home();
    App.getAcctId();
    // App.reqTransactions();
  });
}

App.home = function () {
  $.get('http://localhost:3000/');
};

App.validTokenCheck = function () {
  if (App.getToken()) {
    var url = 'https://api.monzo.com/ping/whoami';
    $.ajax({
      url: url,
      beforeSend: function beforeSend(xhr) {
        return xhr.setRequestHeader('Authorization', 'Bearer ' + App.getToken());
      }
    }).done(function (data) {
      console.log(data);
      App.getAcctId();
    }).fail(function (data) {
      console.log('tokenfail');
      createForm();
    });
  }
};

App.getAcctId = function () {
  var url = 'https://api.monzo.com/accounts';
  $.ajax({
    url: url,
    beforeSend: function beforeSend(xhr) {
      return xhr.setRequestHeader('Authorization', 'Bearer ' + App.getToken());
    }
  }).done(function (data) {
    console.log(data);
    console.log(data.accounts);
  });
};

App.reqTransactions = function () {
  var url = 'https://api.monzo.com/transactions?expand[]=merchant&account_id=' + App.getId();
  $.ajax({
    url: url,
    beforeSend: function beforeSend(xhr) {
      return xhr.setRequestHeader('Authorization', 'Bearer ' + App.getToken());
    }
  }).done(function (data) {
    App.heatMapGen(data);
    console.log(data);
  }).fail(function (data) {
    console.log('reqTransactions error');
  });
};

App.heatMapGen = function (data) {
  $.each(data.transactions, function (i, transaction) {
    if (transaction.merchant) {
      App.heatMapArray.push({ location: new google.maps.LatLng(transaction.merchant.address.latitude, transaction.merchant.address.longitude), weight: Math.abs(transaction.amount / 100) });
    }
    App.initMap();
  });
};

App.loggedInState = function () {
  $('.loggedIn').show();
  $('.loggedOut').hide();
};

App.loggedOutState = function () {
  App.toggleHeatmap();
  createForm();
  $('.loggedIn').hide();
  $('.loggedOut').show();
};

App.logout = function (e) {
  e.preventDefault();
  this.removeToken();
  this.loggedOutState();
};

App.removeToken = function () {
  return window.localStorage.clear();
};

function getJsonFromUrl() {
  var query = location.search.substr(1);
  var result = {};
  query.split('&').forEach(function (part) {
    var item = part.split('=');
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}

App.setToken = function (token) {
  return window.localStorage.setItem('token', token);
};
App.setId = function (id) {
  return window.localStorage.setItem('user_id', id);
};
App.getId = function () {
  return window.localStorage.getItem('user_id');
};

App.getToken = function () {
  return window.localStorage.getItem('token');
};

App.init = function () {
  $('.logout').on('click', this.logout.bind(this));
  $('.button-collapse').sideNav();
  App.validTokenCheck();
};

App.login = function () {
  console.log('app login');
};

App.clicked = function () {
  console.log('clicked');
};

function createForm() {
  $('.monzo').html('\n      <div class="monzo_form loggedOut">\n      <input type="text" class="clientId loggedOut" placeholder="clientId" name="clientId">\n      <input type="text" class="clientSecret loggedOut" placeholder="clientSecret" name="clientSecret">\n      <a class="button login loggedOut waves-effect" href="">Login</a>\n      </div>\n      ');
  console.log('form created');
  $('.login').on('click', function (event) {
    event.preventDefault();
    console.log('clicked');
    // set client id and secret
    var clientId = $('.clientId').val();
    var clientSecret = $('.clientSecret').val();

    var url = 'https://auth.getmondo.co.uk/?client_id=' + clientId + '&redirect_uri=' + App.redirectUri + '&response_type=code&state=';

    if (clientId && clientSecret) {
      window.location.href = url;
      window.localStorage.setItem('clientId', clientId);
      window.localStorage.setItem('clientSecret', clientSecret);
    }
  });
}

/**
 * Get a paramater from the URL
 * http://stackoverflow.com/questions/11582512/how-to-get-url-parameters-with-javascript/
 */

function getURLParameter(name) {
  var param = decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;

  return param;
}

function getAccessToken() {
  var url = 'https://api.getmondo.co.uk/oauth2/token';
  var data = {
    grant_type: 'authorization_code',
    client_id: 'oauthclient_00009GHhx8useUIPuaxl2X',

    client_secret: 'MVKUHgeLLnTeQ8eFqWNLbSTphaLJ4G8PQTZcGbXo2eZApnOtoJj5pHHtLobjTI835LwfkWHJpBV3gQ8HUDtg',
    redirect_uri: App.redirect_uri_r,
    code: authCode
  };

  makeRequest(url, data, setAccessToken);
}

function makeRequest(url, data, callback) {
  var request = {
    dataType: "json",
    url: url,
    method: 'GET',
    cache: false,
    async: false,
    success: callback,
    error: requestError
  };

  if (url == 'https://api.getmondo.co.uk/oauth2/token') {
    request.method = 'POST';
  }

  if (data) {
    request.data = data;
  }

  if (accessToken) {
    request.headers = { 'Authorization': 'Bearer ' + accessToken };
  }

  $.ajax(request);
}

$(App.init.bind(App));