(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
require("../../common/scripts/shims");
var makeClass = require("classnames");
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;
var h = Cycle.h;

// APP =============================================================================================
var Model = Cycle.createModel(function (Intent) {
  var started = Date.now();
  var control$ = Rx.Observable.merge(Intent.get("resume$"), Intent.get("pause$").map(function () {
    return false;
  })).distinctUntilChanged();

  return {
    msSinceStart$: Rx.Observable.interval(100).pausable(control$.startWith(true)).map(function () {
      return Date.now() - started;
    }).takeUntil(Intent.get("stop$")),

    stopped$: Intent.get("stop$").startWith(false) };
});

var View = Cycle.createView(function (Model) {
  return {
    vtree$: Rx.Observable.combineLatest(Model.get("msSinceStart$"), Model.get("stopped$"), function (msSinceStart, stopped) {
      var timeDelta = (msSinceStart / 1000).toFixed(1);
      return h("div", null, [h("p", { className: makeClass({ muted: stopped }) }, ["Started ", timeDelta, " seconds ago ", stopped ? "(Timer stopped)" : ""]), h("div", { className: "btn-group" }, [h("button", { className: "btn btn-default pause", disabled: stopped }, ["Pause"]), h("button", { className: "btn btn-default resume", disabled: stopped }, ["Resume"]), h("button", { className: "btn btn-default stop", disabled: stopped }, ["Stop"])])]);
    }) };
});

var Intent = Cycle.createIntent(function (User) {
  return {
    pause$: User.event$(".btn.pause", "click").map(function () {
      return true;
    }),
    resume$: User.event$(".btn.resume", "click").map(function () {
      return true;
    }),
    stop$: User.event$(".btn.stop", "click").map(function () {
      return true;
    }) };
});

var User = Cycle.createDOMUser("main");

User.inject(View).inject(Model).inject(Intent).inject(User);

},{"../../common/scripts/shims":2,"classnames":"classnames","cyclejs":"cyclejs"}],2:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
require("babel/polyfill");

// SHIMS ===========================================================================================
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;

Cycle.latest = function (DataNode, keys, resultSelector) {
  var observables = keys.map(function (key) {
    return DataNode.get(key);
  });
  var args = observables.concat([function selector() {
    for (var _len = arguments.length, list = Array(_len), _key = 0; _key < _len; _key++) {
      list[_key] = arguments[_key];
    }

    var item = keys.reduce(function (item, key) {
      item[key.slice(0, -1)] = list[keys.indexOf(key)];
      return item;
    }, {});
    return resultSelector(item);
  }]);
  return Rx.Observable.combineLatest.apply(null, args);
};

console.spy = function spy() {
  var _console$log;

  for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
    params[_key] = arguments[_key];
  }

  return (_console$log = console.log).bind.apply(_console$log, [console].concat(params));
};

},{"babel/polyfill":"babel/polyfill","cyclejs":"cyclejs"}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC8xLjItdGltZXItbW9yZS9zY3JpcHRzL2FwcC5qcyIsImJ1aWxkL2NvbW1vbi9zY3JpcHRzL3NoaW1zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FDQ0EsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDdEMsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3RDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMxQixFQUFFLEdBQU8sS0FBSyxDQUFkLEVBQUU7SUFBRSxDQUFDLEdBQUksS0FBSyxDQUFWLENBQUM7OztBQUdWLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsVUFBQSxNQUFNLEVBQUk7QUFDdEMsTUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3pCLE1BQUksUUFBUSxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUNoQyxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUNyQixNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQztXQUFNLEtBQUs7R0FBQSxDQUFDLENBQ3RDLENBQUMsb0JBQW9CLEVBQUUsQ0FBQzs7QUFFekIsU0FBTztBQUNMLGlCQUFhLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQ3ZDLFFBQVEsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQ2xDLEdBQUcsQ0FBQzthQUFNLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxPQUFPO0tBQUEsQ0FBQyxDQUMvQixTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFakMsWUFB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LENBQUM7QUFDckQsTUFBSSxJQUFJLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUM1QixTQUFTLFFBQVEsR0FBVTtzQ0FBTixJQUFJO0FBQUosVUFBSTs7O0FBQ3ZCLFFBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFLO0FBQ3BDLFVBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNqRCxhQUFPLElBQUksQ0FBQztLQUNiLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDUCxXQUFPLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUM3QixDQUNGLENBQUMsQ0FBQztBQUNILFNBQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztDQUN0RCxDQUFDOztBQUVGLE9BQU8sQ0FBQyxHQUFHLEdBQUcsU0FBUyxHQUFHLEdBQVk7OztvQ0FBUixNQUFNO0FBQU4sVUFBTTs7O0FBQ2xDLFNBQU8sZ0JBQUEsT0FBTyxDQUFDLEdBQUcsRUFBQyxJQUFJLE1BQUEsZ0JBQUMsT0FBTyxTQUFLLE1BQU0sRUFBQyxDQUFDO0NBQzdDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxucmVxdWlyZShcIi4uLy4uL2NvbW1vbi9zY3JpcHRzL3NoaW1zXCIpO1xubGV0IG1ha2VDbGFzcyA9IHJlcXVpcmUoXCJjbGFzc25hbWVzXCIpO1xubGV0IEN5Y2xlID0gcmVxdWlyZShcImN5Y2xlanNcIik7XG5sZXQge1J4LCBofSA9IEN5Y2xlO1xuXG4vLyBBUFAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgTW9kZWwgPSBDeWNsZS5jcmVhdGVNb2RlbChJbnRlbnQgPT4ge1xuICBsZXQgc3RhcnRlZCA9IERhdGUubm93KCk7XG4gIGxldCBjb250cm9sJCA9IFJ4Lk9ic2VydmFibGUubWVyZ2UoXG4gICAgSW50ZW50LmdldChcInJlc3VtZSRcIiksXG4gICAgSW50ZW50LmdldChcInBhdXNlJFwiKS5tYXAoKCkgPT4gZmFsc2UpXG4gICkuZGlzdGluY3RVbnRpbENoYW5nZWQoKTtcblxuICByZXR1cm4ge1xuICAgIG1zU2luY2VTdGFydCQ6IFJ4Lk9ic2VydmFibGUuaW50ZXJ2YWwoMTAwKVxuICAgICAgLnBhdXNhYmxlKGNvbnRyb2wkLnN0YXJ0V2l0aCh0cnVlKSlcbiAgICAgIC5tYXAoKCkgPT4gRGF0ZS5ub3coKSAtIHN0YXJ0ZWQpXG4gICAgICAudGFrZVVudGlsKEludGVudC5nZXQoXCJzdG9wJFwiKSksXG5cbiAgICBzdG9wcGVkJDogSW50ZW50LmdldChcInN0b3AkXCIpLnN0YXJ0V2l0aChmYWxzZSksXG4gIH07XG59KTtcblxubGV0IFZpZXcgPSBDeWNsZS5jcmVhdGVWaWV3KE1vZGVsID0+IHtcbiAgcmV0dXJuIHtcbiAgICB2dHJlZSQ6IFJ4Lk9ic2VydmFibGUuY29tYmluZUxhdGVzdChcbiAgICAgIE1vZGVsLmdldChcIm1zU2luY2VTdGFydCRcIiksIE1vZGVsLmdldChcInN0b3BwZWQkXCIpLFxuICAgICAgZnVuY3Rpb24gKG1zU2luY2VTdGFydCwgc3RvcHBlZCkge1xuICAgICAgICBsZXQgdGltZURlbHRhID0gKG1zU2luY2VTdGFydCAvIDEwMDApLnRvRml4ZWQoMSk7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgaCgnZGl2JywgbnVsbCwgW1xuICAgICAgICAgICAgaCgncCcsIHtjbGFzc05hbWU6IG1ha2VDbGFzcyh7bXV0ZWQ6IHN0b3BwZWR9KX0sIFtcbiAgICAgICAgICAgICAgXCJTdGFydGVkIFwiLCB0aW1lRGVsdGEsIFwiIHNlY29uZHMgYWdvIFwiLCBzdG9wcGVkID8gXCIoVGltZXIgc3RvcHBlZClcIiA6IFwiXCJcbiAgICAgICAgICAgIF0pLFxuICAgICAgICAgICAgaCgnZGl2Jywge2NsYXNzTmFtZTogXCJidG4tZ3JvdXBcIn0sIFtcbiAgICAgICAgICAgICAgaCgnYnV0dG9uJywge2NsYXNzTmFtZTogXCJidG4gYnRuLWRlZmF1bHQgcGF1c2VcIiwgZGlzYWJsZWQ6IHN0b3BwZWR9LCBbXCJQYXVzZVwiXSksXG4gICAgICAgICAgICAgIGgoJ2J1dHRvbicsIHtjbGFzc05hbWU6IFwiYnRuIGJ0bi1kZWZhdWx0IHJlc3VtZVwiLCBkaXNhYmxlZDogc3RvcHBlZH0sIFtcIlJlc3VtZVwiXSksXG4gICAgICAgICAgICAgIGgoJ2J1dHRvbicsIHtjbGFzc05hbWU6IFwiYnRuIGJ0bi1kZWZhdWx0IHN0b3BcIiwgZGlzYWJsZWQ6IHN0b3BwZWR9LCBbXCJTdG9wXCJdKVxuICAgICAgICAgICAgXSlcbiAgICAgICAgICBdKVxuICAgICAgICApO1xuICAgICAgfVxuICAgICksXG4gIH07XG59KTtcblxubGV0IEludGVudCA9IEN5Y2xlLmNyZWF0ZUludGVudChVc2VyID0+IHtcbiAgcmV0dXJuIHtcbiAgICBwYXVzZSQ6IFVzZXIuZXZlbnQkKFwiLmJ0bi5wYXVzZVwiLCBcImNsaWNrXCIpLm1hcCgoKSA9PiB0cnVlKSxcbiAgICByZXN1bWUkOiBVc2VyLmV2ZW50JChcIi5idG4ucmVzdW1lXCIsIFwiY2xpY2tcIikubWFwKCgpID0+IHRydWUpLFxuICAgIHN0b3AkOiBVc2VyLmV2ZW50JChcIi5idG4uc3RvcFwiLCBcImNsaWNrXCIpLm1hcCgoKSA9PiB0cnVlKSxcbiAgfVxufSk7XG5cbmxldCBVc2VyID0gQ3ljbGUuY3JlYXRlRE9NVXNlcihcIm1haW5cIik7XG5cblVzZXIuaW5qZWN0KFZpZXcpLmluamVjdChNb2RlbCkuaW5qZWN0KEludGVudCkuaW5qZWN0KFVzZXIpOyIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbnJlcXVpcmUoXCJiYWJlbC9wb2x5ZmlsbFwiKTtcblxuLy8gU0hJTVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEN5Y2xlID0gcmVxdWlyZShcImN5Y2xlanNcIik7XG5sZXQge1J4fSA9IEN5Y2xlO1xuXG5DeWNsZS5sYXRlc3QgPSBmdW5jdGlvbiAoRGF0YU5vZGUsIGtleXMsIHJlc3VsdFNlbGVjdG9yKSB7XG4gIGxldCBvYnNlcnZhYmxlcyA9IGtleXMubWFwKGtleSA9PiBEYXRhTm9kZS5nZXQoa2V5KSk7XG4gIGxldCBhcmdzID0gb2JzZXJ2YWJsZXMuY29uY2F0KFtcbiAgICBmdW5jdGlvbiBzZWxlY3RvciguLi5saXN0KSB7XG4gICAgICBsZXQgaXRlbSA9IGtleXMucmVkdWNlKChpdGVtLCBrZXkpID0+IHtcbiAgICAgICAgaXRlbVtrZXkuc2xpY2UoMCwgLTEpXSA9IGxpc3Rba2V5cy5pbmRleE9mKGtleSldO1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgIH0sIHt9KTtcbiAgICAgIHJldHVybiByZXN1bHRTZWxlY3RvcihpdGVtKTtcbiAgICB9XG4gIF0pO1xuICByZXR1cm4gUnguT2JzZXJ2YWJsZS5jb21iaW5lTGF0ZXN0LmFwcGx5KG51bGwsIGFyZ3MpO1xufTtcblxuY29uc29sZS5zcHkgPSBmdW5jdGlvbiBzcHkoLi4ucGFyYW1zKSB7XG4gIHJldHVybiBjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUsIC4uLnBhcmFtcyk7XG59OyJdfQ==
