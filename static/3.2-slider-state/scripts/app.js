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

},{"./intent":3,"./model":5,"./shims":6,"./view":7,"cyclejs":"cyclejs"}],2:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;
var h = Cycle.h;

// ELEMENTS ========================================================================================
Cycle.registerCustomElement("Footer", function (User) {
  var View = Cycle.createView(function () {
    return {
      vtree$: Rx.Observable["return"](h("div", null, ["=== footer ==="]))
    };
  });

  User.inject(View);
});

},{"cyclejs":"cyclejs"}],3:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;

// EXPORTS =========================================================================================
var Intent = Cycle.createIntent(function (DOM) {
  return {
    changeWidth$: DOM.event$(".item", "changeWidth").map(function (event) {
      return event.data;
    }) };
});

module.exports = Intent;

},{"cyclejs":"cyclejs"}],4:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;
var h = Cycle.h;

// ELEMENTS ========================================================================================
Cycle.registerCustomElement("item", function (DOM, Props) {
  var View = Cycle.createView(function (Model) {
    var id$ = Model.get("id$");
    var width$ = Model.get("width$");
    return {
      vtree$: Rx.Observable.combineLatest(id$, width$, function (id, width) {
        return h("div", { className: "item", style: { width: width + "px" } }, [h("div", null, [h("input", { className: "width-slider", type: "range", min: "200", max: "1000", value: width })])]);
      }) };
  });

  var Model = Cycle.createModel(function (Intent, Props) {
    return {
      id$: Props.get("id$").shareReplay(1),
      width$: Props.get("width$") };
  });

  var Intent = Cycle.createIntent(function (DOM) {
    return {
      changeWidth$: DOM.event$(".width-slider", "input").map(function (event) {
        return parseInt(event.target.value);
      }) };
  });

  DOM.inject(View).inject(Model).inject(Intent, Props)[0].inject(DOM);

  return {
    changeWidth$: Intent.get("changeWidth$").withLatestFrom(Model.get("id$"), function (width, id) {
      return { id: id, width: width };
    }) };
});

},{"cyclejs":"cyclejs"}],5:[function(require,module,exports){
"use strict";

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); };

// IMPORTS =========================================================================================
var uuid = require("node-uuid");
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;

// EXPORTS =========================================================================================
var Model = Cycle.createModel(function (Intent) {
  var changeWidth$ = Intent.get("changeWidth$").map(function (model) {
    return function transform(state) {
      state[model.id].width = model.width;
      return state;
    };
  });

  var transforms = Rx.Observable.merge(changeWidth$);

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

},{"cyclejs":"cyclejs","node-uuid":"node-uuid"}],6:[function(require,module,exports){
"use strict";

require("object.assign").shim();

console.error = console.log;

},{"object.assign":"object.assign"}],7:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var sortBy = require("lodash.sortby");
var values = require("lodash.values");
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;
var h = Cycle.h;

var Footer = require("./footer");
var Item = require("./item");

// EXPORTS =========================================================================================
var View = Cycle.createView(function (Model) {
  var state$ = Model.get("state$");
  return {
    vtree$: state$.map(function (models) {
      return h("div", { className: "everything" }, [h("div", null, [sortBy(values(models), function (model) {
        return model.id;
      }).map(function (model) {
        return h("Item.item", { id: model.id, width: model.width, key: model.id });
      })]), h("Footer")]);
    }) };
});

module.exports = View;

},{"./footer":2,"./item":4,"cyclejs":"cyclejs","lodash.sortby":"lodash.sortby","lodash.values":"lodash.values"}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImJ1aWxkLzMuMi1zbGlkZXItc3RhdGUvYXBwLmpzIiwiYnVpbGQvMy4yLXNsaWRlci1zdGF0ZS9mb290ZXIuanMiLCJidWlsZC8zLjItc2xpZGVyLXN0YXRlL2ludGVudC5qcyIsImJ1aWxkLzMuMi1zbGlkZXItc3RhdGUvaXRlbS5qcyIsImJ1aWxkLzMuMi1zbGlkZXItc3RhdGUvbW9kZWwuanMiLCJidWlsZC8zLjItc2xpZGVyLXN0YXRlL3NoaW1zLmpzIiwiYnVpbGQvMy4yLXNsaWRlci1zdGF0ZS92aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7OztBQUduQixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDL0IsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQy9CLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM3QixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7OztBQUdqQyxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUV0QyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDOzs7Ozs7QUNWMUQsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzFCLEVBQUUsR0FBTyxLQUFLLENBQWQsRUFBRTtJQUFFLENBQUMsR0FBSSxLQUFLLENBQVYsQ0FBQzs7O0FBR1YsS0FBSyxDQUFD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LEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDOzs7QUFHN0IsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxVQUFBLEtBQUssRUFBSTtBQUNuQyxNQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2pDLFNBQU87QUFDTCxVQUFNLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFBLE1BQU0sRUFBSTtBQUMzQixhQUNFLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFDLEVBQUUsQ0FDbEMsQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FDYixNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLFVBQUEsS0FBSztlQUFJLEtBQUssQ0FBQyxFQUFFO09BQUEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEtBQUssRUFBSTtBQUNyRCxlQUFPLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUM7T0FDMUUsQ0FBQyxDQUNILENBQUMsRUFDRixDQUFDLENBQUMsUUFBUSxDQUFDLENBQ1osQ0FBQyxDQUNGO0tBQ0gsQ0FBQyxFQUNILENBQUM7Q0FDSCxDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwicmVxdWlyZShcIi4vc2hpbXNcIik7XG5cbi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZWpzXCIpO1xubGV0IE1vZGVsID0gcmVxdWlyZShcIi4vbW9kZWxcIik7XG5sZXQgVmlldyA9IHJlcXVpcmUoXCIuL3ZpZXdcIik7XG5sZXQgSW50ZW50ID0gcmVxdWlyZShcIi4vaW50ZW50XCIpO1xuXG4vLyBBUFAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgRE9NID0gQ3ljbGUuY3JlYXRlRE9NVXNlcihcIm1haW5cIik7XG5cbkRPTS5pbmplY3QoVmlldykuaW5qZWN0KE1vZGVsKS5pbmplY3QoSW50ZW50KS5pbmplY3QoRE9NKTsiLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQ3ljbGUgPSByZXF1aXJlKFwiY3ljbGVqc1wiKTtcbmxldCB7UngsIGh9ID0gQ3ljbGU7XG5cbi8vIEVMRU1FTlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkN5Y2xlLnJlZ2lzdGVyQ3VzdG9tRWxlbWVudChcIkZvb3RlclwiLCBmdW5jdGlvbihVc2VyKSB7XG4gIGxldCBWaWV3ID0gQ3ljbGUuY3JlYXRlVmlldyhmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdnRyZWUkOiBSeC5PYnNlcnZhYmxlLnJldHVybihcbiAgICAgICAgaCgnZGl2JywgbnVsbCwgW1wiPT09IGZvb3RlciA9PT1cIl0pXG4gICAgICApXG4gICAgfTtcbiAgfSk7XG5cbiAgVXNlci5pbmplY3QoVmlldyk7XG59KTsiLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQ3ljbGUgPSByZXF1aXJlKFwiY3ljbGVqc1wiKTtcbmxldCB7Unh9ID0gQ3ljbGU7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBJbnRlbnQgPSBDeWNsZS5jcmVhdGVJbnRlbnQoRE9NID0+IHtcbiAgcmV0dXJuIHtcbiAgICBjaGFuZ2VXaWR0aCQ6IERPTS5ldmVudCQoXCIuaXRlbVwiLCBcImNoYW5nZVdpZHRoXCIpLm1hcChldmVudCA9PiBldmVudC5kYXRhKSxcbiAgfTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEludGVudDsiLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQ3ljbGUgPSByZXF1aXJlKFwiY3ljbGVqc1wiKTtcbmxldCB7UngsIGh9ID0gQ3ljbGU7XG5cbi8vIEVMRU1FTlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkN5Y2xlLnJlZ2lzdGVyQ3VzdG9tRWxlbWVudChcIml0ZW1cIiwgKERPTSwgUHJvcHMpID0+IHtcbiAgbGV0IFZpZXcgPSBDeWNsZS5jcmVhdGVWaWV3KE1vZGVsID0+IHtcbiAgICBsZXQgaWQkID0gTW9kZWwuZ2V0KFwiaWQkXCIpO1xuICAgIGxldCB3aWR0aCQgPSBNb2RlbC5nZXQoXCJ3aWR0aCRcIik7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZ0cmVlJDogUnguT2JzZXJ2YWJsZS5jb21iaW5lTGF0ZXN0KGlkJCwgd2lkdGgkLCAoaWQsIHdpZHRoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIGgoJ2RpdicsIHtjbGFzc05hbWU6IFwiaXRlbVwiLCBzdHlsZToge3dpZHRoOiB3aWR0aCArIFwicHhcIn19LCBbXG4gICAgICAgICAgICAgIGgoJ2RpdicsIG51bGwsIFtcbiAgICAgICAgICAgICAgICBoKCdpbnB1dCcsIHtjbGFzc05hbWU6IFwid2lkdGgtc2xpZGVyXCIsIHR5cGU6IFwicmFuZ2VcIiwgbWluOiBcIjIwMFwiLCBtYXg6IFwiMTAwMFwiLCB2YWx1ZTogd2lkdGh9KVxuICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgXSlcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICApLFxuICAgIH07XG4gIH0pO1xuXG4gIGxldCBNb2RlbCA9IEN5Y2xlLmNyZWF0ZU1vZGVsKChJbnRlbnQsIFByb3BzKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkJDogUHJvcHMuZ2V0KFwiaWQkXCIpLnNoYXJlUmVwbGF5KDEpLFxuICAgICAgd2lkdGgkOiBQcm9wcy5nZXQoXCJ3aWR0aCRcIiksXG4gICAgfTtcbiAgfSk7XG5cbiAgbGV0IEludGVudCA9IEN5Y2xlLmNyZWF0ZUludGVudChET00gPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBjaGFuZ2VXaWR0aCQ6IERPTS5ldmVudCQoXCIud2lkdGgtc2xpZGVyXCIsIFwiaW5wdXRcIikubWFwKGV2ZW50ID0+IHBhcnNlSW50KGV2ZW50LnRhcmdldC52YWx1ZSkpLFxuICAgIH07XG4gIH0pO1xuXG4gIERPTS5pbmplY3QoVmlldykuaW5qZWN0KE1vZGVsKS5pbmplY3QoSW50ZW50LCBQcm9wcylbMF0uaW5qZWN0KERPTSk7XG5cbiAgcmV0dXJuIHtcbiAgICBjaGFuZ2VXaWR0aCQ6IEludGVudC5nZXQoXCJjaGFuZ2VXaWR0aCRcIilcbiAgICAgIC53aXRoTGF0ZXN0RnJvbShNb2RlbC5nZXQoXCJpZCRcIiksICh3aWR0aCwgaWQpID0+ICh7aWQsIHdpZHRofSkpLFxuICB9O1xufSk7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgdXVpZCA9IHJlcXVpcmUoXCJub2RlLXV1aWRcIik7XG5sZXQgQ3ljbGUgPSByZXF1aXJlKFwiY3ljbGVqc1wiKTtcbmxldCB7Unh9ID0gQ3ljbGU7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBNb2RlbCA9IEN5Y2xlLmNyZWF0ZU1vZGVsKEludGVudCA9PiB7XG4gIGxldCBjaGFuZ2VXaWR0aCQgPSBJbnRlbnQuZ2V0KFwiY2hhbmdlV2lkdGgkXCIpLm1hcChtb2RlbCA9PiB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIHRyYW5zZm9ybShzdGF0ZSkge1xuICAgICAgc3RhdGVbbW9kZWwuaWRdLndpZHRoID0gbW9kZWwud2lkdGg7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfTtcbiAgfSk7XG5cbiAgbGV0IHRyYW5zZm9ybXMgPSBSeC5PYnNlcnZhYmxlLm1lcmdlKFxuICAgIGNoYW5nZVdpZHRoJFxuICApO1xuXG4gIHJldHVybiB7XG4gICAgc3RhdGUkOiB0cmFuc2Zvcm1zXG4gICAgICAuc3RhcnRXaXRoKHNlZWRTdGF0ZSgpKVxuICAgICAgLnNjYW4oZnVuY3Rpb24oc3RhdGUsIHRyYW5zZm9ybSkge1xuICAgICAgICByZXR1cm4gdHJhbnNmb3JtKHN0YXRlKTtcbiAgICAgIH0pLFxuICB9O1xufSk7XG5cbmZ1bmN0aW9uIGNyZWF0ZVJhbmRvbSh3aXRoRGF0YSkge1xuICByZXR1cm4gT2JqZWN0LmFzc2lnbih7XG4gICAgaWQ6IHV1aWQudjQoKSxcbiAgICB3aWR0aDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogODAwICsgMjAwKSxcbiAgfSwgd2l0aERhdGEpO1xufVxuXG5mdW5jdGlvbiBzZWVkU3RhdGUoKSB7XG4gIGxldCBtb2RlbCA9IGNyZWF0ZVJhbmRvbSgpO1xuICBsZXQgc3RhdGUgPSB7XG4gICAgW21vZGVsLmlkXTogbW9kZWwsXG4gIH07XG4gIHJldHVybiBzdGF0ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbDsiLCJyZXF1aXJlKFwib2JqZWN0LmFzc2lnblwiKS5zaGltKCk7XG5cbmNvbnNvbGUuZXJyb3IgPSBjb25zb2xlLmxvZzsiLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgc29ydEJ5ID0gcmVxdWlyZShcImxvZGFzaC5zb3J0YnlcIik7XG5sZXQgdmFsdWVzID0gcmVxdWlyZShcImxvZGFzaC52YWx1ZXNcIik7XG5sZXQgQ3ljbGUgPSByZXF1aXJlKFwiY3ljbGVqc1wiKTtcbmxldCB7UngsIGh9ID0gQ3ljbGU7XG5sZXQgRm9vdGVyID0gcmVxdWlyZShcIi4vZm9vdGVyXCIpO1xubGV0IEl0ZW0gPSByZXF1aXJlKFwiLi9pdGVtXCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgVmlldyA9IEN5Y2xlLmNyZWF0ZVZpZXcoTW9kZWwgPT4ge1xuICBsZXQgc3RhdGUkID0gTW9kZWwuZ2V0KFwic3RhdGUkXCIpO1xuICByZXR1cm4ge1xuICAgIHZ0cmVlJDogc3RhdGUkLm1hcChtb2RlbHMgPT4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgaCgnZGl2Jywge2NsYXNzTmFtZTogXCJldmVyeXRoaW5nXCJ9LCBbXG4gICAgICAgICAgaCgnZGl2JywgbnVsbCwgW1xuICAgICAgICAgICAgc29ydEJ5KHZhbHVlcyhtb2RlbHMpLCBtb2RlbCA9PiBtb2RlbC5pZCkubWFwKG1vZGVsID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGgoXCJJdGVtLml0ZW1cIiwge2lkOiBtb2RlbC5pZCwgd2lkdGg6IG1vZGVsLndpZHRoLCBrZXk6IG1vZGVsLmlkfSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIF0pLFxuICAgICAgICAgIGgoXCJGb290ZXJcIilcbiAgICAgICAgXSlcbiAgICAgICk7XG4gICAgfSksXG4gIH07XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3OyJdfQ==
