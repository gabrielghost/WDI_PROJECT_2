"use strict";

console.log('working map');

var App = App || {};
var google = google;
var mapStyle = [{
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
}, {
    featureType: "transit",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
}, {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [{
        "visibility": "on"
    }, {
        "lightness": 33
    }]
}, {
    "featureType": "landscape",
    "elementType": "all",
    "stylers": [{
        "color": "#f2e5d4"
    }]
}, {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [{
        "color": "#c5dac6"
    }]
}, {
    "featureType": "poi.park",
    "elementType": "labels",
    "stylers": [{
        "visibility": "on"
    }, {
        "lightness": 20
    }]
}, {
    "featureType": "road",
    "elementType": "all",
    "stylers": [{
        "lightness": 20
    }]
}, {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{
        "color": "#c5c6c6"
    }]
}, {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [{
        "color": "#e4d7c6"
    }]
}, {
    "featureType": "road.local",
    "elementType": "geometry",
    "stylers": [{
        "color": "#fbfaf7"
    }]
}, {
    "featureType": "water",
    "elementType": "all",
    "stylers": [{
        "visibility": "on"
    }, {
        "color": "#acbcc9"
    }]
}];

App.initMap = function () {

    //   var styledMapType = new google.maps.StyledMapType(


    App.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: { lat: 51.521872, lng: -0.082910 },
        // mapTypeId: 'roadmap',
        styles: mapStyle,
        zoomControl: true,
        disableDefaultUI: true
        // mapTypeControlOptions: {
        //         mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
        //                 'styled_map']
    });
    // App.map.mapTypes.set('styled_map', styledMapType);
    // App.map.setMapTypeId('styled_map');
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