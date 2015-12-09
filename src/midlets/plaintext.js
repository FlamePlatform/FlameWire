import {
  Midlet
}
from "./abstract";

var parse = require("raw-body");

export var plaintext = new Midlet("plaintext", null, function(req, res) {
  return new Promise(async function(resolve, reject) {
    try {
      parse(req, {
        length: req.headers['content-length'],
        limit: '1mb',
        encoding: "utf8"
      }, function(err, text) {
        if (err) {
          return reject(err);
        }
        req.plain = text;
        req.rawbody = text;
        resolve(text);
      })
    } catch (e) {
      reject(e);
    }
  })
});
