// 'use strict';

angular.module('githubleagueClientApp')
  .directive('player', function () {
    return {
      template: '<div class="playerChart">'
                  + '<button class="showGroup">grouping</button>'
                  + '<button class="showSeparate">separate</button>'
                + '</div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        var bChart,
            gitData = scope.events;
            console.log('gitData');

        $('.playerChart').on('click', function(event) {
          var viewType = event.target.className;
          if (viewType === 'showGroup') {
              bChart.display_group_all();
          }
          if (viewType === 'showSeparate') {
            bChart.displayByAttribute();
          }
        });

        function bubbleChart(data) {
          this.data = data;
          var uniqueEventList = _.unique( _.pluck(data, 'type') );
          var eventCounts = _(data).each(function(event) {
            var counter = {};
            if (!counter[event.type]) {
              counter[event.type] = 1;
            } else {
              counter[event.type]++
            }
          });
          this.width = $(".hero-unit").width();
          this.height = 600;
          this.center = {
            x: this.width / 2,
            y: this.height / 2
          };
          this.attributeCenters = {};
          console.log(uniqueEventList);
          // debugger;
          for (var i = 0; i < uniqueEventList.length; i++) {
            this.attributeCenters[uniqueEventList[i]] = {
              x: (i + 1) * this.width / uniqueEventList.length + 1,
              y: this.height / 2
            }
          }
          // this.attributeCenters = {
          //   "nightOwl": {
          //     x: this.width / 3,
          //     y: this.height / 2
          //   },
          //   "dayTripper": {
          //     x: 2 * this.width / 3,
          //     y: this.height / 2
          //   }
          // };
          this.layout_gravity = -0.01;
          this.damper = 0.1;
          this.vis = null;
          this.nodes = [];
          this.force = null;
          this.circles = null;
          this.fill_color = d3.scale.ordinal().domain(["nightOwl", "dayTripper"]).range(["#4C3670", "#F28E3D"]);
          this.create_nodes();
          this.create_vis();
          return this;
        };

        // creation: "2013-03-25T19:53:26Z"
        // persona: "nightOwl"
        // type: "IssuesEvent"

        bubbleChart.prototype.create_nodes = function() {
          var that = this;
          this.data.forEach(function(d) {
            var node;
            node = {
              id: d.creation,
              radius: 15,
              creation: d.creation,
              persona: d.persona,
              type: d.type,
              x: Math.random() * 900,
              y: Math.random() * 800
            };
            return that.nodes.push(node);
          });
          return this.nodes;
        };

        bubbleChart.prototype.create_vis = function() {
          var that = this;
          this.vis = d3.select(".playerChart").append("svg").attr("width", this.width).attr("height", this.height).attr("id", "svg_vis");
          this.circles = this.vis.selectAll("circle").data(this.nodes, function(d) {
            return d.id;
          });
          that = this;
          this.circles.enter().append("circle").attr("r", 0).attr("fill", function(d) {
            return that.fill_color(d.persona);
          }).attr("stroke-width", 2).attr("stroke", function(d) {
            return d3.rgb(that.fill_color(d.persona)).darker();
          }).attr("id", function(d) {
            return "bubble_" + d.id;
          });
          return this.circles.transition().duration(2000).attr("r", function(d) {
            return d.radius;
          });
        };

        bubbleChart.prototype.charge = function(d) {
          return -Math.pow(d.radius, 2.0) / 8;
        };

        bubbleChart.prototype.start = function() {
          return this.force = d3.layout.force().nodes(this.nodes).size([this.width, this.height]);
        };

        bubbleChart.prototype.display_group_all = function() {
          var that = this;
          this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", function(e) {
            return that.circles.each(that.move_towards_center(e.alpha)).attr("cx", function(d) {
              return d.x;
            }).attr("cy", function(d) {
              return d.y;
            });
          });
          this.force.start();
          // return this.hide_years();
        };

        bubbleChart.prototype.move_towards_center = function(alpha) {
          var that = this;
          return function(d) {
            d.x = d.x + (that.center.x - d.x) * (that.damper + 0.02) * alpha;
            return d.y = d.y + (that.center.y - d.y) * (that.damper + 0.02) * alpha;
          };
        };

        bubbleChart.prototype.displayByAttribute = function() {
          var that = this;
          this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on('tick', function(e) {
            return that.circles.each(that.moveTowardsAttribute(e.alpha)).attr('cx', function(d) {
              return d.x;
            }).attr('cy', function(d) {
              return d.y;
            });
          });
          this.force.start();
        };

        bubbleChart.prototype.moveTowardsAttribute = function(alpha) {
          var that = this;
          return function(d) {
            var attributeCenterOnScreen;
            attributeCenterOnScreen = that.attributeCenters[d.type];
            d.x += (attributeCenterOnScreen.x - d.x) * (that.damper + 0.02) * alpha;
            return d.y += (attributeCenterOnScreen.y - d.y) * (that.damper + 0.02) * alpha;
          };
        };

        bChart = new bubbleChart(gitData);
        bChart.start();
        bChart.display_group_all();
      }
    };
  });
