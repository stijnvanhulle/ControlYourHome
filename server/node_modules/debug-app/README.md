# debug-app

[debug](http://npm.im/debug) with a default namespace consisting of the &lt;application name&gt;:&lt;current filename&gt;.

## Example

Instead of doing:

```js
var debug = require('debug')('myApp:file');
```

..use `debug-app` instead:

```js
var debug = require('debug-app')();
```

The result is identical, but you won't have to type the app name and the filename over and over again.
This is also future-proof in case your app name / filename change.

## License

[MIT](http://alessioalex.mit-license.org/)
