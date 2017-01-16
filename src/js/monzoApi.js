const App = App || {};
const google = google;

const params   = getJsonFromUrl();

App.apiUrl        = 'http://localhost:3000/api';
App.redirectUri  = 'http%3A%2F%2Flocalhost%3A7000%2Fcallback';
App.redirect_uri_r = 'http://localhost:7000/callback';

App.$monzo        = $('.monzo');
App.$header       = $('header');

App.heatMapArray  = [];

App.init = function(){
  $('.logout').on('click', this.logout.bind(this));
  if (params.code) {
    const options = {
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
    $.post(options.uri, options.data).done(data => {
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

App.home = function(){
  $.get(`http://localhost:3000/`);
};

function validTokenCheck() {
  if (App.getToken()){
    const url = `https://api.monzo.com/ping/whoami`;
    $.ajax({
      url,
      beforeSend: function(xhr) {
        return xhr.setRequestHeader('Authorization', `Bearer ${App.getToken()}`);
      }
    }).done(data => {
      console.log(data);
      App.getAcctIdFromMonzo();
    }).fail(data => {
      console.log('tokenfail');
      console.log(data);
      App.logout();
    });
  }
}

App.getAcctIdFromMonzo = function() {
  console.log('getAcctId firing');
  const url = `https://api.monzo.com/accounts`;
  $.ajax({
    url,
    beforeSend: function(xhr) {
      return xhr.setRequestHeader('Authorization', `Bearer ${App.getToken()}`);
    }
  }).done(data => {
    console.log(data);
    App.setAcctId(data.accounts[0].id);
    App.setAcctDesc(data.accounts[0].description);
    App.reqTransactions();
  }).fail(data => {
    console.log('getAcctId fail');
    console.log(data);
  });
};

App.reqTransactions = function() {
  const url = `https://api.monzo.com/transactions?expand[]=merchant&account_id=${App.getAcctId()}`;
  $.ajax({
    url,
    beforeSend: function(xhr) {
      return xhr.setRequestHeader('Authorization', `Bearer ${App.getToken()}`);
    }
  }).done(data => {
    console.log(data);
    App.heatMapGen(data);
    App.sortData(data);
  }).fail(data => {
    console.log(data);
    console.log('reqTransactions error');
  });
};

App.heatMapGen = function(data){
  $.each(data.transactions, (i, transaction) => {
    if (transaction.merchant) {
      App.heatMapArray.push({ location: new google.maps.LatLng(transaction.merchant.address.latitude, transaction.merchant.address.longitude), weight: (Math.abs(transaction.amount/100))});
    }
    App.initMap();
    App.greeting();
  });
};

App.sortData = function(data){
  $.each(data.transactions, (i, transaction) => {
    if (transaction.merchant) {
      setTimeout(() => {
        const transactionDate   = transaction.created;
        const transactionAmount = transaction.amount;
        const transactionDescription   = transaction.merchant.metadata.google_places_name;
        const transactionWebsite   = transaction.merchant.metadata.website;
        const transactionTwitter   = transaction.merchant.metadata.twitter;
        const lat               = transaction.merchant.address.latitude;
        const lng              = transaction.merchant.address.longitude;
        const img              = transaction.merchant.logo;
        const category              = transaction.merchant.category;
        const dataProcessed = {
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

App.markers = function(dataProcessed){
  console.log(dataProcessed.category);
  const icons = {
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
  const latlng = new google.maps.LatLng(dataProcessed.lat, dataProcessed.lng);
  console.log(dataProcessed.category);
  const marker = new google.maps.Marker({
    position: latlng,
    map: App.map,
    animation: google.maps.Animation.DROP,
    icon: icons[dataProcessed.category].icon
  });
  App.addInfoWindowForLocation(dataProcessed, marker);
};

App.addInfoWindowForLocation = function(dataProcessed, marker) {
  google.maps.event.addListener(marker, 'click', () => {
    if (typeof this.infoWindow !== 'undefined')
      this.infoWindow.close();
    this.infoWindow = new google.maps.InfoWindow({
      content: `<div class="transactionInfo">
      <ul>
      <li><img src="${dataProcessed.img}" height="50px"></li>
      <li><a href="${dataProcessed.website}" target="_blank">${dataProcessed.title}</a></li>
      <li><p>£${(Math.abs(dataProcessed.price/100)).toFixed(2)}</p></li>
      </ul>
      </div>
      `
    });
    this.infoWindow.open(this.map, marker);
  });
};

App.greeting = function(){
  $('.greeting').html(`
      <p>Hello ${App.getAcctDesc().split(' ')[0]}!</p>
      `);
};

App.loggedInState = function(){
  $('.loggedIn').show();
  $('.loggedOut').hide();
};

App.loggedOutState = function(){
  createForm();
  $('.loggedIn').hide();
  $('.loggedOut').show();
};

App.logout = function(){
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

App.removeAllLocalStorage = function(){
  return window.localStorage.clear();
};

function getJsonFromUrl() {
  const query = location.search.substr(1);
  const result = {};
  query.split('&').forEach(function(part) {
    const item = part.split('=');
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}

App.setToken = function(token) {
  window.localStorage.setItem('token', token);
};
App.getToken = function() {
  return window.localStorage.getItem('token');
};
App.setId = function(id) {
  window.localStorage.setItem('user_id', id);
};
App.getId = function() {
  return window.localStorage.getItem('user_id');
};
App.setAcctId = function(acctId) {
  window.localStorage.setItem('acctId', acctId);
};
App.getAcctId = function() {
  return window.localStorage.getItem('acctId');
};
App.setAcctDesc = function(acctDesc) {
  window.localStorage.setItem('acctDesc', acctDesc);
};
App.getAcctDesc = function() {
  return window.localStorage.getItem('acctDesc');
};

App.login = function() {
  console.log('app login');

};


App.clicked = function() {
  console.log('clicked');
};

function createForm(){
  $('.monzo').html(`
      <div class="monzo_form loggedOut">
      <input type="text" class="clientId loggedOut" placeholder="clientId" name="clientId">
      <input type="text" class="clientSecret loggedOut" placeholder="clientSecret" name="clientSecret">
      <a class="button login loggedOut waves-effect" href="">Login</a>
      </div>
      `);
  console.log('form created');
  $('.login').on('click', function(event) {
    event.preventDefault();
    console.log('clicked');
    // set client id and secret
    var clientId = $('.clientId').val();
    var clientSecret = $('.clientSecret').val();

    var url = `https://auth.getmondo.co.uk/?client_id=${clientId}&redirect_uri=${App.redirectUri}&response_type=code&state=`;

    if(clientId && clientSecret) {
      window.location.href = url;
      window.localStorage.setItem('clientId', clientId);
      window.localStorage.setItem('clientSecret', clientSecret);

    }
  });
}


 //http://stackoverflow.com/questions/11582512/how-to-get-url-parameters-with-javascript/


function getURLParamsMonzo(name){
  const param = decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20')) || null;

  return param;
}

$(App.init.bind(App));
