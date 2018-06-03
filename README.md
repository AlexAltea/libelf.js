Libelf.js
=========

Libelf port for JavaScript, a library to access ELF objects.

## Installation
To add Libelf.js to your web application, include it with:
```html
<script src="libelf.min.js"></script>
```
or install it with the Bower command:
```bash
bower install libelf
```

## Usage                                                      
```javascript
...
```

## Building
To build the Libelf.js library, clone the *master* branch of this repository, and do the following:

1. Install the latest [Python 2.x (64-bit)](https://www.python.org/downloads/), [CMake](http://www.cmake.org/download/) and the [Emscripten SDK](http://kripken.github.io/emscripten-site/docs/getting_started/downloads.html). Follow the respective instructions and make sure all environment variables are configured correctly. Under Windows [MinGW](http://www.mingw.org/) (specifically *mingw32-make*) is required.

2. Install the development dependencies with: `npm install`.

3. Finally, build the source with: `grunt build`.
