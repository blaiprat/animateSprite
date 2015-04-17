'use strict';
var animateSprite = require('../src/animatesprite.js');

exports['awesome'] = {
  setUp: function (done) {
    done();
  },
  'no args': function(test) {
    test.expect(1);
    test.equal(animateSprite.awesome(), 'awesome', 'should be awesome');
    test.done();
  }
};
