# animateSprite

> Sprite animations made simple


## Getting started

### Node.js

```
$ npm install --save animatesprite
```

```js
var animateSprite = require('animatesprite');
animateSprite.awesome(); // "awesome"
```

### Browser

Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/blaiprat/animatesprite/master/dist/animatesprite.min.js
[max]: https://raw.github.com/blaiprat/animatesprite/master/dist/animatesprite.js

In your web page:

```html
<script src="dist/animatesprite.min.js"></script>
<script>
  awesome(); // "awesome"
</script>
```

In your code, you can attach animatesprite's methods to any object.

```html
<script>
var exports = Yeoman.utils;
</script>
<script src="dist/animatesprite.min.js"></script>
<script>
  Yeoman.utils.awesome(); // "awesome"
</script>
```


## License

MIT © Blai Pratdesaba
