"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Midlet = undefined;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Midlet = exports.Midlet = function Midlet(name) {
  var dependencies = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
  var action = arguments[2];
  (0, _classCallCheck3.default)(this, Midlet);

  this.name = name;

  if (typeof dependencies === "string") {
    dependencies = dependencies.split("|").map(function (s) {
      return s.trim();
    });
  } else if (typeof dependencies === "function") {
    action = dependencies;
    dependencies = [];
  }
  this.dependencies = dependencies;
  this.action = action;
};