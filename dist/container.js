"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Container = undefined;

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var singleton = [];
var _class = [];
var middleware = [];

//Contain for files

var Container = exports.Container = (function () {
  function Container() {
    (0, _classCallCheck3.default)(this, Container);

    if (instance) {
      return instance;
    }
  }

  (0, _createClass3.default)(Container, [{
    key: "check",
    value: function check(name) {
      if (singleton[name]) {
        throw new Error("Name already added as Singleton");
      }
      if (_class[name]) {
        throw new Error("Name already added as Class");
      }
    }
  }, {
    key: "singleton",
    value: function singleton(name, _class) {
      this.check(name);
      this.singletonReplace(name, _class);
    }
  }, {
    key: "singletonReplace",
    value: function singletonReplace(name, _class) {
      if ((typeof _class === "undefined" ? "undefined" : (0, _typeof3.default)(_class)) === "object") {
        singleton[name] = _class;
      } else if (typeof _class === "function") {
        singleton[name] = _class;
      } else {
        throw new Error("singleton requires a class or class constructor");
      }
    }
  }, {
    key: "instance",
    value: function instance(name, __class) {
      this.check(name);
      if (typeof __class !== "function") {
        throw new Error("object expects a construct for an object");
      } else {
        _class[name] = __class;
      }
    }
  }, {
    key: "get",
    value: function get(name) {
      return this.getSingleton(name) || this.getClass(name);
    }
  }, {
    key: "getSingleton",
    value: function getSingleton(name) {
      var object = singleton[name];
      switch (typeof object === "undefined" ? "undefined" : (0, _typeof3.default)(object)) {
        case "object":
          return object;
        case "function":
          singleton[name] = new object();
          return singleton[name];
        default:
          return;
      }
    }
  }, {
    key: "getClass",
    value: function getClass(name) {
      var object = _class[name];
      switch (typeof object === "undefined" ? "undefined" : (0, _typeof3.default)(object)) {
        case "function":
          return new object();
        default:
          return null;
      }
    }
  }, {
    key: "remove",
    value: function remove(name) {
      var good = true;
      if (singleton[name]) {
        delete singleton[name];
      } else if (_class[name]) {
        delete _class[name];
      } else {
        good = false;
      }
      return good;
    }
  }]);
  return Container;
})();

var instance = new Container();