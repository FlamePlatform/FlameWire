"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Application = exports.GetRouterAction = exports.PostRouteAction = exports.ParentRouteAction = exports.MethodRouteAction = undefined;

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require("babel-runtime/helpers/get");

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _container = require("./container");

var _abstract = require("./midlets/abstract");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var util = require('util');
var Route = require("route-pattern");
var log = require("debug")("flame:wire");
var join = require("url-join");

var MethodRouteAction = exports.MethodRouteAction = (function () {
  function MethodRouteAction() {
    var pattern = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];
    var action = arguments[1];
    (0, _classCallCheck3.default)(this, MethodRouteAction);

    if (action instanceof MethodRouteAction) {
      log("combining " + pattern + " and " + action.getPattern());
      action.pattern = join(pattern, action.getPattern());
      return action;
    }

    this.original_pattern = pattern;
    this.pattern = pattern;
    this.route = Route.fromString(pattern);
    if (action) this.user_action = action;
    this.children = [];
  }

  (0, _createClass3.default)(MethodRouteAction, [{
    key: "action",
    value: function action(req, res) {
      if (req) req.route = this;
      if (res) res.route = this;
      log("performing user action for " + this.getPattern());
      return this.user_action(req, res);
    }
  }, {
    key: "getApplication",
    value: function getApplication() {
      return new Application();
    }
  }, {
    key: "match",
    value: function match(req, res) {
      log("checking for a match " + req.path + " with the pattern " + this.getPattern());
      return this.getRoute().matches(req.path);
    }
  }, {
    key: "getRoute",
    value: function getRoute() {
      return Route.fromString(this.getPattern());
    }
  }, {
    key: "get",
    value: (function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(url, action) {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", this.register(GetRouterAction, url, action));

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));
      return function get(_x2, _x3) {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: "post",
    value: (function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(url, action) {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", this.register(PostRouteAction, url, action));

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));
      return function post(_x4, _x5) {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: "use",
    value: (function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(url, action) {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                log("url is " + url + " this is a function action. Using the register to log it.");
                _context3.next = 3;
                return this.register(MethodRouteAction, url, action);

              case 3:
                return _context3.abrupt("return", this);

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));
      return function use(_x6, _x7) {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: "getPattern",
    value: function getPattern() {
      if (this.parent) {
        return require("url-join")(this.parent.getPattern(), this.pattern || "/");
      } else {
        return this.pattern || "/";
      }
    }
  }, {
    key: "register",
    value: (function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
        var _class = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

        var url = arguments.length <= 1 || arguments[1] === undefined ? "/" : arguments[1];
        var action = arguments[2];
        var request, unregister;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                log("new registration of class " + _class.name + " with url " + url + " with an action");
                request = new _class(url, action);

                log("class has been created");
                request.parent = this;
                log("set the parent of the child");
                this.children.push(request);
                log("added the route to the children array");

                log("creating the unregister function");

                unregister = (function (parent, request) {
                  var remove = function remove() {
                    log("parent has " + parent.children.length + " children");
                    var index = parent.children.indexOf(request);

                    log("index of route is " + index + "\nNow removing");
                    parent.children.splice(index, 1);
                    if (parent.children.length === 0) {
                      if (parent.delete) {
                        parent.delete();
                      }
                    }
                  };
                  return remove;
                })(this, request);

                request.delete = unregister;
                log("returning the unregister function");
                return _context4.abrupt("return", unregister);

              case 12:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));
      return function register(_x8, _x9, _x10) {
        return ref.apply(this, arguments);
      };
    })()
  }], [{
    key: "Router",
    value: function Router() {
      return new ParentRouteAction("/");
    }
  }]);
  return MethodRouteAction;
})();

var ParentRouteAction = exports.ParentRouteAction = (function (_MethodRouteAction) {
  (0, _inherits3.default)(ParentRouteAction, _MethodRouteAction);

  function ParentRouteAction() {
    var pattern = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];
    (0, _classCallCheck3.default)(this, ParentRouteAction);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ParentRouteAction).call(this, pattern));

    _this.pattern = pattern;
    _this.children = [];
    return _this;
  }

  (0, _createClass3.default)(ParentRouteAction, [{
    key: "getRoute",
    value: function getRoute() {
      var url = join(this.getPattern(), "/*");
      log("Testing parent url " + url);
      return Route.fromString(url);
    }
  }, {
    key: "match",
    value: function match(req, res) {
      var good = false;
      if (this.children.length === 0) {
        good = this.getRoute().matches(req.path);
      } else {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = (0, _getIterator3.default)(this.children), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var child = _step.value;

            if (child.match(req, res)) {
              good = true;
              break;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        if (!good) {
          log("no match found for");
        }
      }
      return good;
    }
  }, {
    key: "register",
    value: (function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(_class, url, action) {
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.abrupt("return", (0, _get3.default)((0, _getPrototypeOf2.default)(ParentRouteAction.prototype), "register", this).call(this, _class, url, action));

              case 1:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));
      return function register(_x14, _x15, _x16) {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: "action",
    value: (function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(req, res) {
        var match, num, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, child, _ref, _ref2, util;

        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (req) req.route = this;
                if (res) res.route = this;
                match = false;
                num = 0;
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context6.prev = 7;
                _iterator2 = (0, _getIterator3.default)(this.children);

              case 9:
                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                  _context6.next = 30;
                  break;
                }

                child = _step2.value;

                if (!child.match(req, res)) {
                  _context6.next = 26;
                  break;
                }

                log("found a match for " + req.path);
                _context6.next = 15;
                return child.action(req, res);

              case 15:
                _ref = _context6.sent;
                _ref2 = (0, _slicedToArray3.default)(_ref, 2);
                req = _ref2[0];
                res = _ref2[1];

                if (!(!!!req || !!!res)) {
                  _context6.next = 23;
                  break;
                }

                return _context6.abrupt("break", 30);

              case 23:
                log("req is " + !!req + " and res is " + !!res + " therefore not breaking");

              case 24:
                _context6.next = 27;
                break;

              case 26:
                log("no match for child " + child.getPattern());

              case 27:
                _iteratorNormalCompletion2 = true;
                _context6.next = 9;
                break;

              case 30:
                _context6.next = 36;
                break;

              case 32:
                _context6.prev = 32;
                _context6.t0 = _context6["catch"](7);
                _didIteratorError2 = true;
                _iteratorError2 = _context6.t0;

              case 36:
                _context6.prev = 36;
                _context6.prev = 37;

                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }

              case 39:
                _context6.prev = 39;

                if (!_didIteratorError2) {
                  _context6.next = 42;
                  break;
                }

                throw _iteratorError2;

              case 42:
                return _context6.finish(39);

              case 43:
                return _context6.finish(36);

              case 44:
                util = require("util");

                if (!match) {
                  res.writeHead(404);
                  res.end();
                }
                return _context6.abrupt("return", [req, res]);

              case 47:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[7, 32, 36, 44], [37,, 39, 43]]);
      }));
      return function action(_x17, _x18) {
        return ref.apply(this, arguments);
      };
    })()
  }]);
  return ParentRouteAction;
})(MethodRouteAction);

var PostRouteAction = exports.PostRouteAction = (function (_MethodRouteAction2) {
  (0, _inherits3.default)(PostRouteAction, _MethodRouteAction2);

  function PostRouteAction(pattern, action) {
    (0, _classCallCheck3.default)(this, PostRouteAction);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(PostRouteAction).call(this, pattern, action));
  }

  (0, _createClass3.default)(PostRouteAction, [{
    key: "match",
    value: function match(req, res) {
      if (req.method.toLowerCase() !== "post") {
        return false;
      }
      return (0, _get3.default)((0, _getPrototypeOf2.default)(PostRouteAction.prototype), "match", this).call(this, req, res);
    }
  }, {
    key: "get",
    value: function get() {
      throw new Error("Cannot create post request from get branch");
    }
  }]);
  return PostRouteAction;
})(MethodRouteAction);

var GetRouterAction = exports.GetRouterAction = (function (_MethodRouteAction3) {
  (0, _inherits3.default)(GetRouterAction, _MethodRouteAction3);

  function GetRouterAction(pattern, action) {
    (0, _classCallCheck3.default)(this, GetRouterAction);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(GetRouterAction).call(this, pattern, action));
  }

  (0, _createClass3.default)(GetRouterAction, [{
    key: "match",
    value: function match(req, res) {
      if (req.method.toLowerCase() !== "get") {
        return false;
      }
      return (0, _get3.default)((0, _getPrototypeOf2.default)(GetRouterAction.prototype), "match", this).call(this, req, res);
    }
  }, {
    key: "post",
    value: function post() {
      throw new Error("Cannot create get request from post branch");
    }
  }]);
  return GetRouterAction;
})(MethodRouteAction);

var midlets = [];

var Application = exports.Application = (function (_ParentRouteAction) {
  (0, _inherits3.default)(Application, _ParentRouteAction);

  function Application() {
    (0, _classCallCheck3.default)(this, Application);

    var _this4 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Application).call(this));

    if (!!!Application.instance) {
      Application.instance = _this4;
    } else {
      var _ret;

      return _ret = Application.instance, (0, _possibleConstructorReturn3.default)(_this4, _ret);
    }
    return _this4;
  }

  (0, _createClass3.default)(Application, [{
    key: "action",
    value: function action(req, res) {
      var url = require('url');
      var merge = require('merge');
      var urlr = url.parse(req.url);

      req.path = urlr.path;
      req.pathname = urlr.pathname;
      return (0, _get3.default)((0, _getPrototypeOf2.default)(Application.prototype), "action", this).call(this, req, res);
    }
  }, {
    key: "registerMidlet",
    value: function registerMidlet(name, dependencies, action, overrides) {

      if (name.name && name.action) {
        midlets[name.name] = name;
      } else {
        midlets[name] = new _abstract.Midlet(name, dependencies, action);
      }
    }
  }, {
    key: "pipe",
    value: (function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(names, req, res) {
        var _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, name, m;

        return _regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (!(names === null)) {
                  _context7.next = 2;
                  break;
                }

                return _context7.abrupt("return");

              case 2:
                log("midlets to work on are '" + names + "'");
                req.midlets = req.midlets || [];
                if (typeof names === "string") {
                  names = names.split("|").map(function (s) {
                    return s.trim();
                  });
                }
                log("midlets to work on are '" + names + "'");
                _iteratorNormalCompletion3 = true;
                _didIteratorError3 = false;
                _iteratorError3 = undefined;
                _context7.prev = 9;
                _iterator3 = (0, _getIterator3.default)(names);

              case 11:
                if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                  _context7.next = 35;
                  break;
                }

                name = _step3.value;

                log("working on midlet " + name);
                _context7.prev = 14;

                if (!(req.midlets.indexOf(name) > -1)) {
                  _context7.next = 18;
                  break;
                }

                log("midlet alrady used");
                return _context7.abrupt("continue", 32);

              case 18:
                m = midlets[name];
                _context7.next = 21;
                return this.pipe(m.dependencies, req, res);

              case 21:
                _context7.next = 23;
                return m.action(req, res);

              case 23:
                req.midlets.push(m.name);
                _context7.next = 32;
                break;

              case 26:
                _context7.prev = 26;
                _context7.t0 = _context7["catch"](14);

                log("error while working on midlet " + name);
                log(_context7.t0.message);
                log(_context7.t0.stack);
                throw _context7.t0;

              case 32:
                _iteratorNormalCompletion3 = true;
                _context7.next = 11;
                break;

              case 35:
                _context7.next = 41;
                break;

              case 37:
                _context7.prev = 37;
                _context7.t1 = _context7["catch"](9);
                _didIteratorError3 = true;
                _iteratorError3 = _context7.t1;

              case 41:
                _context7.prev = 41;
                _context7.prev = 42;

                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }

              case 44:
                _context7.prev = 44;

                if (!_didIteratorError3) {
                  _context7.next = 47;
                  break;
                }

                throw _iteratorError3;

              case 47:
                return _context7.finish(44);

              case 48:
                return _context7.finish(41);

              case 49:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this, [[9, 37, 41, 49], [14, 26], [42,, 44, 48]]);
      }));
      return function pipe(_x19, _x20, _x21) {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: "listen",
    value: function listen() {
      var port = arguments.length <= 0 || arguments[0] === undefined ? 3000 : arguments[0];

      require("http").createServer(this.action.bind(this)).listen(port);
    }
  }], [{
    key: "Router",
    value: function Router() {
      return new ParentRouteAction();
    }
  }]);
  return Application;
})(ParentRouteAction);