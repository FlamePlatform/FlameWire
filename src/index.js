var util = require('util');
var Route = require("route-pattern");
var log = require("debug")("info");

import {
  Container
}
from "./container";

export class MethodRouteAction {

  constructor(pattern = "", action) {
    if (action instanceof MethodRouteAction) {
      log(`combining ${pattern} and ${action.getPattern()}`);
      action.pattern = require("url-join")(pattern, action.getPattern());
      return action;
    }


    this.original_pattern = pattern;
    this.pattern = pattern;
    this.route = Route.fromString(pattern);
    if (action)
      this.user_action = action;

    this.children = [];
  }

  action(req,res){
    if(req)
    req.route=this;
    if(res)
    res.route=this;

    return this.user_action();
  }

  getApplication() {
    return new Application();
  }

  match(req, res) {
    log(`checking for a match ${req.path} with the pattern ${this.getPattern()}`)
    return this.getRoute().matches(req.path);
  }

  getRoute() {
    return Route.fromString(this.getPattern());
  }

  async get(url, action) {
    return this.register(GetRouterAction, url, action)
  }

  async post(url, action) {
    return this.register(PostRouteAction, url, action);
  }

  async use(url, action) {
    log(`url is ${url} this is a function action. Using the register to log it.`);
    await this.register(MethodRouteAction, url, action);
    return this;
  }

  getPattern() {
    if (this.parent) {
      return require("url-join")(this.parent.getPattern(), this.pattern || "/");
    } else {
      return this.pattern || "/";
    }
  }

  static Router() {
    return new ParentRouteAction("/");
  }

  async register(_class = null, url = "/", action) {
    log(`new registration of class ${_class.name} with url ${url} with an action`);
    var request = new _class(url, action);
    log(`class has been created`);
    request.parent = this;
    log(`set the parent of the child`);
    this.children.push(request);
    log(`added the route to the children array`);

    log(`creating the unregister function`);
    var unregister = function(parent, request) {
      var remove = function() {
        log(`parent has ${parent.children.length} children`);
        let index = parent.children.indexOf(request);

        log(`index of route is ${index}\nNow removing`);
        parent.children.splice(index, 1);
        if (parent.children.length === 0) {
          if (parent.delete) {
            parent.delete();
          }
        }
      }
      return remove;
    }(this, request);


    request.delete = unregister;
    log(`returning the unregister function`);
    return unregister;
  }

}

export class ParentRouteAction extends MethodRouteAction {
  constructor(pattern = "") {
    super(pattern);
    this.pattern = pattern;
    this.children = [];
  }

  getRoute() {
    return Route.fromString(this.getPattern() + "*");
  }

  match(req, res) {
    var good = false
    if (this.children.length === 0) {
      good = this.getRoute().matches(req.path);
    } else if (this.getRoute().matches(req.path)) {
      for (var child of this.children) {
        if (child.match(req, res)) {
          good = true;
          break;
        }
      }
    }
    return good;
  }

  async register(_class, url, action) {
    return super.register(_class, url, action);
  }

  async action(req, res) {
    if(req)
    req.route=this;
    if(res)
    res.route=this;
    for (let child of this.children) {
      if (child.match(req, res)) {
        [req, res] = await child.action(req, res)
        if (!!!req || !!!res) {
          break;
        } else {
          console.log("not breaking using null");
        }
      }
    }
    return [req, res];
  }
}



export class PostRouteAction extends MethodRouteAction {

  constructor(pattern, action) {
    super(pattern, action);
  }

  match(req, res) {
    if (req.method.toLowerCase() !== "post") {
      return false;
    }
    return super.match(req, res);
  }

  get() {
    throw new Error("Cannot create post request from get branch")
  }
}

export class GetRouterAction extends MethodRouteAction {
  constructor(pattern, action) {
    super(pattern, action);
  }

  match(req, res) {
    if (req.method.toLowerCase() !== "get") {
      return false;
    }
    return super.match(req, res);
  }

  post() {
    throw new Error("Cannot create get request from post branch")
  }
}



const midlets = [];
import {
  Midlet
}
from "./midlets/abstract";
export class Application extends ParentRouteAction {
  static instance;
  constructor() {
    super();
    if (!!!Application.instance) {
      Application.instance = this;
    } else {
      return Application.instance;
    }
  }

  action(req, res) {
    var url = require('url');
    var merge = require('merge');
    var urlr = url.parse(req.url);

    req.path = urlr.path;
    req.pathname = urlr.pathname;
    return super.action(req, res);
  }
  registerMidlet(name, dependencies, action) {

    if (name instanceof Midlet) {
      midlets[name.name] = name;
    } else {
      midlets[name] = new Midlet(name, dependencies, action);
    }
  }

  async pipe(names, req, res) {
    if(names===null){
      return;
    }
    log(`midlets to work on are '${names}'`);
    req.midlets = req.midlets || [];
    if (typeof names === "string") {
      names = names.split("|").map(s => s.trim());
    }
    log(`midlets to work on are '${names}'`);
    for (let name of names) {
      log(`working on midlet ${name}`);
      try {
        if (req.midlets.indexOf(name) > -1) {
          log(`midlet alrady used`);
          continue;
        }
        let m = midlets[name];
        await this.pipe(m.dependencies, req, res);
        await m.action(req, res);
        req.midlets.push(m.name);
      } catch (e) {
        log(`error while working on midlet ${name}`);
        log(e.message);
        log(e.stack);
        throw e;
      }
    }
  }

  listen(port = 3000) {
    require("http").createServer(this.action.bind(this)).listen(port);
  }
}
