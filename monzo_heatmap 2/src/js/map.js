console.log('working map');

const App     = App || {};
const google  = google;


App.initMap = function() {

  App.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: {lat: 51.521872, lng: -0.082910},
    mapTypeId: 'roadmap',
    zoomControl: true,
    disableDefaultUI: true
  });
  var heatmap = new google.maps.visualization.HeatmapLayer({
    data: getPoints(),
    map: App.map
  });
  heatmap.set('radius', heatmap.get('radius') ? null : 20);
};

//TOGGLE HEATMAP ON OFF
App.toggleHeatmap = function() {
  var heatmap = new google.maps.visualization.HeatmapLayer({
    data: getPoints(),
    map: App.map
  });
  heatmap.setMap(heatmap.getMap() ? null : App.map);
};

// //HEATMAP GRADIENT HERE
// App.changeGradient = function() {
//   var gradient = [
//     'rgba(0, 255, 255, 0)',
//     'rgba(0, 255, 255, 1)',
//     'rgba(0, 191, 255, 1)',
//     'rgba(0, 127, 255, 1)',
//     'rgba(0, 63, 255, 1)',
//     'rgba(0, 0, 255, 1)',
//     'rgba(0, 0, 223, 1)',
//     'rgba(0, 0, 191, 1)',
//     'rgba(0, 0, 159, 1)',
//     'rgba(0, 0, 127, 1)',
//     'rgba(63, 0, 91, 1)',
//     'rgba(127, 0, 63, 1)',
//     'rgba(191, 0, 31, 1)',
//     'rgba(255, 0, 0, 1)'
//   ];
//   App.heatmap.set('gradient', App.heatmap.get('gradient') ? null : gradient);
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
