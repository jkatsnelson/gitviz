var        gm = require('googlemaps'),
         util = require('util'),
           fs = require('fs'),
allCityCoords = {},
       cities = [
                  'sf',
                  'san fran',
                  'onthe road',
                  'omaha',
                  'london, england',
                  'mexico city',
                  'CA',
                  'sfo'
                ];

for (var i = 0; i < cities.length; i++) {
  gm.geocode(cities[i], function(err, data) {
    if (err) { console.log(err); }
    if (data.status === 'OK') {
      var city = data.results[0].formatted_address;
      allCityCoords[city] = {};
      allCityCoords[city].lat = data.results[0].geometry.location.lat;
      allCityCoords[city].lon = data.results[0].geometry.location.lng;
    } else {
      console.log("Something got wrong");
    }
  });
}

setTimeout(function(){
  // change to fs.writeFile next - hack it to get working
  console.log(JSON.stringify(allCityCoords));
}, 2000);