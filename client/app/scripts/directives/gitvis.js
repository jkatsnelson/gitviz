'use strict';

angular.module('githubleagueClientApp')
  .directive('gitvis', function () {
    return {
      template: '<div id="mapContainer"></div>'
        + '<div class="cityRankings">'
        + '<h2>Cities with the most activity:</h2>'
        + '<ol class="cityListing"></ol>'
        + '</div>',
      restrict: 'E',
      val: '=',
      link: function postLink(scope, element, attrs) {
        // element.text('this is the gitvis directive');
        function draw(ht) {
          $("#mapContainer").html("<svg id='map' xmlns='http://www.w3.org/2000/svg' width='100%' height='" + ht + "'></svg>");
          var map = d3.select("#map");
          var width = 600;
          var height = ht;
          var tick = 250;

          // I discovered that the unscaled equirectangular map is 640x360. Thus, we
          // should scale our map accordingly. Depending on the width ratio of the new
          // container, the scale will be this ratio * 100. You could also use the height
          // instead. The aspect ratio of an equirectangular map is 2:1, so that's why
          // our height is half of our width.

          var projection = d3.geo.equirectangular().scale((width/600)*600).translate([width/2, height/2]);
          var path = d3.geo.path().projection(projection);
          d3.json('../geodata/world-map.json', function(collection) {
            map.selectAll('path').data(collection.features).enter()
              .append('path')
            .attr('d', path)
            .attr('fill', "gray")
            .attr("width", width)
            .attr("height", width/2)

          var dataset = locations;
          // remove locations without valid data
          for (var i = 0; i < dataset.length; i++) {
            if ((!dataset[i].lat) || (!dataset[i].lon)) {
              dataset.splice(i,1);
            }
          }

          map.selectAll('circle')
             .data(dataset)
             .enter()
             .append('circle')
             .transition().ease("linear")
             .attr('cx', width/2)
             .duration()
             .transition().ease("linear")
             .delay(function(d,i) { return (i+1) * tick; })
             .duration(function(d, i) { return tick; })
             .attr('cx', function(d) {
               return projection([d.lon, d.lat])[0]; //projection(d.lon, d.lat)[0];
             })
             .attr('cy', function(d) {
               return projection([d.lon, d.lat])[1]; //projection(d.lon, d.lat)[1];
             })
             .attr('r', function(d) {
               return 3;
             })
             .attr('city', function(d) {
                return d.city;
             })
             .duration(function (d,i) { return tick; })
             .transition().ease("linear")
             .delay(function(d, i) { return (i+2) * tick - 10; })
             .duration()
             .attr('fill', 'red')
             .attr('r', 6)
             .transition().ease("linear")
             .delay(function(d, i) { return (i+2) * tick + 30; })
             .attr('fill', 'black')
             .attr('r', 3)

          map.selectAll("text")
            .data(dataset)
            .enter()
            .append("text")
            .transition()
            .attr('x', 605)
            .attr('y', 100)
            .transition().ease("linear")
            .delay(function(d,i) { return (i) * tick; })
            .transition()
            .delay(function(d, i) { return (i + 1) * tick; })
            .duration(5000)
            .text(function(d, i) { return d.city; })
            .attr("x", 605)
            .attr("y", 360)
            .attr("font-size", "14px")
            .attr("font-family", 'Arial')
            .attr("fill", "black")
            .remove()

            // Display top ten cities by frequency
            var cityCounts = _(dataset).chain().countBy('city').pairs()
              .sort(function(a,b) { return a[1] < b[1];})
              .value()
            for (var i = 0; i < cityCounts.length && i < 10; i++) {
              $('.cityListing').append('<li>'+cityCounts[i][0]+': '+cityCounts[i][1]);
            }
          });
        }
        draw($("#mapContainer").width()/2);
      }
    };
  });
