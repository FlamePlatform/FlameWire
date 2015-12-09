var should = require("chai").should();
var sinon = require('sinon');
var Route = require("path-parser");


describe("The Route Parse",function(){

  let route;
  before(function(){
    route = new Route("/will/it/parse");
  })


  it("should be able to parse urls that exceed it",function(){
    route.partialMatch("/will/it/parse/beyond").should.exist;
  })
});
