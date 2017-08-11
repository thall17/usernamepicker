// Initialize global variables
var map;
var observableMarkersArray = ko.observableArray();
var infowindows = [];
var baseUrl = "https://api.foursquare.com/v2/";
var endpoint = "venues/search?"
var clientID = "&client_id=WEBC1WESOQN4A3VWY5VNA54NU4NIJ00QJGLLBAD0XXKFI150";
var clientSecret = "&client_secret=MMPCAP1UKMSZFKK3Z3N5HJXNC4DKU2FQWIMHZRRBWS50U1TL";
var paramsll = "ll=";
var paramsName = "&name=";
var paramsLimit = "&limit=1";
var paramsVersion = "&v=20170421";
var paramsMode = "&m=foursquare";
// MODEL
var model = {
  restaurants: [{
      name: "Angelini Osteria",
      address: '7313 Beverly Blvd, Los Angeles, CA 90036',
      lat: 34.076448,
      lng: -118.349148,
      foursquareLink: "https://foursquare.com/v/angelini-osteria/4a8e0dd4f964a520e81120e3"
    },
    {
      name: "Cassia",
      address: '1314 7th St, Santa Monica, CA 90401',
      lat: 34.019401,
      lng: -118.493702,
      foursquareLink: "https://foursquare.com/v/cassia/5580cfe3498eb8ba1ca0874a"
    },
    {
      name: "Katsu-ya",
      address: '11680 Ventura Blvd, Studio City, CA 91604',
      lat: 34.140803,
      lng: -118.387423,
      foursquareLink: "https://foursquare.com/v/katsuya/4a91cac7f964a520d61b20e3"
    },
    {
      name: "Kotoya",
      address: '10422 National Blvd, Los Angeles, CA 90034',
      lat: 34.028577,
      lng: -118.411518,
      foursquareLink: "https://foursquare.com/v/kotoya-ramen/56d07b67cd10ad699abcc4fc"
    },
    {
      name: "Mastro's Steakhouse",
      address: '246 N Canon Dr, Beverly Hills, CA 90210',
      lat: 34.068829,
      lng: -118.398821,
      foursquareLink: "https://foursquare.com/v/mastros-steakhouse/43a9ae96f964a5207e2c1fe3"
    }
  ]
};
// Initialize Google Map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    // Center on City Hall in Los Angeles
    center: {
      lat: 34.053477,
      lng: -118.242893
    },
    zoom: 11
  });
  // Initialize markers
  for (var i = 0; i < model.restaurants.length; i++) {
    r = model.restaurants[i];
    var myLatLng = {
      lat: r.lat,
      lng: r.lng
    };
    var lat = r.lat;
    var marker = new google.maps.Marker({
      position: myLatLng,
      title: r.name,
      visible: true
    });
    // Make markers observable and therefore filterable in UI list
    observableMarkersArray().push(marker);
    marker = null;
  }
  // Open infoWindow and fill with content
  for (var i = 0; i < observableMarkersArray().length; i++) {
    var marker = observableMarkersArray()[i];
    marker.setMap(map);
    var infowindow = new google.maps.InfoWindow();
    infowindows.push(infowindow);
    var content = '<div id="content">' +
      '<div id="siteNotice">' +
      '</div>' +
      '<h1 id="firstHeading" class="firstHeading">' + model.restaurants[i].name + '</h1>' +
      '<div id="bodyContent">' +
      '<p><b>Address: </b>' +
      '<span id="formatted-address"></span></p>' +
      '<p><b>Checkins: </b>' +
      '<span id="checkins-count"></span></p>' +
      '<p><b>Tips: </b>' +
      '<span id="tip-count"></span></p>' +
      '<p><a href="' + model.restaurants[i].foursquareLink + '">' +
      'Foursquare Page</a> ' +
      '</div>'
    // Animate marker on click and open infoWindow
    google.maps.event.addListener(marker, 'click', (function(marker, content, infowindow) {
      return function() {
        for (var i = 0; i < infowindows.length; i++) {
          infowindows[i].close();
        }
        for (var i = 0; i < observableMarkersArray().length; i++) {
          observableMarkersArray()[i].setAnimation(null);
        }
        var index = observableMarkersArray.indexOf(marker);
        var foursquareUrl = baseUrl + endpoint + paramsll + model.restaurants[index].lat + "," + model.restaurants[index].lng + paramsName + model.restaurants[index].name.split(' ').join('+') + paramsLimit + paramsVersion + paramsMode + clientID + clientSecret;
        infowindow.setContent(content);
        $.getJSON(foursquareUrl, function(data) {
          var venue = data.response.venues[0];
          var venueFormattedAddress = venue.location.formattedAddress;
          var venueCheckinsCount = venue.stats.checkinsCount;
          var venueTipCount = venue.stats.tipCount;
          $('#formatted-address').append(venueFormattedAddress);
          $('#checkins-count').append(venueCheckinsCount);
          $('#tip-count').append(venueTipCount);
        }).fail(function(e) {
          $('#formatted-address').append("Unable to retrieve address from Foursquare.");
          $('#checkins-count').append("Unable to retrieve checkins count from Foursquare.");
          $('#tip-count').append("Unable to retrieve tip count from Foursquare.");
        });
        infowindow.open(map, marker);
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          map.panTo(marker.getPosition());
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function() {
            marker.setAnimation(null);
          }, 750);
        }
      };
    })(marker, content, infowindow));
  }
};
// VIEWMODEL
var ViewModel = function() {
  var self = this;
  // Allow user to choose a specific restaurant by clicking on it in the side-menu list
  self.isolateLocation = function(restaurant) {
    self.searchString(restaurant.name);
    self.filteredRestaurants;
  };
  // Clear the search string (and show all locations) when user clicks the "X" button
  self.clearSearch = function() {
    self.searchString("");
  }
  self.observableMarkersArray = ko.observableArray(model.restaurants);
  self.searchString = ko.observable("");
  // Filter restaurant list and markers on map based on searchString input from user
  self.filteredRestaurants = ko.computed(function() {
    array = self.observableMarkersArray;
    returnArray = [];
    var index;
    for (index = 0; index < array().length; index++) {
      if (self.searchString == "" || array()[index].name.toLowerCase().startsWith(self.searchString().toLowerCase())) {
        returnArray.push(array()[index]);
        if (observableMarkersArray()[index] != undefined) {
          observableMarkersArray()[index].setVisible(true);
        }
      } else {
        if (observableMarkersArray()[index] != undefined) {
          observableMarkersArray()[index].setVisible(false);
          infowindows[index].close();
        }
      }
    }
    return returnArray;
  });
};
// Bind everything with KnockoutJS
ko.applyBindings(new ViewModel());