#!/usr/bin/env python2

# INFORMATION:
# This scripts compiles libelf to JavaScript

import os
import sys
import shutil

EXPORTED_FUNCTIONS = [
    '_elf_begin',
    '_elf_clone',
    '_elf_memory',
    '_elf_next',
    '_elf_end',
    '_elf_update',
    '_elf_kind',
    '_elf_getbase',
    '_elf_getident',
    '_elf32_getehdr',
    '_elf64_getehdr',
    '_elf32_newehdr',
    '_elf64_newehdr',
    '_elf_getphdrnum',
    '_elf32_getphdr',
    '_elf64_getphdr',
    '_elf32_newphdr',
    '_elf64_newphdr',
    '_elf_getscn',
    '_elf32_offscn',
    '_elf64_offscn',
    '_elf_ndxscn',
    '_elf_nextscn',
    '_elf_newscn',
    '_elf_scnshndx',
    '_elf_getshdrnum',
    '_elf_getshnum',
    '_elf_getshdrstrndx',
    '_elf_getshstrndx',
    '_elf32_getshdr',
    '_elf64_getshdr',
    '_elf_flagelf',
    '_elf_flagehdr',
    '_elf_flagphdr',
    '_elf_flagscn',
    '_elf_flagdata',
    '_elf_flagshdr',
    '_elf_getdata',
    '_elf_rawdata',
    '_elf_newdata',
    '_elf_getdata_rawchunk',
    '_elf_strptr',
    '_elf_getarhdr',
    '_elf_getaroff',
    '_elf_rand',
    '_elf_getarsym',
    '_elf_cntl',
    '_elf_rawfile',
    '_elf32_fsize',
    '_elf64_fsize',
    '_elf32_xlatetom',
    '_elf64_xlatetom',
    '_elf32_xlatetof',
    '_elf64_xlatetof',
    '_elf_errno',
    '_elf_errmsg',
    '_elf_version',
    '_elf_fill',
    '_elf_hash',
    '_elf_gnu_hash',
    '_elf32_checksum',
    '_elf64_checksum',
]

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
