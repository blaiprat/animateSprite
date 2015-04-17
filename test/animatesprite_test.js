'use strict';
var AnimateSprite = require('../src/animatesprite.js');

exports['AnimateSprite'] = {
    setUp: function (done) {
        done();
    },
    'no args': function(test) {
        var animation = new AnimateSprite('a', {fps: 6});
        test.expect(1);
        test.equal(animation, typeof object, 'should be awesome');
        test.done();
    }
};
