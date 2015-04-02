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
  var control$ = Rx.Observable.merge(Intent.get("resume$"), Intent.get("continue$"), Intent.get("pause$").map(function () {
    return false;
  })).distinctUntilChanged();

  var timerIdle$ = control$.timeInterval().filter(function (data) {
    return data.value;
  }) // Watch false => true transitions (resume and continue after pause)
  .pluck("interval").sample(Intent.get("resume$")).startWith(0);

  return {
    msSinceStart$: Rx.Observable.interval(100).pausable(control$.startWith(true)).map(function () {
      return undefined;
    }).merge(timerIdle$, function (_, idle) {
      return idle;
    }).scan(0, function (delta, idle) {
      return delta + 100 + (idle || 0);
    }).takeUntil(Intent.get("stop$")),

    stopped$: Intent.get("stop$").startWith(false) };
});

var View = Cycle.createView(function (Model) {
  return {
    vtree$: Rx.Observable.combineLatest(Model.get("msSinceStart$"), Model.get("stopped$"), function (msSinceStart, stopped) {
      var timeDelta = (msSinceStart / 1000).toFixed(1);
      return h("div", null, [h("p", { className: makeClass({ muted: stopped }) }, ["Started ", timeDelta, " seconds ago ", stopped ? "(Timer stopped)" : ""]), h("div", { className: "btn-group" }, [h("button", { className: "btn btn-default pause", disabled: stopped }, ["Pause"]), h("button", { className: "btn btn-default resume", disabled: stopped }, ["Resume"]), h("button", { className: "btn btn-default continue", disabled: stopped }, ["Continue"]), h("button", { className: "btn btn-default stop", disabled: stopped }, ["Stop"])])]);
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
    continue$: User.event$(".btn.continue", "click").map(function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC8xLjMtdGltZXItc21hcnQvc2NyaXB0cy9hcHAuanMiLCJidWlsZC9jb21tb24vc2NyaXB0cy9zaGltcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztBQ0NBLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBQ3RDLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUN0QyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDMUIsRUFBRSxHQUFPLEtBQUssQ0FBZCxFQUFFO0lBQUUsQ0FBQyxHQUFJLEtBQUssQ0FBVixDQUFDOzs7QUFHVixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLFVBQUEsTUFBTSxFQUFJO0FBQ3RDLE1BQUksUUFBUSxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUNoQyxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUNyQixNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxFQUN2QixNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQztXQUFNLEtBQUs7R0FBQSxDQUFDLENBQ3RDLENBQUMsb0JBQW9CLEVBQUUsQ0FBQzs7QUFFekIsTUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUNyQyxNQUFNLENBQUMsVUFBQSxJQUFJO1dBQUksSUFBSSxDQUFDLEtBQUs7R0FBQSxDQUFDO0dBQzFCLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FDakIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FDN0IsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUVoQixTQUFPO0FBQ0wsaUJBQWEsRUFBRSxFQUFFLENBQUMsVUFBVSxD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Q0YsQ0FBQyxDQUFDO0FBQ0gsU0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0NBQ3RELENBQUM7O0FBRUYsT0FBTyxDQUFDLEdBQUcsR0FBRyxTQUFTLEdBQUcsR0FBWTs7O29DQUFSLE1BQU07QUFBTixVQUFNOzs7QUFDbEMsU0FBTyxnQkFBQSxPQUFPLENBQUMsR0FBRyxFQUFDLElBQUksTUFBQSxnQkFBQyxPQUFPLFNBQUssTUFBTSxFQUFDLENBQUM7Q0FDN0MsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5yZXF1aXJlKFwiLi4vLi4vY29tbW9uL3NjcmlwdHMvc2hpbXNcIik7XG5sZXQgbWFrZUNsYXNzID0gcmVxdWlyZShcImNsYXNzbmFtZXNcIik7XG5sZXQgQ3ljbGUgPSByZXF1aXJlKFwiY3ljbGVqc1wiKTtcbmxldCB7UngsIGh9ID0gQ3ljbGU7XG5cbi8vIEFQUCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBNb2RlbCA9IEN5Y2xlLmNyZWF0ZU1vZGVsKEludGVudCA9PiB7XG4gIGxldCBjb250cm9sJCA9IFJ4Lk9ic2VydmFibGUubWVyZ2UoXG4gICAgSW50ZW50LmdldChcInJlc3VtZSRcIiksXG4gICAgSW50ZW50LmdldChcImNvbnRpbnVlJFwiKSxcbiAgICBJbnRlbnQuZ2V0KFwicGF1c2UkXCIpLm1hcCgoKSA9PiBmYWxzZSlcbiAgKS5kaXN0aW5jdFVudGlsQ2hhbmdlZCgpO1xuXG4gIGxldCB0aW1lcklkbGUkID0gY29udHJvbCQudGltZUludGVydmFsKClcbiAgICAuZmlsdGVyKGRhdGEgPT4gZGF0YS52YWx1ZSkgLy8gV2F0Y2ggZmFsc2UgPT4gdHJ1ZSB0cmFuc2l0aW9ucyAocmVzdW1lIGFuZCBjb250aW51ZSBhZnRlciBwYXVzZSlcbiAgICAucGx1Y2soXCJpbnRlcnZhbFwiKVxuICAgIC5zYW1wbGUoSW50ZW50LmdldChcInJlc3VtZSRcIikpXG4gICAgLnN0YXJ0V2l0aCgwKTtcblxuICByZXR1cm4ge1xuICAgIG1zU2luY2VTdGFydCQ6IFJ4Lk9ic2VydmFibGUuaW50ZXJ2YWwoMTAwKVxuICAgICAgLnBhdXNhYmxlKGNvbnRyb2wkLnN0YXJ0V2l0aCh0cnVlKSlcbiAgICAgIC5tYXAoKCkgPT4gdW5kZWZpbmVkKVxuICAgICAgLm1lcmdlKHRpbWVySWRsZSQsIChfLCBpZGxlKSA9PiBpZGxlKVxuICAgICAgLnNjYW4oMCwgKGRlbHRhLCBpZGxlKSA9PiBkZWx0YSArIDEwMCArIChpZGxlIHx8IDApKVxuICAgICAgLnRha2VVbnRpbChJbnRlbnQuZ2V0KFwic3RvcCRcIikpLFxuXG4gICAgc3RvcHBlZCQ6IEludGVudC5nZXQoXCJzdG9wJFwiKS5zdGFydFdpdGgoZmFsc2UpLFxuICB9O1xufSk7XG5cbmxldCBWaWV3ID0gQ3ljbGUuY3JlYXRlVmlldyhNb2RlbCA9PiB7XG4gIHJldHVybiB7XG4gICAgdnRyZWUkOiBSeC5PYnNlcnZhYmxlLmNvbWJpbmVMYXRlc3QoXG4gICAgICBNb2RlbC5nZXQoXCJtc1NpbmNlU3RhcnQkXCIpLCBNb2RlbC5nZXQoXCJzdG9wcGVkJFwiKSxcbiAgICAgIGZ1bmN0aW9uIChtc1NpbmNlU3RhcnQsIHN0b3BwZWQpIHtcbiAgICAgICAgbGV0IHRpbWVEZWx0YSA9IChtc1NpbmNlU3RhcnQgLyAxMDAwKS50b0ZpeGVkKDEpO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIGgoJ2RpdicsIG51bGwsIFtcbiAgICAgICAgICAgIGgoJ3AnLCB7Y2xhc3NOYW1lOiBtYWtlQ2xhc3Moe211dGVkOiBzdG9wcGVkfSl9LCBbXG4gICAgICAgICAgICAgIFwiU3RhcnRlZCBcIiwgdGltZURlbHRhLCBcIiBzZWNvbmRzIGFnbyBcIiwgc3RvcHBlZCA/IFwiKFRpbWVyIHN0b3BwZWQpXCIgOiBcIlwiXG4gICAgICAgICAgICBdKSxcbiAgICAgICAgICAgIGgoJ2RpdicsIHtjbGFzc05hbWU6IFwiYnRuLWdyb3VwXCJ9LCBbXG4gICAgICAgICAgICAgIGgoJ2J1dHRvbicsIHtjbGFzc05hbWU6IFwiYnRuIGJ0bi1kZWZhdWx0IHBhdXNlXCIsIGRpc2FibGVkOiBzdG9wcGVkfSwgW1wiUGF1c2VcIl0pLFxuICAgICAgICAgICAgICBoKCdidXR0b24nLCB7Y2xhc3NOYW1lOiBcImJ0biBidG4tZGVmYXVsdCByZXN1bWVcIiwgZGlzYWJsZWQ6IHN0b3BwZWR9LCBbXCJSZXN1bWVcIl0pLFxuICAgICAgICAgICAgICBoKCdidXR0b24nLCB7Y2xhc3NOYW1lOiBcImJ0biBidG4tZGVmYXVsdCBjb250aW51ZVwiLCBkaXNhYmxlZDogc3RvcHBlZH0sIFtcIkNvbnRpbnVlXCJdKSxcbiAgICAgICAgICAgICAgaCgnYnV0dG9uJywge2NsYXNzTmFtZTogXCJidG4gYnRuLWRlZmF1bHQgc3RvcFwiLCBkaXNhYmxlZDogc3RvcHBlZH0sIFtcIlN0b3BcIl0pXG4gICAgICAgICAgICBdKVxuICAgICAgICAgIF0pXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgKSxcbiAgfTtcbn0pO1xuXG5sZXQgSW50ZW50ID0gQ3ljbGUuY3JlYXRlSW50ZW50KFVzZXIgPT4ge1xuICByZXR1cm4ge1xuICAgIHBhdXNlJDogVXNlci5ldmVudCQoXCIuYnRuLnBhdXNlXCIsIFwiY2xpY2tcIikubWFwKCgpID0+IHRydWUpLFxuICAgIHJlc3VtZSQ6IFVzZXIuZXZlbnQkKFwiLmJ0bi5yZXN1bWVcIiwgXCJjbGlja1wiKS5tYXAoKCkgPT4gdHJ1ZSksXG4gICAgY29udGludWUkOiBVc2VyLmV2ZW50JChcIi5idG4uY29udGludWVcIiwgXCJjbGlja1wiKS5tYXAoKCkgPT4gdHJ1ZSksXG4gICAgc3RvcCQ6IFVzZXIuZXZlbnQkKFwiLmJ0bi5zdG9wXCIsIFwiY2xpY2tcIikubWFwKCgpID0+IHRydWUpLFxuICB9XG59KTtcblxubGV0IFVzZXIgPSBDeWNsZS5jcmVhdGVET01Vc2VyKFwibWFpblwiKTtcblxuVXNlci5pbmplY3QoVmlldykuaW5qZWN0KE1vZGVsKS5pbmplY3QoSW50ZW50KS5pbmplY3QoVXNlcik7IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxucmVxdWlyZShcImJhYmVsL3BvbHlmaWxsXCIpO1xuXG4vLyBTSElNUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQ3ljbGUgPSByZXF1aXJlKFwiY3ljbGVqc1wiKTtcbmxldCB7Unh9ID0gQ3ljbGU7XG5cbkN5Y2xlLmxhdGVzdCA9IGZ1bmN0aW9uIChEYXRhTm9kZSwga2V5cywgcmVzdWx0U2VsZWN0b3IpIHtcbiAgbGV0IG9ic2VydmFibGVzID0ga2V5cy5tYXAoa2V5ID0+IERhdGFOb2RlLmdldChrZXkpKTtcbiAgbGV0IGFyZ3MgPSBvYnNlcnZhYmxlcy5jb25jYXQoW1xuICAgIGZ1bmN0aW9uIHNlbGVjdG9yKC4uLmxpc3QpIHtcbiAgICAgIGxldCBpdGVtID0ga2V5cy5yZWR1Y2UoKGl0ZW0sIGtleSkgPT4ge1xuICAgICAgICBpdGVtW2tleS5zbGljZSgwLCAtMSldID0gbGlzdFtrZXlzLmluZGV4T2Yoa2V5KV07XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgfSwge30pO1xuICAgICAgcmV0dXJuIHJlc3VsdFNlbGVjdG9yKGl0ZW0pO1xuICAgIH1cbiAgXSk7XG4gIHJldHVybiBSeC5PYnNlcnZhYmxlLmNvbWJpbmVMYXRlc3QuYXBwbHkobnVsbCwgYXJncyk7XG59O1xuXG5jb25zb2xlLnNweSA9IGZ1bmN0aW9uIHNweSguLi5wYXJhbXMpIHtcbiAgcmV0dXJuIGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSwgLi4ucGFyYW1zKTtcbn07Il19
