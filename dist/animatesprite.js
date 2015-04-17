/*! animatesprite - v0.0.0 - 2015-04-18
* Copyright (c) 2015 Blai Pratdesaba; Licensed MIT */
(function (exports) {
    'use strict';

    exports.AnimateSprite = function (DOMObject, initialSettings) {
        var self = this;
        var _settings = {
            width:          DOMObject.offsetWidth,
            height:         DOMObject.offsetHeight,
            fps:            12,
            complete:       function () {},
            loop:           false,
            autoplay:       true,
            animations:     undefined
        };

        var settings = function(newSettings){

            newSettings = newSettings || {};

            _settings.width =          newSettings.width || _settings.width;
            _settings.height =         newSettings.height || _settings.height;
            _settings.totalFrames =    newSettings.totalFrames || _settings.totalFrames;
            _settings.fps =            newSettings.fps || _settings.fps;
            _settings.complete =       newSettings.complete || _settings.complete;
            _settings.loop =           newSettings.loop || _settings.loop;
            _settings.autoplay =       newSettings.autoplay || _settings.autoplay;
            _settings.animations =     newSettings.animations || _settings.animations;

            return _settings;
        };

        var animationStep = 0,
            animationFrame,
            currentAnimation,
            _interval;

        var domRemovedListener = function(){

            document.body.addEventListener('DOMNodeRemoved', function(event){
                if (event.target === DOMObject){
                    stop();
                }
            });

        };


        var discoverColumns = function (cb) {
            var imageSrc = getComputedStyle(DOMObject)['backgroundImage'].replace(/url\((['"])?(.*?)\1\)/gi, '$2');
            var image = new Image();

            image.onload = function () {
                var width = image.width,
                    height = image.height;

                cb(width, height);
            };

            image.src = imageSrc;
        };


        var controlTimer = function () {
            // duration overrides fps
            var speed = 1000 / _settings.fps;
            _interval = setTimeout(function () {
                controlAnimation();
            }, speed);

        };


        var controlAnimation = function(){

            var checkLoop = function (animationStep, finalFrame) {
                animationStep++;
                if (animationStep >= finalFrame) {
                    if (_settings.loop === true) {
                        animationStep = 0;
                        controlTimer();
                    } else {
                        _settings.complete();
                    }
                } else {
                    controlTimer();
                }
                return animationStep;
            };

            if (_settings.animations === undefined) {
                // $this.animateSprite('frame', this.animationStep);
                animationStep = checkLoop.call(this, animationStep, _settings.totalFrames);

            } else {
                if (currentAnimation === undefined) {
                    for (var k in _settings.animations) {
                        currentAnimation = _settings.animations[k];
                        break;
                    }
                }

                animationFrame = currentAnimation[animationStep];
                setFrame(animationFrame);
                animationStep = checkLoop.call(this, animationStep, currentAnimation.length);

            }
        };

        var setFrame = function(newFrame){
            newFrame = newFrame || animationStep;

            var row = Math.floor(newFrame / _settings.columns),
                column = animationStep % _settings.columns;

            var newStyle = (-_settings.width * column) + 'px ' + (-_settings.height * row) + 'px';
            DOMObject.style.backgroundPosition = newStyle;

            return animationStep;
        };


        var stop = function () {
            clearTimeout(_interval);
        };

        var resume = function () {
            stop();
            controlTimer();
        };

        var restart = function () {
            animationStep = 0;
            controlTimer();
        };

        var play = function (animationName) {
            if (animationName) {
                stop();
                if (_settings.animations[animationName] !== currentAnimation) {
                    animationStep = 0;
                    currentAnimation = _settings.animations[animationName];
                }
                controlTimer();
            } else {
                controlTimer();
            }

        };



        var init = function(){

            discoverColumns(function (width, height) {
                // getting amount of columns
                _settings.columns = Math.round(width / _settings.width);
                // if totalframes are not specified
                if (!_settings.totalFrames) {
                    // total frames is columns times rows
                    var rows = Math.round(height / _settings.height);
                    _settings.totalFrames = _settings.columns * rows;
                }
                if (_settings.autoplay) {
                    controlTimer();
                }
            });
        };

        var frame = function(newFrame){
            if (newFrame){
                stop();
                setFrame(newFrame);
            }
            return animationFrame;
        };


        domRemovedListener();
        settings(initialSettings);
        init();



        return {
            stop: stop,
            resume: resume,
            restart: restart,
            settings: settings,
            play: play,
            frame: frame
        };
    };

    exports.test = function(){
        return 'd';
    };

}(typeof exports === 'object' && exports || this));
