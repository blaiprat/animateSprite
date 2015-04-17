# animateSprite

> Sprite animations made simple

This is a work in progress, not ready for production. Please check the TODO list before doing anything serious with it.

## Getting started

### With Browserify

```
$ npm install --save animatesprite
```

```js
var AnimateSprite = require('animatesprite');
var animation = new AnimateSprite(document.getElementById('domWithSprite'));
```

### Browser

Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/blaiprat/animatesprite/master/dist/animatesprite.min.js
[max]: https://raw.github.com/blaiprat/animatesprite/master/dist/animatesprite.js

In your web page:

```html
<script src="dist/animatesprite.min.js"></script>
<script>
var animation = new AnimateSprite(document.getElementById('domWithSprite'), {
    fps: 12,
    animations: {
        walkRight: [0, 1, 2, 3, 4, 5, 6, 7],
        walkLeft: [15, 14, 13, 12, 11, 10, 9, 8]
    },
    loop: true,
    complete: function(){
        // use complete only when you set animations with 'loop: false'
        alert("animation End");
    }
});
</script>
```

##### Settings
```javascript
    fps:            int     // define animation speed
    complete:       function // called after the animation has finished (not called if loop is set to true)
    loop:           bool    // if the animation has to loop
    autoplay:       bool    // if the animation starts immediately
    animations:     object  // Contains multiple animations.
                            // The key should be the name of the animation,
                            // and the value should be an array with the frames.
```

##### Methods
```javascript
    animation.play('animatinName')      // plays the specified animation
    animation.stop()                    // stops the animation
    animation.resume()                  // continues the animation from the point where it was stopped
    animation.restart()                 // starts the animation from the beginning
    animation.frame()                   // returns animation current frame
    animation.frame(n)                  // sets the frame to 'n'
    animation.settings()                // returns animation settings
    animation.settings({fps: 2})        // changes the desired configuration key
```


### TODO
This javascript module is not ready for a release yet:

- frame method sets what I call animation key (position from the current animation), but returns animation frame (frame defined by the user).
- Some cleanup needs to be done, and give some consistency to know private variables from public ones.
- It should plug in nicely with jQuery so it can replace jQuery.animateSprite.

## License

MIT © Blai Pratdesaba
