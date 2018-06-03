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
    os.system('export libelf_cv_int32=int')
    os.system('export libelf_cv_int16=short')
    os.system('emconfigure ./configure')

    # MinGW (Windows) or Make (Linux/Unix)
    if os.name == 'nt':
        os.system('mingw32-make')
    if os.name == 'posix':
        os.system('make')
    os.chdir('..')

    # Get exported functions
    with open(os.path.join(LIBELF_DIR, "lib/libelf.def"), 'r') as f:
        key = 'EXPORTS'
        contents = f.read()
        exports = contents[contents.index(key) + len(key):]
        exports = exports.strip().split('\n\t')
        exports = map(lambda x: '_' + x, exports)

    # Compile static library to JavaScript
    cmd = os.path.expandvars('$EMSCRIPTEN/emcc')
    cmd += ' -Os --memory-init-file 0'
    cmd += ' libelf/lib/libelf.a'
    cmd += ' -s EXPORTED_FUNCTIONS=\"[\''+ '\', \''.join(EXPORTED_FUNCTIONS) +'\']\"'
    cmd += ' -s MODULARIZE=1'
    cmd += ' -s EXPORT_NAME="\'Mlibelf\'"'
    cmd += ' -o src/libelf.out.js'
    os.system(cmd)


if __name__ == "__main__":
    if os.name in ['nt', 'posix']:
        compileLibelf()
    else:
        print "Your operating system is not supported by this script:"
        print "Please, use Emscripten to compile libelf manually to src/libelf.out.js"
