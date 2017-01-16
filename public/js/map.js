'use strict';

console.log('working map');

var App = App || {};
var google = google;

App.initMap = function () {

  App.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: { lat: 51.521872, lng: -0.082910 },
    mapTypeId: 'roadmap',
    zoomControl: true,
    disableDefaultUI: true
  });
  App.heatmap = new google.maps.visualization.HeatmapLayer({
    data: getPoints(),
    map: App.map,
    opacity: 1
  });
  var gradient = ['rgba(0, 255, 255, 0)', 'rgba(30, 120, 140, 1)', 'rgba(154, 189, 169, 1)', 'rgba(234, 209, 159, 1)', 'rgba(230, 75, 95, 1)'];
  App.heatmap.set('radius', App.heatmap.get('radius') ? null : 30);
  App.heatmap.set('gradient', App.heatmap.get('gradient') ? null : gradient);
};

//TOGGLE HEATMAP ON OFF


// //HEATMAP GRADIENT HERE
// App.changeGradient = function() {

//
// };

// App.changeRadius = function() {
//   App.heatmap.set('radius', App.heatmap.get('radius') ? null : 20);
// };
//
// App.changeOpacity = function() {
//   App.heatmap.set('opacity', App.heatmap.get('opacity') ? null : 0.2);
// };

//INSERT HEATMAP DATA HERE
function getPoints() {
  return App.heatMapArray;
}

$(App.initMap.bind(App));