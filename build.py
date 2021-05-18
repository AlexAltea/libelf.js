#!/usr/bin/env python2

# INFORMATION:
# This scripts compiles libelf to JavaScript

import os
import sys
import shutil

# Directories
LIBELF_DIR = os.path.abspath("libelf")

# Prepend strings at the beginning of the file
def prepend(path, code):
    pathBak = path + ".bak"
    if os.path.exists(pathBak):
        return
    shutil.move(path, pathBak)
    fin = open(pathBak, 'r')
    fout = open(path, 'w')
    fout.write(code)
    fout.write(fin.read())
    fout.close()
    fin.close()

def compileLibelf():
    # Patching
    prepend(os.path.join(LIBELF_DIR, "lib/version.c"),
        "#include <stdlib.h>\n")

    # Configuring libelf
    os.chdir(LIBELF_DIR)
    os.system('export "libelf_cv_int64=long long" && ' +
              'export "libelf_cv_int32=int" && ' +
              'export "libelf_cv_int16=short" && ' +
              'emconfigure ./configure --enable-elf64')

    # MinGW (Windows) or Make (Linux/Unix)
    if os.name == 'nt':
        os.system('mingw32-make')
    if os.name == 'posix':
        os.system('emmake make')
    os.chdir('..')

    # Get exported functions
    with open(os.path.join(LIBELF_DIR, "lib/libelf.def"), 'r') as f:
        key = 'EXPORTS'
        contents = f.read()
        exports = contents[contents.index(key) + len(key):]
        exports = exports.replace('\r\n','\n')
        exports = exports.strip().split('\n\t')
        exports = map(lambda x: '_' + x, exports)
    exports = list(exports)
    exports.append("_free")

    # Get exported runtime methods
    methods = ['_free', '_malloc', 'ccall', 'writeArrayToMemory', 'getValue', 'Pointer_stringify']

    # Compile static library to JavaScript
    cmd = os.path.expandvars('emcc')
    cmd += ' -Os --memory-init-file 0'
    cmd += ' libelf/lib/libelf.a'
    cmd += ' -s EXPORT_NAME="\'MLibelf\'"'
    cmd += ' -s EXPORTED_FUNCTIONS=\"[\''+ '\', \''.join(exports) +'\']\"'
    cmd += ' -s EXPORTED_RUNTIME_METHODS=\"[\''+ '\', \''.join(methods) +'\']\"'
    cmd += ' -s RESERVED_FUNCTION_POINTERS=256'
    cmd += ' -s ALLOW_MEMORY_GROWTH=1'
    cmd += ' -s MODULARIZE=1'
    cmd += ' -s WASM_ASYNC_COMPILATION=0'
    cmd += ' -s ENVIRONMENT="web"'
    cmd += ' -s WASM=0'
    cmd += ' -o src/libelf.out.js'
    os.system(cmd)


if __name__ == "__main__":
    if os.name in ['nt', 'posix']:
        compileLibelf()
    else:
        print("Your operating system is not supported by this script:")
        print("Please, use Emscripten to compile libelf manually to src/libelf.out.js")
