// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);
var request = require('request');
var chai = require('chai');
var expect = chai.expect;
var should = chai.should();

it('Start Page', function(done) {
    request('http://localhost:3000/' , function(error, response, body) {
        //expect(body).to.equal('Hello World');
        console.log(response.isConnected);
        expect(response.statusCode).to.equal(200);
        done();
    });
});

// import { equal } from 'assert';
// describe('Array', function () {
//   describe('#indexOf()', function () {
//     it('should return -1 when the value is not present', function () {
//       equal([1, 2, 3].indexOf(4), -1);
//     });
//   });
// });