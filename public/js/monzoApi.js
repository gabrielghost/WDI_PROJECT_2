'use strict';

var App = App || {};
var google = google;

var params = urlFaffJson();

App.apiUrl = 'http://localhost:3000/api';
App.redirectUri = 'http%3A%2F%2Flocalhost%3A7000%2Fcallback';
App.redirect_uri_r = 'http://localhost:7000/callback';

App.$monzo = $('.monzo');
App.$header = $('header');

App.heatMapArray = [];

App.init = function () {
  this.markerArray = [];
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
    console.log('valid token check function');
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
    });
  } else {
    console.log('tokenfail');
    App.logout();
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
      var transactionDate = transaction.created;
      var transactionAmount = transaction.amount;
      var transactionDescription = transaction.merchant.metadata.google_places_name;
      var transactionPlaceId = transaction.merchant.metadata.google_places_id;
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
        created: transactionDate,
        img: img,
        category: category,
        website: transactionWebsite,
        twitter: transactionTwitter,
        placeId: transactionPlaceId
      };
      transactionArray.push(dataProcessed);
      // App.checkDoubles(data);
      App.markers(dataProcessed, data);
    }
  });
};

var transactionArray = [];
var transactionDupes = [];
//
// App.checkDoubles = function(data) {
//   $.each(data.transactions, (i, transaction) => {
//     if (transaction.placeId==dataProcessed.placeId){
//       return transactionDupes.push(dataProcessed);
//     }
//   });

// if (transactionArray.length != 0) {
//   for (var i=0; i< transactionArray.length; i++) {
//     const dataOne = dataProcessed.placeId;
//     const existingTransaction = transactionArray[i];
//     const pos = existingTransaction.getPosition();
//     if (dataOne.placeId.equals(pos)) {
//       console.log('fart!');
//     }
//   }
// }
// };

App.markers = function (dataProcessed, data) {
  console.log(data.transactions.length);
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
    },
    bills: {
      icon: '/images/pinIcons/bills.png'
    },
    cash: {
      icon: '/images/pinIcons/cash.png'
    },
    holidays: {
      icon: '/images/pinIcons/holidays.png'
    },
    expenses: {
      icon: '/images/pinIcons/expenses.png'
    },
    shopping: {
      icon: '/images/pinIcons/shopping.png'
    }
  };
  var latlng = new google.maps.LatLng(dataProcessed.lat, dataProcessed.lng);
  // console.log(dataProcessed.category);
  var marker = new google.maps.Marker({
    position: latlng,
    map: App.map,
    animation: google.maps.Animation.DROP,
    icon: icons[dataProcessed.category].icon
  });

  App.markerArray.push(marker);

  // $.each(data.transactions, (i, transaction) => {
  //   if(transaction.merchant.metadata.google_places_id==dataProcessed.placeId){
  //     App.appendInfoWindowForLocation(dataProcessed, marker);
  //   }  else {
  //     App.addInfoWindowForLocation(dataProcessed, marker);
  //   }
  // });
  App.addInfoWindowForLocation(dataProcessed, marker, data);
};
// App.appendInfoWindowForLocation = function(){
//   console.log('append!');
// };

App.addInfoWindowForLocation = function (dataProcessed, marker, data) {
  var _this = this;

  //   $.each(data.transactions, (i, transaction) => {
  //     var existingTransaction = data.transactions[i];
  //     var pos = existingTransaction.getPosition();
  //     if (dataProcessed.placeId.equals(pos)){
  //       console.log('eh');
  //     }
  //   });
  google.maps.event.addListener(marker, 'click', function () {
    App.clickedMarkerArray = [];
    // App.clickedMarkerArrayAll = [];
    // console.log(App.markerArray[1].position.lat());
    // console.log(data.transactions[1].merchant.address.latitude);
    // console.log(marker.position.lat());
    $.each(data.transactions, function (i, markerArr) {
      if (markerArr.merchant) {
        // App.clickedMarkerArrayAll.push(markerArr);
        if (parseFloat(markerArr.merchant.address.latitude + markerArr.merchant.address.longitude).toFixed(4) == parseFloat(marker.position.lat() + marker.position.lng()).toFixed(4)) {
          App.clickedMarkerArray.push(markerArr);
        }
      }

      // if (markerArr.position.lat() == marker.position.lat()){
      //   App.clickedMarkerArray.push(marker);
      //   console.log(App.clickedMarkerArray);
      // }
    });
    // App.markerArray === all markers on the page
    // When theres a click, filter through the array to find the markers that have the same lat/lng values
    // marker.lat() === "4.51140"
    // That will return a new array with all the markers with the same lat/lng which you can then loop over to get the data then append it to the info window.

    App.markerHTMLGen = function () {
      $('.info').html('');
      // if (App.clickedMarkerArray[0].merchant.emoji&&App.clickedMarkerArray[0].merchant.name){
      // console.log(App.clickedMarkerArray.merchant.name);
      console.log(App.clickedMarkerArray.merchant);
      var aggregateTotal = App.aggregateTotal(App.clickedMarkerArray);
      $('.info').html('<div class="aggregateTransaction loggedIn">\n        <h4>' + App.clickedMarkerArray[0].merchant.emoji + App.clickedMarkerArray[0].merchant.name + '</h4>\n        <p class="key"><img src="./images/pinIcons/' + App.clickedMarkerArray[0].merchant.category + '.png">:' + App.clickedMarkerArray[0].merchant.category + '</p>\n        <p>Total spend: \xA3' + (aggregateTotal / 100).toFixed(2) + '</p>\n        </div>');
      // } else {
      //   $('.info').html(`<div class="aggregateTransaction loggedIn">
      //   <h4>${App.clickedMarkerArray[0].merchant.name}</h4>
      //   <p>Total spend: £${((aggregateTotal/100)).toFixed(2)}</p>
      //   </div>`);
      // }
      $.each(App.clickedMarkerArray, function (i, marker) {

        var data = moment(marker.created).format('LL');
        var data1 = moment(marker.created).format('LT');

        $('.info').append('<div class="transactionInfo loggedIn">\n<ul list-style-image="./images/pinIcons/' + App.clickedMarkerArray[0].merchant.category + '.png">\n        <li><p class="price">\xA3' + Math.abs(marker.amount / 100).toFixed(2) + '</p></li>\n        <li><p>' + data1 + '</p><p>' + data + '</p></li>\n</ul>\n        </div>\n        ');
      });
    };

    if (typeof _this.infoWindow !== 'undefined') _this.infoWindow.close();
    _this.infoWindow = new google.maps.InfoWindow({
      content: '<div class="multiMarker loggedIn">\n        <img src="' + dataProcessed.img + '" height="50px">\n        <li><a href="' + dataProcessed.website + '" target="_blank">' + dataProcessed.title + '</a></li>\n      </div>'
    });
    App.markerHTMLGen();
    _this.infoWindow.open(_this.map, marker);
  });
};

App.aggregateTotal = function (data) {
  var count = 0;
  $.each(data, function (i, data) {
    console.log(data.amount);
    count = count + Math.abs(data.amount);
  });
  return count;
};

App.greeting = function () {
  $('.greeting').html('\n      <div class="greeting"><p>Hello ' + App.getAcctDesc().split(' ')[0] + '!</p><div>\n      ');
};

App.loggedInState = function () {
  $('.loggedIn').show();
  $('.loggedOut').hide();
};

App.loggedOutState = function () {
  console.log('logged out state working');
  createForm();
  $('.loggedIn').hide();
  $('.loggedOut').show();
};

// function deleteMarkers() {
//         clearMarkers();
//         markers = [];
//       }

App.logout = function () {
  console.log('logged out massive');
  //toggle off markers
  // deleteMarkers();
  //toggle off heatmap
  // App.heatmap.setMap(null);
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

function urlFaffJson() {
  var query = location.search.substr(1);
  // console.log(location.search.substr(1));
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
  $('.monzo').html('\n    <div class="login_sidebar">\n    <h3>Please login here with your developer credentials to see your spend information:</h3>\n    <div class="monzo_form loggedOut">\n\n    <input type="text" class="clientId loggedOut form-control" placeholder="clientId" name="clientId">\n\n    <input type="text" class="clientSecret loggedOut form-control" placeholder="clientSecret" name="clientSecret">\n    <a class="button login loggedOut btn btn-lg btn-primary btn-block" href="">Login</a>\n    </div>\n    <p>psssst! don\'t have any? Don\'t worry! It\'s super simple to get some - just sign up <a class="here" href="https://developers.getmondo.co.uk/">here</a>.</p>\n    </div>\n      ');
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