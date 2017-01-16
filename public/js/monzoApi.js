'use strict';

var App = App || {};
var google = google;

var params = getJsonFromUrl();

App.apiUrl = 'http://localhost:3000/api';
App.redirectUri = 'http%3A%2F%2Flocalhost%3A7000%2Fcallback';
App.redirect_uri_r = 'http://localhost:7000/callback';

App.$monzo = $('.monzo');
App.$header = $('header');

App.heatMapArray = [];

App.init = function () {
  $('.logout').on('click', this.logout.bind(this));
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
      code: getURLParamsMonzo('code')
    };
    $.post(options.uri, options.data).done(function (data) {
      console.log(data);
      App.setToken(data.access_token);
      App.setId(data.user_id);
      // App.home();
      App.getAcctIdFromMonzo();
    });
  } else {
    validTokenCheck();
  }
};

App.home = function () {
  $.get('http://localhost:3000/');
};

function validTokenCheck() {
  if (App.getToken()) {
    var url = 'https://api.monzo.com/ping/whoami';
    $.ajax({
      url: url,
      beforeSend: function beforeSend(xhr) {
        return xhr.setRequestHeader('Authorization', 'Bearer ' + App.getToken());
      }
    }).done(function (data) {
      console.log(data);
      App.getAcctIdFromMonzo();
    }).fail(function (data) {
      console.log('tokenfail');
      console.log(data);
      App.logout();
    });
  }
}

App.getAcctIdFromMonzo = function () {
  console.log('getAcctId firing');
  var url = 'https://api.monzo.com/accounts';
  $.ajax({
    url: url,
    beforeSend: function beforeSend(xhr) {
      return xhr.setRequestHeader('Authorization', 'Bearer ' + App.getToken());
    }
  }).done(function (data) {
    console.log(data);
    App.setAcctId(data.accounts[0].id);
    App.setAcctDesc(data.accounts[0].description);
    App.reqTransactions();
  }).fail(function (data) {
    console.log('getAcctId fail');
    console.log(data);
  });
};

App.reqTransactions = function () {
  var url = 'https://api.monzo.com/transactions?expand[]=merchant&account_id=' + App.getAcctId();
  $.ajax({
    url: url,
    beforeSend: function beforeSend(xhr) {
      return xhr.setRequestHeader('Authorization', 'Bearer ' + App.getToken());
    }
  }).done(function (data) {
    console.log(data);
    App.heatMapGen(data);
    App.sortData(data);
  }).fail(function (data) {
    console.log(data);
    console.log('reqTransactions error');
  });
};

App.heatMapGen = function (data) {
  $.each(data.transactions, function (i, transaction) {
    if (transaction.merchant) {
      App.heatMapArray.push({ location: new google.maps.LatLng(transaction.merchant.address.latitude, transaction.merchant.address.longitude), weight: Math.abs(transaction.amount / 100) });
    }
    App.initMap();
    App.greeting();
  });
};

App.sortData = function (data) {
  $.each(data.transactions, function (i, transaction) {
    if (transaction.merchant) {
      setTimeout(function () {
        var transactionDate = transaction.created;
        var transactionAmount = transaction.amount;
        var transactionDescription = transaction.merchant.metadata.google_places_name;
        var transactionWebsite = transaction.merchant.metadata.website;
        var transactionTwitter = transaction.merchant.metadata.twitter;
        var lat = transaction.merchant.address.latitude;
        var lng = transaction.merchant.address.longitude;
        var img = transaction.merchant.logo;
        var category = transaction.merchant.category;
        var dataProcessed = {
          lat: lat,
          lng: lng,
          title: transactionDescription,
          price: transactionAmount,
          img: img,
          category: category,
          website: transactionWebsite,
          twitter: transactionTwitter
        };
        App.markers(dataProcessed);
      }, i * 50);
    }
  });
};

App.markers = function (dataProcessed) {
  console.log(dataProcessed.category);
  var icons = {
    general: {
      icon: '/images/pinIcons/general.png'
    },
    groceries: {
      icon: '/images/pinIcons/groceries.png'
    },
    eating_out: {
      icon: '/images/pinIcons/eating_out.png'
    },
    entertainment: {
      icon: '/images/pinIcons/entertainment.png'
    },
    transport: {
      icon: '/images/pinIcons/transport.png'
    }
  };
  var latlng = new google.maps.LatLng(dataProcessed.lat, dataProcessed.lng);
  console.log(dataProcessed.category);
  var marker = new google.maps.Marker({
    position: latlng,
    map: App.map,
    animation: google.maps.Animation.DROP,
    icon: icons[dataProcessed.category].icon
  });
  App.addInfoWindowForLocation(dataProcessed, marker);
};

App.addInfoWindowForLocation = function (dataProcessed, marker) {
  var _this = this;

  google.maps.event.addListener(marker, 'click', function () {
    if (typeof _this.infoWindow !== 'undefined') _this.infoWindow.close();
    _this.infoWindow = new google.maps.InfoWindow({
      content: '<div class="transactionInfo">\n      <ul>\n      <li><img src="' + dataProcessed.img + '" height="50px"></li>\n      <li><a href="' + dataProcessed.website + '" target="_blank">' + dataProcessed.title + '</a></li>\n      <li><p>\xA3' + Math.abs(dataProcessed.price / 100).toFixed(2) + '</p></li>\n      </ul>\n      </div>\n      '
    });
    _this.infoWindow.open(_this.map, marker);
  });
};

App.greeting = function () {
  $('.greeting').html('\n      <p>Hello ' + App.getAcctDesc().split(' ')[0] + '!</p>\n      ');
};

App.loggedInState = function () {
  $('.loggedIn').show();
  $('.loggedOut').hide();
};

App.loggedOutState = function () {
  createForm();
  $('.loggedIn').hide();
  $('.loggedOut').show();
};

App.logout = function () {
  console.log('logged out massive');
  //toggle off markers
  // App.setMapOnAll(null);
  //toggle off heatmap
  App.heatmap.setMap(null);
  //clears all data from local memory
  this.removeAllLocalStorage();
  //clears all data from dynamic memory
  App.heatMapArray = [];
  //makes it look like it's all logged out and proper
  this.loggedOutState();
};

App.removeAllLocalStorage = function () {
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
  window.localStorage.setItem('token', token);
};
App.getToken = function () {
  return window.localStorage.getItem('token');
};
App.setId = function (id) {
  window.localStorage.setItem('user_id', id);
};
App.getId = function () {
  return window.localStorage.getItem('user_id');
};
App.setAcctId = function (acctId) {
  window.localStorage.setItem('acctId', acctId);
};
App.getAcctId = function () {
  return window.localStorage.getItem('acctId');
};
App.setAcctDesc = function (acctDesc) {
  window.localStorage.setItem('acctDesc', acctDesc);
};
App.getAcctDesc = function () {
  return window.localStorage.getItem('acctDesc');
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

//http://stackoverflow.com/questions/11582512/how-to-get-url-parameters-with-javascript/


function getURLParamsMonzo(name) {
  var param = decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;

  return param;
}

$(App.init.bind(App));