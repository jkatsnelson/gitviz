'use strict';

angular.module('githubleagueClientApp')
  .directive('gitvis', function () {
    return {
      template: '<div class="mapContainer"></div>'
              + '<div class="cityRankings">'
                + '<h1>Top three cities by commits</h1>'
                + '<div class="cityListing"></div>'
              + '</div>',
      restrict: 'E',
      val: '=',
      link: function postLink(scope, element, attrs) {
        // element.text('this is the gitvis directive');
        var map = d3.select(".map");
        var width = 900;
        var height = ht;
        var tick = 250;
        var projection = d3.geo.equirectangular().scale((width/600)*600).translate([width/2, height/2]);
        var path = d3.geo.path().projection(projection);
        function draw_world(err, collection) {
          $(".mapContainer").html("<svg class='map' xmlns='http://www.w3.org/2000/svg' width='100%' height='" + ht + "'></svg>");
          ht = $(".mapContainer").width()/2
          map.selectAll('path').data(collection.features).enter()
              .append('path')
              .attr('d', path)
              .attr('fill', "gray")
              .attr("width", width)
              .attr("height", width/2)

        }

        function draw_events(ht) {

          var dataset = scope.repoHistory;
          console.log(dataset);

          // remove locations without valid data
          for (var i = 0; i < dataset.length; i++) {
            if ((!dataset[i].lat) || (!dataset[i].lon)) {
              dataset.splice(i,1);
            }
          }

          map.selectAll('circle')
              .data(dataset.filter(function(d) { return currentTime === +d.commit.commit.author.date }))
              .enter()
              .append('circle')
              .on('mouseover', mouseover)
              .attr({
              class:'point',
              fill: function (d) { return d.fill = d.fill || d3.hsl(Math.random() * 360, 1, .5) },
              stroke: function (d) { return d.fill },
              cx: function (d) { return d.location[0] },
              cy: function (d) { return d.location[1] },
              r: 0,
              'opacity': .85,
              'stroke-opacity': .5,
              })
              .transition()
              .ease('cubic')
              .duration(2500)
              .attr('opacity', 0)
              .attr('r', 15)
              .remove();

          // map.selectAll('circle')
          //    .data(dataset)
          //    .enter()
          //    .append('circle')
          //    .transition().ease("linear")
          //    .attr('cx', width/2)
          //    .duration()
          //    .transition().ease("linear")
          //    .delay(function(d,i) { return (i+1) * tick; })
          //    .duration(function(d, i) { return tick; })
          //    .attr('cx', function(d) {
          //      return projection([d.lon, d.lat])[0]; //projection(d.lon, d.lat)[0];
          //    })
          //    .attr('cy', function(d) {
          //      return projection([d.lon, d.lat])[1]; //projection(d.lon, d.lat)[1];
          //    })
          //    .attr('r', function(d) {
          //      return 3;
          //    })
          //    .attr('city', function(d) {
          //       return d.city;
          //    })
          //    .duration(function (d,i) { return tick; })
          //    .transition().ease("linear")
          //    .delay(function(d, i) { return (i+2) * tick - 10; })
          //    .duration()
          //    .attr('fill', 'red')
          //    .attr('r', 6)
          //    .transition().ease("linear")
          //    .delay(function(d, i) { return (i+2) * tick + 30; })
          //    .attr('fill', 'black')
          //    .attr('r', 3)


            // Display top ten cities by frequency
            var cityCounts = _(dataset).chain().countBy('city').pairs()
              .sort(function(a,b) { return a[1] < b[1];})
              .value()
            for (var i = 0; i < cityCounts.length && i < 10; i++) {
              $('.cityListing').append('<h1 class="cityName">'+cityCounts[i][0]+': '+cityCounts[i][1] + ' commits');
            }
          });
        }
        d3.json('../geodata/world-map.json', draw_world)
    };
  });
