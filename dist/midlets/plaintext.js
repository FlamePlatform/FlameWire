"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plaintext = undefined;

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _abstract = require("./abstract");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parse = require("raw-body");

var plaintext = exports.plaintext = new _abstract.Midlet("plaintext", null, function (req, res) {
  return new _promise2.default((function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              try {
                parse(req, {
                  length: req.headers['content-length'],
                  limit: '1mb',
                  encoding: "utf8"
                }, function (err, text) {
                  if (err) {
                    return reject(err);
                  }
                  req.plain = text;
                  req.rawbody = text;
                  resolve(text);
                });
              } catch (e) {
                reject(e);
              }

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));
    return function (_x, _x2) {
      return ref.apply(this, arguments);
    };
  })());
});