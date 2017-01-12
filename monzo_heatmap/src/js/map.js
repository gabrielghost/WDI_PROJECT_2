console.log('working map');

const App     = App || {};
const google  = google;

App.mapSetup = function () {
//this is where the map is going to lie on the page
  const canvas = document.getElementById('map-canvas');

//these are the attributs for the generated map
  const mapOptions = {
    //defines zoom level
    zoom: 12,
    // defines the center of the map with coordinates
    center: new google.maps.LatLng(51.506178,-0.088369),
    // this defines the map type (roads, satellite etc)
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  this.map = new google.maps.Map(canvas, mapOptions);

};

$(App.mapSetup.bind(App));
