// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);
var request = require('request');
var chai = require('chai');
var expect = chai.expect;
var should = chai.should();

it('Student Page', function(done) {
    request('http://localhost:3000/student' , function(error, response, body) {
        //expect(body).to.equal('Hello Students!!!');
        expect(response.statusCode).to.equal(200);
        done();
    });
});
