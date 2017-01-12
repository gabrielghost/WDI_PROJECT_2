console.log('working');

const App = App || {};

$(init);

function init() {
  App.apiUrl = 'http://localhost:3000/api';
  App.redirect_uri = 'http%3A%2F%2Flocalhost%3A7000%2Fcallback';
  App.monzoAuth();
}

// googleMap.mapSetup = function () {
// //this is where the map is going to lie on the page
//   const canvas = document.getElementById('map-canvas');
//
// //these are the attributs for the generated map
//   const mapOptions = {
//     //defines zoom level
//     zoom: 12,
//     // defines the center of the map with coordinates
//     center: new google.maps.LatLng(51.506178,-0.088369),
//     // this defines the map type (roads, satellite etc)
//     mapTypeId: google.maps.MapTypeId.ROADMAP
//   };
//
//   this.map = new google.maps.Map(canvas, mapOptions);
//   // this.getLocations();
// };

App.monzoAuth = function(){
  console.log('running');
  $.get('http://localhost:3000/api/monzo-redirect')
  .done(data => {
    $('.monzo').html(`<a href="https://auth.getmondo.co.uk/?redirect_uri=${App.redirect_uri}&client_id=${data.url}&response_type=code">login to monzo</a>`);
  });
  // return App.ajaxRequest(App.apiUrl, 'get', null, data =>{
  //   console.log(data);
  //   this.$('body').html(`<a href="https://auth.getmondo.co.uk/?redirect_uri=${App.redirect_uri}&client_id=${App.monzoClientId}&response_type=code">login to monzo</a>`);
  // });
};
