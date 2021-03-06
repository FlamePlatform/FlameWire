var util = require('util');
var Route = require("route-pattern");
var debug = require("debug");
let log = require("debug")("flame:wire");
var join = require("url-join");
let logr = debug("flame:wire:route");
var url = require('url');
var merge = require('merge');


try {
  debugger;
  let Midlet = require("midlet")
} catch (e) {
  Midlet = require("parent-require")("midlet");
}

import {
  Container
}
from "./container";


/**
*
*
*
*
*
*
******/
export class MethodRouteAction {


  /**
  *
  * @param {string} pattern The pattern for the generated route.
  * @param {Function(req:ServerRequest,res:ServerResponse):Array} action The function the route performs if matched
  *
  *
  *
  *
  *
  *
  */
  constructor(pattern = "", action) {
    if (action instanceof MethodRouteAction) {
      log(`combining ${pattern} and ${action.getPattern()}`);
      action.pattern = join(pattern, action.getPattern());
      return action;
    }
    this.original_pattern = pattern;
    this.pattern = pattern;
    this.route = Route.fromString(pattern);
    if (action)
      this.user_action = action;
  }

  /**
  * Calls the action that was passed from the constructor
  *
  **************/
  action(req, res) {
    if (req)
      req.route = this;
    if (res)
      res.route = this;
    log(`performing user action for ${this.getPattern()}`);
    return this.user_action(req, res);
  }


  /**
  * Returns the Application Instance
  * @return {Application}
  ***********/
  getApplication() {
    return new Application();
  }



  /**
  * Checks if the url matches the route.
  *****/
  match(req, res) {
    log(`checking for a match ${req.path} with the pattern ${this.getPattern()}`)
    return this.getRoute().matches(req.path);
  }

  /**
  * Generates the route that can be used to test if there is a match in a url;
  *
  ********/
  getRoute() {
    return Route.fromString(this.getPattern());
  }


  /**
  * Gets the pattern for the route. This will include all of the parents url as well.
  ******/
  getPattern() {
    if (this.parent) {
      return require("url-join")(this.parent.getPattern(), this.pattern || "/");
    } else {
      return this.pattern || "/";
    }
  }


  /**
  *
  * Gemerates a Router parent. This can be used to add more to the main router
  *
  * @return {ParentRouteAction}
  *******/
  static Router() {
    return new ParentRouteAction("/");
  }

  /**
  *
  *@return {Function} used to unregister an added route
  *
  *****/
  async register(_class = null, url = "/", action) {
    let log = logr;
    var request = new _class(url, action);
    request.parent = this;
    this.children.push(request);
    var unregister = function(parent, request) {
      var remove = function() {
        log(`Removing ${request.getPattern()}`);
        let index = parent.children.indexOf(request);
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
    log(`registered: ${request.getPattern()}`);
    return unregister;
  }

}


/**
*
*
*@extends {MethodRouteAction}
*
*************/

export class ParentRouteAction extends MethodRouteAction {

  /**
  *
  *
  *
  *
  **/
  constructor(pattern = "") {
    super(pattern);
    this.pattern = pattern;
    this.children = [];
  }

  getRoute() {
    let url = join(this.getPattern(), "/*");
    log(`Testing parent url ${url}`);
    return Route.fromString(url);
  }

  match(req, res) {
    var good = false
    if (this.children.length === 0) {
      good = this.getRoute().matches(req.path);
    } else {
      for (var child of this.children) {
        if (child.match(req, res)) {
          good = true;
          break;
        }
      }
      if (!good) {
        log(`no match found for`);
      }
    }
    return good;
  }

  async register(_class, url, action) {
    return super.register(_class, url, action);
  }

  async action(req, res) {
    if (req)
      req.route = this;
    if (res)
      res.route = this;
    let match = false;
    let num = 0;
    for (let child of this.children) {
      if (child.match(req, res)) {
        log(`match: ${req.path}`);
        [req, res] = await child.action(req, res)
        if (!!!req || !!!res) {
          break;
          //TODO hooks
        }
      } else {
        log(`no match: ${child.getPattern()}`);
      }
    }
    if (!match) {
      res.writeHead(404);
      res.end();
    }
    return [req, res];
  }

  //Standard Methods
  async get(url, action) {
    return this.register(GetRouterAction, url, action)
  }

  async post(url, action) {
    return this.register(PostRouteAction, url, action);
  }

  async use(url, action) {
    await this.register(MethodRouteAction, url, action);
    return this;
  }
}


/**
* Allows only post navigation. This class is used when app.post is used
* @extends {MethodRouteAction}
*/
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
}







/**
*
*
*
* Allows for Get Request navigation. used by app.get method
*
*
* @extends {MethodRouteAction}
****/
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
}

const midlets = [];


/**
* This is the main application route. It is also the route that everything will be linked to.
* This is used to create the server
*/
export class Application extends ParentRouteAction {
  static instance;
  constructor() {
    super();
    if (!!!Application.instance) {
      Application.instance = this;
      this.container = new Container();
    } else {
      return Application.instance;
    }
  }

  static Router() {
    //Creates a router to begin mapping
    return new ParentRouteAction();
  }

  /**
  *Allows the developer to set a singleton. They can then retrieve this value with getItem method
  *
  */
  setInstance() {
    this.container.singleton.apply(this.container, arguments);
  }

  /**
  *
  *
  *@param {String} name The name of the item stored in the Application container.
  *
  *******/
  getItem(name) {
    return this.container.get(name);
  }



  action(req, res) {
    var urlr = url.parse(req.url);

    req.path = urlr.path;
    req.pathname = urlr.pathname;
    return super.action(req, res);
  }


  registerMidlet(name, dependencies, action, overrides) {

    if (name.name && name.action) {
      midlets[name.name] = name;
    } else {
      midlets[name] = new Midlet(name, dependencies, action, overrides);
    }
  }

  async pipe(names, req, res) {
    if (names === null) {
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

  /**
  * Boots the application on a certain port and allows for a callback once the application is running
  * @param {Number} port The port number to start the server on
  * @param {Fuction} callback The callback function to run onces the application has booted.
  **/
  listen(port = 3000, callback) {
    require("http").createServer(this.action.bind(this)).listen(port, callback);
  }
}
