var should = require("chai").should();
var sinon = require('sinon');
var httpMocks = require('node-mocks-http');
var util = require('util');

import {
  ParentRouteAction, Application
}
from "../src";


describe("A Router", function() {
  let router;
  const req = httpMocks.createRequest({
    method: 'GET',
    url: '/hello/world',
    params: {
      id: 42
    }
  });
  const res = httpMocks.createResponse();


  before(function() {
    router = Application.Router();
  });

  it("should be able to add a simple route using use", function() {
    router.get("/man/of/steel", function(req, res) {})
    router.children[0].getPattern().should.equal("/man/of/steel");
    req.path.should.equal("/hello/world");
  })

  it("should be able to get a match using the children", function() {
    router.children[0].match({
      path: "/man/of/steel",
      method: "get"
    }, {}).should.equal(true);
  })

  it("should be able to get pattern from route", function() {
    router.use("/hello/world", function(req, res) {})
    router.children[1].getPattern().should.equal("/hello/world");
  })
})


describe("A Router", function() {

  let router;
  let req;
  let res;
  let spy;

  before(function() {
    router = new ParentRouteAction("/hello");

    req = httpMocks.createRequest({
      method: 'GET',
      url: '/hello/world',
      params: {
        id: 42
      }
    });
    res = httpMocks.createResponse();

    spy = sinon.spy();
  })



  it("should be able to create route", async(done) => {

    try {
      await router.get("/world", spy)
      done();
    } catch (e) {
      done(e);
    }
  })

  it("should now have a child", function() {
    router.children.length.should.equal(1);
  })

  it("should be able to get child pattern", function() {
    router.children[0].getPattern().should.equal("/hello/world");
  })

  it("should be able to get child match", function() {
    router.children[0].match({
      path: "/hello/world",
      method: "get"
    }).should.equal(true);
  })

  it("should be able to find a match", async function() {
    router.match({
      path: "/hello/world",
      method: "get"
    }).should.equal(true);

  })
});



describe("A Router", function() {

  let router;
  let req;
  let res;
  let spy;

  before(function() {
    router = new ParentRouteAction("/hello");

    req = httpMocks.createRequest({
      method: 'GET',
      path: '/goodbye/world',
      params: {
        id: 42
      }
    });
    res = httpMocks.createResponse();
    spy = sinon.spy();
  })

  it("should be able to create route", async(done) => {
    try {
      await router.get("/world", function(req, res) {
        console.log("hello world");
      })
      done();
    } catch (e) {
      done(e);
    }
  })

  it("should be able to find a match", async function(done) {
    try {
      router.match(req, res).should.equal(false);
      done();
    } catch (e) {
      done(e);
    }
  })
});


describe("A Router", function() {

  let router;
  let req;
  let res;
  let spy;

  before(function() {
    router = new ParentRouteAction("/");

    req = httpMocks.createRequest({
      method: 'GET',
      url: '/hello/world',
      params: {
        id: 42
      }
    });
    res = httpMocks.createResponse();
    spy = sinon.spy();
  })

  it("should be able to create route", async(done) => {
    try {
      await router.get("/hello/world", function(req, res) {
        console.log("hello world");
      })
      done();
    } catch (e) {
      done(e);
    }
  })

  it("should be able to find a match", async function(done) {
    try {
      router.match(req, res).should.equal(true);
      done();
    } catch (e) {
      done(e);
    }
  })
});


describe("A Router", function() {

  let router;
  let req;
  let res;
  let spy;
  let second;

  before(function() {
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/hello/world',
      params: {
        id: 42
      }
    });
    res = httpMocks.createResponse();
    router = Application.Router();
    second = Application.Router();

    spy = sinon.spy();

    second.get("/account", spy);
    router.use("/user", second);
  })

  it("should be able to make a complex route that has parent", function() {
    should.exist(second.parent);
  })


  it("should should have a parent when route is added", function() {
    second.parent.should.equal(router);
  })

  it("should be able to get patterns for both the parent and the child", function() {
    second.parent.should.equal(router);
    second.children[0].getPattern().should.equal("/user/account");
  })

  it("should be able to match this complicated structure", function() {
    router.match({
      path: "/user/account",
      method: "get"
    }).should.equal(true);
  })


  it("should be able to call spy once from the action",function(){
      router.action({path:"/user/account",method:"get"});
      spy.callCount.should.equal(1);
      spy.calledOnce.should.equal(true);
  })
});





describe("A Router", function() {

  let router;
  let req;
  let res;
  let spy;
  let second;

  before(function() {
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/hello/world',
      params: {
        id: 42
      }
    });
    res = httpMocks.createResponse();
    router = Application.Router();
    second = Application.Router();

    spy = sinon.spy();


    router.use("/user", second);
  })


  it("should be able to unregister routes",async function(){
    let unregister = await second.get("/account", spy);

    router.children.length.should.equal(1);

    (typeof unregister).should.equal("function");
    unregister();

    router.children.length.should.equal(0);
  })

});
