import {
  Midlet
}
from "./abstract";

var merge = require("merge");

export var json = new Midlet("json", ["plaintext"], function(req, res) {
  return new Promise(async function(resolve, reject) {
    try {
      if(req.headers['content-type']==="application/json"){
          var body = JSON.parse(req.rawbody);
          req.body=req.body ||{};
          for(var key in body){
            req.body[key]= body[key];
          }
          resolve(req.body);
      }
    } catch (e) {
      reject(e);
    }
  })
});
