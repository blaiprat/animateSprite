/*! animatesprite - v0.2.1 - 2015-05-13
* Copyright (c) 2015 Blai Pratdesaba; Licensed MIT */
(function () {

    'use strict';

    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

    // requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

    // MIT license

    (function() {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] ||
            window[vendors[x]+'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }

        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
        }
    }());


    var AnimateSprite = function (DOMObject, initialSettings) {

        var self = this,
            isPlaying = false;

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
            var imageSrc = getComputedStyle(DOMObject).backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, '$2');
            var image = new Image();

            image.onload = function () {
                var width = image.width,
                    height = image.height;

                cb(width, height);
            };

            image.src = imageSrc;
        };



        var setFrame = function(newFrame){
            newFrame = newFrame || animationStep;

            var row = Math.floor(newFrame / _settings.columns),
                column = animationStep % _settings.columns;

            var newStyle = (-_settings.width * column) + 'px ' + (-_settings.height * row) + 'px';
            DOMObject.style.backgroundPosition = newStyle;

            return animationStep;
        };

        var controlAnimation = function(){
            var checkLoop = function (finalFrame) {
                if (animationStep >= finalFrame - 1) {
                    if (_settings.loop === true) {
                        animationStep = 0;
                        controlTimer();
                    } else {
                        _settings.complete();
                        isPlaying = false;
                    }
                } else {
                    controlTimer();
                }
                return animationStep;
            };

            if (_settings.animations === undefined) {
                animationStep++;
                setFrame(animationStep);
                checkLoop.call(this, _settings.totalFrames);

            } else {
                if (currentAnimation === undefined) {
                    for (var k in _settings.animations) {
                        currentAnimation = _settings.animations[k];
                        break;
                    }
                }

                animationFrame = currentAnimation[animationStep];
                setFrame(animationFrame);
                animationStep++;
                checkLoop.call(this, currentAnimation.length);


            }
        };

        var controlTimer = function () {
            // duration overrides fps
            var speed = 1000 / (_settings.fps + 1);
            if (speed < 17) {
                window.requestAnimationFrame(controlAnimation);
            } else {
                _interval = setTimeout(controlAnimation, speed);
            }
        };




        var stop = function () {
            clearTimeout(_interval);
            isPlaying = false;
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

            if (isPlaying) { return; }
            // TODO: Check if is playing
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
            isPlaying = true;
        };


        var init = function(){

            // Unwrap jQuery object
            if (DOMObject.jquery) {
                DOMObject = DOMObject[0];
            }

            discoverColumns(function (width, height) {
                // getting amount of columns
                _settings.columns = Math.round(width / _settings.width);
                // if totalframes are not specified
                if (_settings.totalFrames === undefined) {
                    // total frames is columns times rows
                    var rows = Math.round(height / _settings.height);
                    _settings.totalFrames = _settings.columns * rows;
                }
                if (_settings.autoplay) {
                    controlTimer();
                    isPlaying = true;
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


    /* global define:true module:true window: true */
    if (typeof define === 'function' && define['amd']) {
        define(function() { return AnimateSprite; });
    } else if (typeof module !== 'undefined' && module['exports']) {
        module['exports'] = AnimateSprite;
    } else if (typeof this !== 'undefined') {
        this['AnimateSprite'] = AnimateSprite;
    }


}(this));
