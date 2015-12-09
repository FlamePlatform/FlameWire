var should = require("chai").should();
import {
  Container
}
from "../src/container";


describe("A Container", function() {

  let container;

  before(function() {
    container = new Container();
  })


  it("should only create one instance", function() {
    (container === new Container()).should.equal(true);
  })


  it("should be able to add a singleton and class", function() {
    function Time() {
      this.t = Math.random();
    }
    container.instance("time2", Time);
    container.singleton("time", Time);
    var t = container.get("time");
    t.t.should.equal(container.get("time").t);
    t= container.get("time2");
    t.t.should.not.equal(container.get("time2").t);

  })
})
