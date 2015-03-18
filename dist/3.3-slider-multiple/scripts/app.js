(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

require("./shims");

// IMPORTS =========================================================================================
var Cycle = require("cyclejs");
var Model = require("./model");
var View = require("./view");
var Intent = require("./intent");

// APP =============================================================================================
var DOM = Cycle.createDOMUser("main");

DOM.inject(View).inject(Model).inject(Intent).inject(DOM);

},{"./intent":2,"./model":3,"./shims":4,"./view":6,"cyclejs":"cyclejs"}],2:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;

// EXPORTS =========================================================================================
var Intent = Cycle.createIntent(function (DOM) {
  return {
    add$: DOM.event$(".add", "click").map(function (event) {
      return 1;
    }),
    remove$: DOM.event$(".item", "remove").map(function (event) {
      return event.data;
    }),
    changeWidth$: DOM.event$(".item", "changeWidth").map(function (event) {
      return event.data;
    }) };
});

module.exports = Intent;

},{"cyclejs":"cyclejs"}],3:[function(require,module,exports){
"use strict";

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); };

// IMPORTS =========================================================================================
var uuid = require("node-uuid");
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;

// EXPORTS =========================================================================================
var Model = Cycle.createModel(function (Intent) {
  var add$ = Intent.get("add$").map(function () {
    return function transform(state) {
      var model = createRandom();
      var state = Object.assign({}, state);
      state[model.id] = model;
      return state;
    };
  });

  var remove$ = Intent.get("remove$").map(function (id) {
    return function transform(state) {
      var state = Object.assign({}, state);
      delete state[id];
      return state;
    };
  });

  var changeWidth$ = Intent.get("changeWidth$").map(function (model) {
    return function transform(state) {
      state[model.id].width = model.width;
      return state;
    };
  });

  var transforms = Rx.Observable.merge(add$, remove$, changeWidth$);

  return {
    state$: transforms.startWith(seedState()).scan(function (state, transform) {
      return transform(state);
    }) };
});

function createRandom(withData) {
  return Object.assign({
    id: uuid.v4(),
    width: Math.floor(Math.random() * 800 + 200) }, withData);
}

function seedState() {
  var model = createRandom();
  var state = _defineProperty({}, model.id, model);
  return state;
}

module.exports = Model;

},{"cyclejs":"cyclejs","node-uuid":"node-uuid"}],4:[function(require,module,exports){
"use strict";

require("object.assign").shim();

console.error = console.log;

},{"object.assign":"object.assign"}],5:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;
var h = Cycle.h;

// ELEMENTS ========================================================================================
Cycle.registerCustomElement("Slider", function (DOM, Props) {
  var Model = Cycle.createModel(function (Intent, Props) {
    return {
      id$: Props.get("id$").shareReplay(1),
      width$: Props.get("width$").merge(Intent.get("changeWidth$")) };
  });

  var View = Cycle.createView(function (Model) {
    var id$ = Model.get("id$");
    var width$ = Model.get("width$");
    return {
      vtree$: width$.combineLatest(id$, function (width, id) {
        return h("div", { className: "item", style: { width: width + "px" } }, [h("div", null, [h("input", { className: "width-slider", type: "range", min: "200", max: "1000", value: width })]), h("button", { className: "remove" }, ["Remove"])]);
      }) };
  });

  var Intent = Cycle.createIntent(function (DOM) {
    return {
      changeWidth$: DOM.event$(".width-slider", "input").map(function (event) {
        return parseInt(event.target.value);
      }),
      remove$: DOM.event$(".remove", "click").map(function (event) {
        return true;
      }) };
  });

  DOM.inject(View).inject(Model).inject(Intent, Props)[0].inject(DOM);

  return {
    changeWidth$: Intent.get("changeWidth$").combineLatest(Model.get("id$"), function (width, id) {
      return { id: id, width: width };
    }),

    remove$: Intent.get("remove$").combineLatest(Model.get("id$"), function (_, id) {
      return id;
    }) };
});

},{"cyclejs":"cyclejs"}],6:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var sortBy = require("lodash.sortby");
var values = require("lodash.values");
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;
var h = Cycle.h;

var Slider = require("./slider");

// EXPORTS =========================================================================================
var View = Cycle.createView(function (Model) {
  var state$ = Model.get("state$");
  return {
    vtree$: state$.map(function (models) {
      return h("div", { className: "everything" }, [h("div", { className: "topButtons" }, [h("button", { className: "add" }, ["Add Random"])]), h("div", null, [sortBy(values(models), function (model) {
        return model.id;
      }).map(function (model) {
        return h("Slider.item", { id: model.id, width: model.width, key: model.id });
      })])]);
    }) };
});

module.exports = View;

},{"./slider":5,"cyclejs":"cyclejs","lodash.sortby":"lodash.sortby","lodash.values":"lodash.values"}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImJ1aWxkLzMuMy1zbGlkZXItbXVsdGlwbGUvc2NyaXB0cy9hcHAuanMiLCJidWlsZC8zLjMtc2xpZGVyLW11bHRpcGxlL3NjcmlwdHMvaW50ZW50LmpzIiwiYnVpbGQvMy4zLXNsaWRlci1tdWx0aXBsZS9zY3JpcHRzL21vZGVsLmpzIiwiYnVpbGQvMy4zLXNsaWRlci1tdWx0aXBsZS9zY3JpcHRzL3NoaW1zLmpzIiwiYnVpbGQvMy4zLXNsaWRlci1tdWx0aXBsZS9zY3JpcHRzL3NsaWRlci5qcyIsImJ1aWxkLzMuMy1zbGlkZXItbXVsdGlwbGUvc2NyaXB0cy92aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7OztBQUduQixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDL0IsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQy9CLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM3QixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7OztBQUdqQyxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUV0QyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDOzs7Ozs7QUNWMUQsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzFCLEVBQUUsR0FBSSxLQUFLLENBQVgsRUFBRTs7O0FBR1AsSUFBSSxN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QUFDLEtBQUssRUFBRSxFQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUMsRUFBRSxDQUNsQyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBQyxFQUFFLENBQ2xDLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUNoRCxDQUFDLEVBQ0YsQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FDYixNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLFVBQUEsS0FBSztlQUFJLEtBQUssQ0FBQyxFQUFFO09BQUEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEtBQUssRUFBSTtBQUNyRCxlQUFPLENBQUMsQ0FBQyxhQUFhLEVBQUUsRUFBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUM7T0FDNUUsQ0FBQyxDQUNILENBQUMsQ0FDSCxDQUFDO0tBQ0gsQ0FBQyxFQUNILENBQUM7Q0FDSCxDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwicmVxdWlyZShcIi4vc2hpbXNcIik7XG5cbi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZWpzXCIpO1xubGV0IE1vZGVsID0gcmVxdWlyZShcIi4vbW9kZWxcIik7XG5sZXQgVmlldyA9IHJlcXVpcmUoXCIuL3ZpZXdcIik7XG5sZXQgSW50ZW50ID0gcmVxdWlyZShcIi4vaW50ZW50XCIpO1xuXG4vLyBBUFAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgRE9NID0gQ3ljbGUuY3JlYXRlRE9NVXNlcihcIm1haW5cIik7XG5cbkRPTS5pbmplY3QoVmlldykuaW5qZWN0KE1vZGVsKS5pbmplY3QoSW50ZW50KS5pbmplY3QoRE9NKTsiLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQ3ljbGUgPSByZXF1aXJlKFwiY3ljbGVqc1wiKTtcbmxldCB7Unh9ID0gQ3ljbGU7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBJbnRlbnQgPSBDeWNsZS5jcmVhdGVJbnRlbnQoRE9NID0+IHtcbiAgcmV0dXJuIHtcbiAgICBhZGQkOiBET00uZXZlbnQkKFwiLmFkZFwiLCBcImNsaWNrXCIpLm1hcChldmVudCA9PiAxKSxcbiAgICByZW1vdmUkOiBET00uZXZlbnQkKFwiLml0ZW1cIiwgXCJyZW1vdmVcIikubWFwKGV2ZW50ID0+IGV2ZW50LmRhdGEpLFxuICAgIGNoYW5nZVdpZHRoJDogRE9NLmV2ZW50JChcIi5pdGVtXCIsIFwiY2hhbmdlV2lkdGhcIikubWFwKGV2ZW50ID0+IGV2ZW50LmRhdGEpLFxuICB9O1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZW50OyIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCB1dWlkID0gcmVxdWlyZShcIm5vZGUtdXVpZFwiKTtcbmxldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZWpzXCIpO1xubGV0IHtSeH0gPSBDeWNsZTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IE1vZGVsID0gQ3ljbGUuY3JlYXRlTW9kZWwoSW50ZW50ID0+IHtcbiAgbGV0IGFkZCQgPSBJbnRlbnQuZ2V0KFwiYWRkJFwiKS5tYXAoKCkgPT4ge1xuICAgIHJldHVybiBmdW5jdGlvbiB0cmFuc2Zvcm0oc3RhdGUpIHtcbiAgICAgIGxldCBtb2RlbCA9IGNyZWF0ZVJhbmRvbSgpO1xuICAgICAgbGV0IHN0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUpO1xuICAgICAgc3RhdGVbbW9kZWwuaWRdID0gbW9kZWw7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfTtcbiAgfSk7XG5cbiAgbGV0IHJlbW92ZSQgPSBJbnRlbnQuZ2V0KFwicmVtb3ZlJFwiKS5tYXAoaWQgPT4ge1xuICAgIHJldHVybiBmdW5jdGlvbiB0cmFuc2Zvcm0oc3RhdGUpIHtcbiAgICAgIGxldCBzdGF0ZSA9IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlKTtcbiAgICAgIGRlbGV0ZSBzdGF0ZVtpZF07XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfTtcbiAgfSk7XG5cbiAgbGV0IGNoYW5nZVdpZHRoJCA9IEludGVudC5nZXQoXCJjaGFuZ2VXaWR0aCRcIikubWFwKG1vZGVsID0+IHtcbiAgICByZXR1cm4gZnVuY3Rpb24gdHJhbnNmb3JtKHN0YXRlKSB7XG4gICAgICBzdGF0ZVttb2RlbC5pZF0ud2lkdGggPSBtb2RlbC53aWR0aDtcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9O1xuICB9KTtcblxuICBsZXQgdHJhbnNmb3JtcyA9IFJ4Lk9ic2VydmFibGUubWVyZ2UoXG4gICAgYWRkJCxcbiAgICByZW1vdmUkLFxuICAgIGNoYW5nZVdpZHRoJFxuICApO1xuXG4gIHJldHVybiB7XG4gICAgc3RhdGUkOiB0cmFuc2Zvcm1zXG4gICAgICAuc3RhcnRXaXRoKHNlZWRTdGF0ZSgpKVxuICAgICAgLnNjYW4oKHN0YXRlLCB0cmFuc2Zvcm0pID0+IChcbiAgICAgICAgdHJhbnNmb3JtKHN0YXRlKVxuICAgICAgKSksXG4gIH07XG59KTtcblxuZnVuY3Rpb24gY3JlYXRlUmFuZG9tKHdpdGhEYXRhKSB7XG4gIHJldHVybiBPYmplY3QuYXNzaWduKHtcbiAgICBpZDogdXVpZC52NCgpLFxuICAgIHdpZHRoOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA4MDAgKyAyMDApLFxuICB9LCB3aXRoRGF0YSk7XG59XG5cbmZ1bmN0aW9uIHNlZWRTdGF0ZSgpIHtcbiAgbGV0IG1vZGVsID0gY3JlYXRlUmFuZG9tKCk7XG4gIGxldCBzdGF0ZSA9IHtcbiAgICBbbW9kZWwuaWRdOiBtb2RlbCxcbiAgfTtcbiAgcmV0dXJuIHN0YXRlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsOyIsInJlcXVpcmUoXCJvYmplY3QuYXNzaWduXCIpLnNoaW0oKTtcblxuY29uc29sZS5lcnJvciA9IGNvbnNvbGUubG9nOyIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZWpzXCIpO1xubGV0IHtSeCwgaH0gPSBDeWNsZTtcblxuLy8gRUxFTUVOVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuQ3ljbGUucmVnaXN0ZXJDdXN0b21FbGVtZW50KFwiU2xpZGVyXCIsIChET00sIFByb3BzKSA9PiB7XG4gIGxldCBNb2RlbCA9IEN5Y2xlLmNyZWF0ZU1vZGVsKChJbnRlbnQsIFByb3BzKSA9PiAoe1xuICAgIGlkJDogUHJvcHMuZ2V0KFwiaWQkXCIpLnNoYXJlUmVwbGF5KDEpLFxuICAgIHdpZHRoJDogUHJvcHMuZ2V0KFwid2lkdGgkXCIpLm1lcmdlKEludGVudC5nZXQoXCJjaGFuZ2VXaWR0aCRcIikpLFxuICB9KSk7XG5cbiAgbGV0IFZpZXcgPSBDeWNsZS5jcmVhdGVWaWV3KE1vZGVsID0+IHtcbiAgICBsZXQgaWQkID0gTW9kZWwuZ2V0KFwiaWQkXCIpO1xuICAgIGxldCB3aWR0aCQgPSBNb2RlbC5nZXQoXCJ3aWR0aCRcIik7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZ0cmVlJDogd2lkdGgkLmNvbWJpbmVMYXRlc3QoaWQkLCAod2lkdGgsIGlkKSA9PiAoXG4gICAgICAgIGgoJ2RpdicsIHtjbGFzc05hbWU6IFwiaXRlbVwiLCBzdHlsZToge3dpZHRoOiB3aWR0aCArIFwicHhcIn19LCBbXG4gICAgICAgICAgaCgnZGl2JywgbnVsbCwgW1xuICAgICAgICAgICAgaCgnaW5wdXQnLCB7Y2xhc3NOYW1lOiBcIndpZHRoLXNsaWRlclwiLCB0eXBlOiBcInJhbmdlXCIsIG1pbjogXCIyMDBcIiwgbWF4OiBcIjEwMDBcIiwgdmFsdWU6IHdpZHRofSlcbiAgICAgICAgICBdKSxcbiAgICAgICAgICBoKCdidXR0b24nLCB7Y2xhc3NOYW1lOiBcInJlbW92ZVwifSwgW1wiUmVtb3ZlXCJdKVxuICAgICAgICBdKVxuICAgICAgKSksXG4gICAgfTtcbiAgfSk7XG5cbiAgbGV0IEludGVudCA9IEN5Y2xlLmNyZWF0ZUludGVudChET00gPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBjaGFuZ2VXaWR0aCQ6IERPTS5ldmVudCQoXCIud2lkdGgtc2xpZGVyXCIsIFwiaW5wdXRcIikubWFwKGV2ZW50ID0+IHBhcnNlSW50KGV2ZW50LnRhcmdldC52YWx1ZSkpLFxuICAgICAgcmVtb3ZlJDogRE9NLmV2ZW50JChcIi5yZW1vdmVcIiwgXCJjbGlja1wiKS5tYXAoZXZlbnQgPT4gdHJ1ZSksXG4gICAgfTtcbiAgfSk7XG5cbiAgRE9NLmluamVjdChWaWV3KS5pbmplY3QoTW9kZWwpLmluamVjdChJbnRlbnQsIFByb3BzKVswXS5pbmplY3QoRE9NKTtcblxuICByZXR1cm4ge1xuICAgIGNoYW5nZVdpZHRoJDogSW50ZW50LmdldChcImNoYW5nZVdpZHRoJFwiKVxuICAgICAgLmNvbWJpbmVMYXRlc3QoTW9kZWwuZ2V0KFwiaWQkXCIpLCAod2lkdGgsIGlkKSA9PiAoe2lkLCB3aWR0aH0pKSxcblxuICAgIHJlbW92ZSQ6IEludGVudC5nZXQoXCJyZW1vdmUkXCIpXG4gICAgICAuY29tYmluZUxhdGVzdChNb2RlbC5nZXQoXCJpZCRcIiksIChfLCBpZCkgPT4gaWQpLFxuICB9O1xufSk7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgc29ydEJ5ID0gcmVxdWlyZShcImxvZGFzaC5zb3J0YnlcIik7XG5sZXQgdmFsdWVzID0gcmVxdWlyZShcImxvZGFzaC52YWx1ZXNcIik7XG5sZXQgQ3ljbGUgPSByZXF1aXJlKFwiY3ljbGVqc1wiKTtcbmxldCB7UngsIGh9ID0gQ3ljbGU7XG5sZXQgU2xpZGVyID0gcmVxdWlyZShcIi4vc2xpZGVyXCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgVmlldyA9IEN5Y2xlLmNyZWF0ZVZpZXcoTW9kZWwgPT4ge1xuICBsZXQgc3RhdGUkID0gTW9kZWwuZ2V0KFwic3RhdGUkXCIpO1xuICByZXR1cm4ge1xuICAgIHZ0cmVlJDogc3RhdGUkLm1hcChtb2RlbHMgPT4gKFxuICAgICAgaCgnZGl2Jywge2NsYXNzTmFtZTogXCJldmVyeXRoaW5nXCJ9LCBbXG4gICAgICAgIGgoJ2RpdicsIHtjbGFzc05hbWU6IFwidG9wQnV0dG9uc1wifSwgW1xuICAgICAgICAgIGgoJ2J1dHRvbicsIHtjbGFzc05hbWU6IFwiYWRkXCJ9LCBbXCJBZGQgUmFuZG9tXCJdKVxuICAgICAgICBdKSxcbiAgICAgICAgaCgnZGl2JywgbnVsbCwgW1xuICAgICAgICAgIHNvcnRCeSh2YWx1ZXMobW9kZWxzKSwgbW9kZWwgPT4gbW9kZWwuaWQpLm1hcChtb2RlbCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gaChcIlNsaWRlci5pdGVtXCIsIHtpZDogbW9kZWwuaWQsIHdpZHRoOiBtb2RlbC53aWR0aCwga2V5OiBtb2RlbC5pZH0pO1xuICAgICAgICAgIH0pXG4gICAgICAgIF0pXG4gICAgICBdKVxuICAgICkpLFxuICB9O1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldzsiXX0=
