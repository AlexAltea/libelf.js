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
// var buffer = new Uint8Array([0x7F, 0x45, 0x4C, 0x46, ...]);
var elf = new Elf(buffer);
if (elf.kind() != "elf") {
    throw "Not an ELF file";
}

var ehdr = elf.getehdr();

// Handle segments
for (var i = 0; i &lt; ehdr.phnum; i++) {
    var phdr = elf.getphdr(i);
}
// Handle sections
for (var i = 0; i &lt; ehdr.shnum; i++) {
    var scn = elf.getscn(i);
    var shdr = elf.getshdr(scn);
    var name = elf.strptr(
        ehdr.e_shstrndx.num(),
        shdr.sh_name.num());
```

## Building
To build the Libelf.js library, clone the *master* branch of this repository, and do the following:

1. Install the latest [Python 3.8+](https://www.python.org/downloads/), [CMake](http://www.cmake.org/download/) and the [Emscripten SDK 2.0.21+](https://emscripten.org/docs/getting_started/downloads.html). Follow the respective instructions and make sure all environment variables are configured correctly. Under Windows [MinGW](http://www.mingw.org/) (specifically *mingw32-make*) is required.

2. Install the development dependencies with: `npm install --also=dev`.

3. Install grunt with: `npm install -g grunt`

4. Finally, build the source with: `grunt build`.
