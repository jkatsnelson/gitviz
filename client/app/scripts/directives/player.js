// 'use strict';

angular.module('githubleagueClientApp')
  .directive('player', function () {
    return {
      template: '<div class="player-chart">'
                  + '<div class="chart-buttons">'
                    + '<button class="showGroup pull-left">mash up</button>'
                    + '<button class="showSeparate pull-left">pull apart</button>'
                    + '<div class="pull-left clearfix">'
                        +'<div class="red_legend legend pull-left"><img /><div class="day">Day</div></div>'
                        +'<div class="blue_legend legend pull-right"><img /><div class="night">Night</div></div>'
                    + '</div>'
                  + '</div>'
                + '</div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        var bChart,
            gitData = scope.events;

        $('.player-chart').on('click', function(event) {
          var viewType = event.target.className;
          if (viewType === 'showGroup') {
              bChart.display_group_all();
              bChart.hideEvents();
          }
          if (viewType === 'showSeparate') {
            bChart.displayByAttribute();
            bChart.showEvents();
          }
        });

        function bubbleChart(data) {
          this.data = data;
          this.uniqueEventList = _.unique( _.pluck(data, 'type') );
          window.eventCounter = {};
          _(data).each(function(event) {
            if (!eventCounter[event.type]) {
              eventCounter[event.type] = 1;
            } else {
              eventCounter[event.type]++
            }
          });
          var leastEvts = _.min(eventCounter);
          var mostEvts = _.max(eventCounter);
          this.width = $(".person-search").width();
          this.height = 500;
          this.center = {
            x: this.width / 2,
            y: this.height / 2
          };
          this.attributeCenters = {};

          for (var i = 0; i < this.uniqueEventList.length; i++) {
            var evtType = this.uniqueEventList[i];
            var evtCount = eventCounter[evtType];
            var numrows = 2;
            var row = Math.floor(this.uniqueEventList.length / numrows);
            this.attributeCenters[evtType] = {
              x: this.width * (i % row + 2) / (row + 3),
              y: this.height * (Math.floor(i/row) + 2 ) / (numrows + 3)
            }
          }
          this.layout_gravity = -0.05;
          this.damper = 0.25;
          this.vis = null;
          this.nodes = [];
          this.force = null;
          this.circles = null;
          this.fill_color = d3.scale.ordinal().domain(["nightOwl", "dayTripper"]).range(["#3229d2", "red"]); // old day #FF9700
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
              radius: 12,
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
          this.vis = d3.select(".player-chart").append("svg").attr("width", this.width).attr("height", this.height).attr("id", "svg_vis");
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

        bubbleChart.prototype.showEvents = function() {
          var events,
              eventsData,
              eventTitleCenters = {};

          for (var i = 0; i < this.uniqueEventList.length; i++) {
            var evtType = this.uniqueEventList[i];
            var evtCount = eventCounter[evtType];
            var group = _(this.nodes).where({type: evtType});
            var avgx = _(group).reduce(function(a,b) {return a + b.x;}, 0) / group.length;
            var avgy = _(group).reduce(function(a,b) {return a + b.y;}, 0) / group.length;
            eventTitleCenters[evtType] = {
              x: avgx,
              y: avgy
            }
          }

          eventsData = d3.keys(eventTitleCenters);
          events = this.vis.selectAll(".events").data(eventsData);

          var that = this;
          return events.enter()
            .append("text")
            .transition()
            .delay(700)
            .attr("class", "events")
            .attr("fill", "gray")
            .attr("font-size", 14)
            .attr("x", function(d) {
              var group = _(that.nodes).where({type: d});
              var avgx = _(group).reduce(function(a,b) {return a + b.x;}, 0) / group.length;
              return avgx;
            })
            .attr("y", function(d) {
              var group = _(that.nodes).where({type: d});
              var avgy = _(group).reduce(function(a,b) {return a + b.y;}, 0) / group.length;
              return avgy;
            })
            .attr("text-anchor", "middle")
            .attr("vertical-align", "middle")
            .text(function(d) {
              return d;
            });
        };

        bubbleChart.prototype.hideEvents = function() {
          console.log('fired hide');
          var events;
          return events = this.vis.selectAll('.events').remove();
        }

        bChart = new bubbleChart(gitData);
        bChart.start();
        bChart.display_group_all();
      }
    };
  });
