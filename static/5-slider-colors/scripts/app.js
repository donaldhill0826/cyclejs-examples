(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/ivankleshnin/JavaScript/cyclejs-examples/build/5-slider-colors/app.js":[function(require,module,exports){
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

},{"./intent":"/Users/ivankleshnin/JavaScript/cyclejs-examples/build/5-slider-colors/intent.js","./model":"/Users/ivankleshnin/JavaScript/cyclejs-examples/build/5-slider-colors/model.js","./shims":"/Users/ivankleshnin/JavaScript/cyclejs-examples/build/5-slider-colors/shims.js","./view":"/Users/ivankleshnin/JavaScript/cyclejs-examples/build/5-slider-colors/view.js","cyclejs":"cyclejs"}],"/Users/ivankleshnin/JavaScript/cyclejs-examples/build/5-slider-colors/footer.js":[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;
var h = Cycle.h;

// ELEMENTS ========================================================================================
Cycle.registerCustomElement("footer", function (User) {
  var View = Cycle.createView(function () {
    return {
      vtree$: Rx.Observable["return"](h("div", null, ["=== footer ==="]))
    };
  });

  User.inject(View);
});

},{"cyclejs":"cyclejs"}],"/Users/ivankleshnin/JavaScript/cyclejs-examples/build/5-slider-colors/intent.js":[function(require,module,exports){
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
    }),
    changeColor$: DOM.event$(".item", "changeColor").map(function (event) {
      return event.data;
    }) };
});

module.exports = Intent;

},{"cyclejs":"cyclejs"}],"/Users/ivankleshnin/JavaScript/cyclejs-examples/build/5-slider-colors/item.js":[function(require,module,exports){
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
    var color$ = Model.get("color$");
    return {
      vtree$: Rx.Observable.combineLatest(id$, width$, color$, function (id, width, color) {
        return h("div", { className: "item", style: { width: width + "px", backgroundColor: color } }, [h("div", null, [h("input", { className: "width-slider", type: "range", min: "200", max: "1000", value: width })]), h("div", null, [h("input", { className: "color-input", type: "text", value: color })]), h("button", { className: "remove" }, ["Remove"])]);
      }) };
  });

  var Model = Cycle.createModel(function (Intent, Props) {
    return {
      id$: Props.get("id$").shareReplay(1),
      width$: Props.get("width$"),
      color$: Props.get("color$") };
  });

  var Intent = Cycle.createIntent(function (DOM) {
    return {
      changeWidth$: DOM.event$(".width-slider", "input").map(function (event) {
        return parseInt(event.target.value);
      }),
      changeColor$: DOM.event$(".color-input", "input").map(function (event) {
        return event.target.value;
      }),
      remove$: DOM.event$(".remove", "click").map(function (event) {
        return true;
      }) };
  });

  DOM.inject(View).inject(Model).inject(Intent, Props)[0].inject(DOM);

  return {
    changeWidth$: Intent.get("changeWidth$").withLatestFrom(Model.get("id$"), function (width, id) {
      return { id: id, width: width };
    }),

    changeColor$: Intent.get("changeColor$").withLatestFrom(Model.get("id$"), function (color, id) {
      return { id: id, color: color };
    }),

    remove$: Intent.get("remove$").withLatestFrom(Model.get("id$"), function (_, id) {
      return id;
    }) };
});

},{"cyclejs":"cyclejs"}],"/Users/ivankleshnin/JavaScript/cyclejs-examples/build/5-slider-colors/model.js":[function(require,module,exports){
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

  var changeColor$ = Intent.get("changeColor$").map(function (model) {
    return function (state) {
      state[model.id].color = model.color;
      return state;
    };
  });

  var transforms = Rx.Observable.merge(add$, remove$, changeColor$, changeWidth$);

  return {
    state$: transforms.startWith(seedState()).scan(function (state, transform) {
      return transform(state);
    })
  };
});

function createRandom(withData) {
  return Object.assign({
    id: uuid.v4(),
    width: Math.floor(Math.random() * 800 + 200),
    color: "#" + Math.random().toString(16).substr(-6) }, withData);
}

function seedState() {
  var model = createRandom();
  var state = _defineProperty({}, model.id, model);
  return state;
}

module.exports = Model;

},{"cyclejs":"cyclejs","node-uuid":"node-uuid"}],"/Users/ivankleshnin/JavaScript/cyclejs-examples/build/5-slider-colors/shims.js":[function(require,module,exports){
"use strict";

require("object.assign").shim();

console.error = console.log;

},{"object.assign":"object.assign"}],"/Users/ivankleshnin/JavaScript/cyclejs-examples/build/5-slider-colors/view.js":[function(require,module,exports){
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
      return h("div", { className: "everything" }, [h("div", { className: "topButtons" }, [h("button", { className: "add" }, ["Add Random"])]), h("div", null, [sortBy(values(models), function (model) {
        return model.id;
      }).map(function (model) {
        return h("Item.item", { id: model.id, width: model.width, color: model.color, key: model.id });
      })]), h("Footer")]);
    }) };
});

module.exports = View;

},{"./footer":"/Users/ivankleshnin/JavaScript/cyclejs-examples/build/5-slider-colors/footer.js","./item":"/Users/ivankleshnin/JavaScript/cyclejs-examples/build/5-slider-colors/item.js","cyclejs":"cyclejs","lodash.sortby":"lodash.sortby","lodash.values":"lodash.values"}]},{},["/Users/ivankleshnin/JavaScript/cyclejs-examples/build/5-slider-colors/app.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC81LXNsaWRlci1jb2xvcnMvYXBwLmpzIiwiYnVpbGQvNS1zbGlkZXItY29sb3JzL2Zvb3Rlci5qcyIsImJ1aWxkLzUtc2xpZGVyLWNvbG9ycy9pbnRlbnQuanMiLCJidWlsZC81LXNsaWRlci1jb2xvcnMvaXRlbS5qcyIsImJ1aWxkLzUtc2xpZGVyLWNvbG9ycy9tb2RlbC5qcyIsImJ1aWxkLzUtc2xpZGVyLWNvbG9ycy9zaGltcy5qcyIsImJ1aWxkLzUtc2xpZGVyLWNvbG9ycy92aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7OztBQUduQixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDL0IsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQy9CLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM3QixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7OztBQUdqQyxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUV0QyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDOzs7Ozs7QUNWMUQsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzFCLEVBQUUsR0FBTyxLQUFLLENBQWQsRUFBRTtJQUFFLENBQUMsR0FBSSxLQUFLLENBQVYsQ0FBQzs7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QUFDLFVBQUEsS0FBSyxFQUFJO0FBQ3JELGVBQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQztPQUM5RixDQUFDLENBQ0gsQ0FBQyxFQUNGLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FDWixDQUFDLENBQ0Y7S0FDSCxDQUFDLEVBQ0gsQ0FBQztDQUNILENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJyZXF1aXJlKFwiLi9zaGltc1wiKTtcblxuLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEN5Y2xlID0gcmVxdWlyZShcImN5Y2xlanNcIik7XG5sZXQgTW9kZWwgPSByZXF1aXJlKFwiLi9tb2RlbFwiKTtcbmxldCBWaWV3ID0gcmVxdWlyZShcIi4vdmlld1wiKTtcbmxldCBJbnRlbnQgPSByZXF1aXJlKFwiLi9pbnRlbnRcIik7XG5cbi8vIEFQUCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBET00gPSBDeWNsZS5jcmVhdGVET01Vc2VyKFwibWFpblwiKTtcblxuRE9NLmluamVjdChWaWV3KS5pbmplY3QoTW9kZWwpLmluamVjdChJbnRlbnQpLmluamVjdChET00pOyIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZWpzXCIpO1xubGV0IHtSeCwgaH0gPSBDeWNsZTtcblxuLy8gRUxFTUVOVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuQ3ljbGUucmVnaXN0ZXJDdXN0b21FbGVtZW50KFwiZm9vdGVyXCIsIGZ1bmN0aW9uKFVzZXIpIHtcbiAgbGV0IFZpZXcgPSBDeWNsZS5jcmVhdGVWaWV3KGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICB2dHJlZSQ6IFJ4Lk9ic2VydmFibGUucmV0dXJuKFxuICAgICAgICBoKCdkaXYnLCBudWxsLCBbXCI9PT0gZm9vdGVyID09PVwiXSlcbiAgICAgIClcbiAgICB9O1xuICB9KTtcblxuICBVc2VyLmluamVjdChWaWV3KTtcbn0pOyIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZWpzXCIpO1xubGV0IHtSeH0gPSBDeWNsZTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEludGVudCA9IEN5Y2xlLmNyZWF0ZUludGVudChET00gPT4ge1xuICByZXR1cm4ge1xuICAgIGFkZCQ6IERPTS5ldmVudCQoXCIuYWRkXCIsIFwiY2xpY2tcIikubWFwKGV2ZW50ID0+IDEpLFxuICAgIHJlbW92ZSQ6IERPTS5ldmVudCQoXCIuaXRlbVwiLCBcInJlbW92ZVwiKS5tYXAoZXZlbnQgPT4gZXZlbnQuZGF0YSksXG4gICAgY2hhbmdlV2lkdGgkOiBET00uZXZlbnQkKFwiLml0ZW1cIiwgXCJjaGFuZ2VXaWR0aFwiKS5tYXAoZXZlbnQgPT4gZXZlbnQuZGF0YSksXG4gICAgY2hhbmdlQ29sb3IkOiBET00uZXZlbnQkKFwiLml0ZW1cIiwgXCJjaGFuZ2VDb2xvclwiKS5tYXAoZXZlbnQgPT4gZXZlbnQuZGF0YSksXG4gIH07XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBJbnRlbnQ7IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEN5Y2xlID0gcmVxdWlyZShcImN5Y2xlanNcIik7XG5sZXQge1J4LCBofSA9IEN5Y2xlO1xuXG4vLyBFTEVNRU5UUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5DeWNsZS5yZWdpc3RlckN1c3RvbUVsZW1lbnQoXCJpdGVtXCIsIChET00sIFByb3BzKSA9PiB7XG4gIGxldCBWaWV3ID0gQ3ljbGUuY3JlYXRlVmlldyhNb2RlbCA9PiB7XG4gICAgbGV0IGlkJCA9IE1vZGVsLmdldChcImlkJFwiKTtcbiAgICBsZXQgd2lkdGgkID0gTW9kZWwuZ2V0KFwid2lkdGgkXCIpO1xuICAgIGxldCBjb2xvciQgPSBNb2RlbC5nZXQoXCJjb2xvciRcIik7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZ0cmVlJDogUnguT2JzZXJ2YWJsZS5jb21iaW5lTGF0ZXN0KGlkJCwgd2lkdGgkLCBjb2xvciQsIChpZCwgd2lkdGgsIGNvbG9yKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIGgoJ2RpdicsIHtjbGFzc05hbWU6IFwiaXRlbVwiLCBzdHlsZToge3dpZHRoOiB3aWR0aCArIFwicHhcIiwgYmFja2dyb3VuZENvbG9yOiBjb2xvcn19LCBbXG4gICAgICAgICAgICAgIGgoJ2RpdicsIG51bGwsIFtcbiAgICAgICAgICAgICAgICBoKCdpbnB1dCcsIHtjbGFzc05hbWU6IFwid2lkdGgtc2xpZGVyXCIsIHR5cGU6IFwicmFuZ2VcIiwgbWluOiBcIjIwMFwiLCBtYXg6IFwiMTAwMFwiLCB2YWx1ZTogd2lkdGh9KVxuICAgICAgICAgICAgICBdKSxcbiAgICAgICAgICAgICAgaCgnZGl2JywgbnVsbCwgW1xuICAgICAgICAgICAgICAgIGgoJ2lucHV0Jywge2NsYXNzTmFtZTogXCJjb2xvci1pbnB1dFwiLCB0eXBlOiBcInRleHRcIiwgdmFsdWU6IGNvbG9yfSlcbiAgICAgICAgICAgICAgXSksXG4gICAgICAgICAgICAgIGgoJ2J1dHRvbicsIHtjbGFzc05hbWU6IFwicmVtb3ZlXCJ9LCBbXCJSZW1vdmVcIl0pXG4gICAgICAgICAgICBdKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICksXG4gICAgfTtcbiAgfSk7XG5cbiAgbGV0IE1vZGVsID0gQ3ljbGUuY3JlYXRlTW9kZWwoKEludGVudCwgUHJvcHMpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQkOiBQcm9wcy5nZXQoXCJpZCRcIikuc2hhcmVSZXBsYXkoMSksXG4gICAgICB3aWR0aCQ6IFByb3BzLmdldChcIndpZHRoJFwiKSxcbiAgICAgIGNvbG9yJDogUHJvcHMuZ2V0KFwiY29sb3IkXCIpLFxuICAgIH07XG4gIH0pO1xuXG4gIGxldCBJbnRlbnQgPSBDeWNsZS5jcmVhdGVJbnRlbnQoRE9NID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgY2hhbmdlV2lkdGgkOiBET00uZXZlbnQkKFwiLndpZHRoLXNsaWRlclwiLCBcImlucHV0XCIpLm1hcChldmVudCA9PiBwYXJzZUludChldmVudC50YXJnZXQudmFsdWUpKSxcbiAgICAgIGNoYW5nZUNvbG9yJDogRE9NLmV2ZW50JChcIi5jb2xvci1pbnB1dFwiLCBcImlucHV0XCIpLm1hcChldmVudCA9PiBldmVudC50YXJnZXQudmFsdWUpLFxuICAgICAgcmVtb3ZlJDogRE9NLmV2ZW50JChcIi5yZW1vdmVcIiwgXCJjbGlja1wiKS5tYXAoZXZlbnQgPT4gdHJ1ZSksXG4gICAgfTtcbiAgfSk7XG5cbiAgRE9NLmluamVjdChWaWV3KS5pbmplY3QoTW9kZWwpLmluamVjdChJbnRlbnQsIFByb3BzKVswXS5pbmplY3QoRE9NKTtcblxuICByZXR1cm4ge1xuICAgIGNoYW5nZVdpZHRoJDogSW50ZW50LmdldChcImNoYW5nZVdpZHRoJFwiKVxuICAgICAgLndpdGhMYXRlc3RGcm9tKE1vZGVsLmdldChcImlkJFwiKSwgKHdpZHRoLCBpZCkgPT4gKHtpZCwgd2lkdGh9KSksXG5cbiAgICBjaGFuZ2VDb2xvciQ6IEludGVudC5nZXQoXCJjaGFuZ2VDb2xvciRcIilcbiAgICAgIC53aXRoTGF0ZXN0RnJvbShNb2RlbC5nZXQoXCJpZCRcIiksIChjb2xvciwgaWQpID0+ICh7aWQsIGNvbG9yfSkpLFxuXG4gICAgcmVtb3ZlJDogSW50ZW50LmdldChcInJlbW92ZSRcIilcbiAgICAgIC53aXRoTGF0ZXN0RnJvbShNb2RlbC5nZXQoXCJpZCRcIiksIChfLCBpZCkgPT4gaWQpLFxuICB9O1xufSk7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgdXVpZCA9IHJlcXVpcmUoXCJub2RlLXV1aWRcIik7XG5sZXQgQ3ljbGUgPSByZXF1aXJlKFwiY3ljbGVqc1wiKTtcbmxldCB7Unh9ID0gQ3ljbGU7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBNb2RlbCA9IEN5Y2xlLmNyZWF0ZU1vZGVsKEludGVudCA9PiB7XG4gIGxldCBhZGQkID0gSW50ZW50LmdldChcImFkZCRcIikubWFwKCgpID0+IHtcbiAgICByZXR1cm4gZnVuY3Rpb24gdHJhbnNmb3JtKHN0YXRlKSB7XG4gICAgICBsZXQgbW9kZWwgPSBjcmVhdGVSYW5kb20oKTtcbiAgICAgIGxldCBzdGF0ZSA9IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlKTtcbiAgICAgIHN0YXRlW21vZGVsLmlkXSA9IG1vZGVsO1xuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH07XG4gIH0pO1xuXG4gIGxldCByZW1vdmUkID0gSW50ZW50LmdldChcInJlbW92ZSRcIikubWFwKGlkID0+IHtcbiAgICByZXR1cm4gZnVuY3Rpb24gdHJhbnNmb3JtKHN0YXRlKSB7XG4gICAgICBsZXQgc3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSk7XG4gICAgICBkZWxldGUgc3RhdGVbaWRdO1xuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH07XG4gIH0pO1xuXG4gIGxldCBjaGFuZ2VXaWR0aCQgPSBJbnRlbnQuZ2V0KFwiY2hhbmdlV2lkdGgkXCIpLm1hcChtb2RlbCA9PiB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIHRyYW5zZm9ybShzdGF0ZSkge1xuICAgICAgc3RhdGVbbW9kZWwuaWRdLndpZHRoID0gbW9kZWwud2lkdGg7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfTtcbiAgfSk7XG5cbiAgbGV0IGNoYW5nZUNvbG9yJCA9IEludGVudC5nZXQoXCJjaGFuZ2VDb2xvciRcIikubWFwKG1vZGVsID0+IHtcbiAgICByZXR1cm4gZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgIHN0YXRlW21vZGVsLmlkXS5jb2xvciA9IG1vZGVsLmNvbG9yO1xuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH07XG4gIH0pO1xuXG4gIGxldCB0cmFuc2Zvcm1zID0gUnguT2JzZXJ2YWJsZS5tZXJnZShcbiAgICBhZGQkLFxuICAgIHJlbW92ZSQsXG4gICAgY2hhbmdlQ29sb3IkLFxuICAgIGNoYW5nZVdpZHRoJFxuICApO1xuXG4gIHJldHVybiB7XG4gICAgc3RhdGUkOiB0cmFuc2Zvcm1zXG4gICAgICAuc3RhcnRXaXRoKHNlZWRTdGF0ZSgpKVxuICAgICAgLnNjYW4oZnVuY3Rpb24oc3RhdGUsIHRyYW5zZm9ybSkge1xuICAgICAgICByZXR1cm4gdHJhbnNmb3JtKHN0YXRlKTtcbiAgICAgIH0pXG4gIH07XG59KTtcblxuZnVuY3Rpb24gY3JlYXRlUmFuZG9tKHdpdGhEYXRhKSB7XG4gIHJldHVybiBPYmplY3QuYXNzaWduKHtcbiAgICBpZDogdXVpZC52NCgpLFxuICAgIHdpZHRoOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA4MDAgKyAyMDApLFxuICAgIGNvbG9yOiAnIycgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDE2KS5zdWJzdHIoLTYpLFxuICB9LCB3aXRoRGF0YSk7XG59XG5cbmZ1bmN0aW9uIHNlZWRTdGF0ZSgpIHtcbiAgbGV0IG1vZGVsID0gY3JlYXRlUmFuZG9tKCk7XG4gIGxldCBzdGF0ZSA9IHtcbiAgICBbbW9kZWwuaWRdOiBtb2RlbCxcbiAgfTtcbiAgcmV0dXJuIHN0YXRlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsOyIsInJlcXVpcmUoXCJvYmplY3QuYXNzaWduXCIpLnNoaW0oKTtcblxuY29uc29sZS5lcnJvciA9IGNvbnNvbGUubG9nOyIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBzb3J0QnkgPSByZXF1aXJlKFwibG9kYXNoLnNvcnRieVwiKTtcbmxldCB2YWx1ZXMgPSByZXF1aXJlKFwibG9kYXNoLnZhbHVlc1wiKTtcbmxldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZWpzXCIpO1xubGV0IHtSeCwgaH0gPSBDeWNsZTtcbmxldCBGb290ZXIgPSByZXF1aXJlKFwiLi9mb290ZXJcIik7XG5sZXQgSXRlbSA9IHJlcXVpcmUoXCIuL2l0ZW1cIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBWaWV3ID0gQ3ljbGUuY3JlYXRlVmlldyhNb2RlbCA9PiB7XG4gIGxldCBzdGF0ZSQgPSBNb2RlbC5nZXQoXCJzdGF0ZSRcIik7XG4gIHJldHVybiB7XG4gICAgdnRyZWUkOiBzdGF0ZSQubWFwKG1vZGVscyA9PiB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBoKCdkaXYnLCB7Y2xhc3NOYW1lOiBcImV2ZXJ5dGhpbmdcIn0sIFtcbiAgICAgICAgICBoKCdkaXYnLCB7Y2xhc3NOYW1lOiBcInRvcEJ1dHRvbnNcIn0sIFtcbiAgICAgICAgICAgIGgoJ2J1dHRvbicsIHtjbGFzc05hbWU6IFwiYWRkXCJ9LCBbXCJBZGQgUmFuZG9tXCJdKVxuICAgICAgICAgIF0pLFxuICAgICAgICAgIGgoJ2RpdicsIG51bGwsIFtcbiAgICAgICAgICAgIHNvcnRCeSh2YWx1ZXMobW9kZWxzKSwgbW9kZWwgPT4gbW9kZWwuaWQpLm1hcChtb2RlbCA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBoKFwiSXRlbS5pdGVtXCIsIHtpZDogbW9kZWwuaWQsIHdpZHRoOiBtb2RlbC53aWR0aCwgY29sb3I6IG1vZGVsLmNvbG9yLCBrZXk6IG1vZGVsLmlkfSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIF0pLFxuICAgICAgICAgIGgoXCJGb290ZXJcIilcbiAgICAgICAgXSlcbiAgICAgICk7XG4gICAgfSksXG4gIH07XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3OyJdfQ==
