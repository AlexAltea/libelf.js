/**
 * (c) 2018 Libelf.JS
 * Wrapper made by Alexandro Sanchez Bach.
 */

// Emscripten demodularize
var MLibelf = new MLibelf();

var Elf = function (buffer) {
    // Constructor
    var ret = MLibelf.ccall('elf_version', 'number', ['number'], [EV_CURRENT]);
    if (ret == EV_NONE) {
        var error = 'Failed to initialize libelf';
        throw error;
    }
    if (buffer instanceof ArrayBuffer) {
        buffer = new Uint8Array(buffer, 0, buffer.byteLength);
    }
    buffer = Array.from(buffer);
    this.elf_size = buffer.length;
    this.elf_addr = MLibelf._malloc(this.elf_size);
    MLibelf.writeArrayToMemory(buffer, this.elf_addr);
    this.elf_ref = MLibelf.ccall('elf_memory', 'pointer',
        ['pointer', 'number'], [this.elf_addr, this.elf_size]);

    // Helpers
    this.__read_i8  = function (addr) { return MLibelf.getValue(addr, 'i8' ); }
    this.__read_i16 = function (addr) { return MLibelf.getValue(addr, 'i16'); }
    this.__read_i32 = function (addr) { return MLibelf.getValue(addr, 'i32'); }
    this.__read_i64 = function (addr) { return MLibelf.getValue(addr, 'i64'); }

    this.__stream_read_i8 = function () {
        var value = this.__read_i8(this.__stream_addr);
        this.__stream_addr += 1;
        return value;
    }
    this.__stream_read_i16 = function () {
        var value = this.__read_i16(this.__stream_addr);
        this.__stream_addr += 2;
        return value;
    }
    this.__stream_read_i32 = function () {
        var value = this.__read_i32(this.__stream_addr);
        this.__stream_addr += 4;
        return value;
    }
    this.__stream_read_i64 = function () {
        var value = this.__read_i64(this.__stream_addr);
        this.__stream_addr += 8;
        return value;
    }

    this.__stream_set = function (addr) {
        this.__stream_addr = addr;
    }
    this.__read = function (addr, size) {
        var array = new Uint8Array(size);
        for (var i = 0; i < size; i++) {
            array[i] = this.__read_i8(addr + i);
        }
        return array;
    }
    this.__stream_read = function (size) {
        var value = this.__read(this.__stream_addr, size);
        this.__stream_addr += size;
        return value;
    }

    // Methods
    this.kind = function () {
        var kind = MLibelf.ccall('elf_kind', 'number',
            ['pointer'], [this.elf_ref]);
        switch (kind) {
        case ELF_K_AR:
            return "ar";
        case ELF_K_COFF:
            return "coff";
        case ELF_K_ELF:
            return "elf";
        default:
            return undefined;
        }
    }

    this.getclass = function () {
        var value = MLibelf.ccall('gelf_getclass', 'pointer',
            ['pointer'], [this.elf_ref]);
        return value;
    }

    this.getehdr = function () {
        var ehdr = {};
        var ehdr_size = 0x40;
        var ehdr_addr = MLibelf._malloc(ehdr_size);
        var ret = MLibelf.ccall('gelf_getehdr', 'pointer',
            ['pointer', 'pointer'], [this.elf_ref, ehdr_addr]);
        if (ret != ehdr_addr) {
            var error = 'Function gelf_getehdr failed';
            throw error;
        }

        this.__stream_set(ehdr_addr);
        ehdr.e_type       = this.__stream_read(EI_NIDENT);
        ehdr.e_type       = this.__stream_read_i16();
        ehdr.e_indent     = this.__stream_read_i16();
        ehdr.e_version    = this.__stream_read_i32();
        ehdr.e_entry      = this.__stream_read_i64();
        ehdr.e_phoff      = this.__stream_read_i64();
        ehdr.e_shoff      = this.__stream_read_i64();
        ehdr.e_flags      = this.__stream_read_i32();
        ehdr.e_ehsize     = this.__stream_read_i16();
        ehdr.e_phentsize  = this.__stream_read_i16();
        ehdr.e_phnum      = this.__stream_read_i16();
        ehdr.e_shentsize  = this.__stream_read_i16();
        ehdr.e_shnum      = this.__stream_read_i16();
        ehdr.e_shstrndx   = this.__stream_read_i16();
        MLibelf._free(ehdr_addr);
        return ehdr;
    }

    this.getident = function () {
        var ident_nbytes = MLibelf._malloc(4);
        var ident_addr = MLibelf.ccall('elf_getident', 'pointer',
            ['pointer', 'pointer'], [this.elf_ref, 0]);
        var ident = this.__read(ident_addr, ident_nbytes);
        MLibelf._free(ident_nbytes);
        return ident;
    }

    this.getphdr = function (index) {
        var phdr = {};
        var phdr_size = 0x38;
        var phdr_addr = MLibelf._malloc(phdr_size);
        var ret = MLibelf.ccall('gelf_getphdr', 'pointer',
            ['pointer', 'number', 'pointer'], [this.elf_ref, index, phdr_addr]);
        if (ret != phdr_addr) {
            var error = 'Function gelf_getphdr failed';
            throw error;
        }

        this.__stream_set(phdr_addr);
        phdr.p_type    = this.__stream_read_i32();
        phdr.p_flags   = this.__stream_read_i32();
        phdr.p_offset  = this.__stream_read_i64();
        phdr.p_vaddr   = this.__stream_read_i64();
        phdr.p_paddr   = this.__stream_read_i64();
        phdr.p_filesz  = this.__stream_read_i64();
        phdr.p_memsz   = this.__stream_read_i64();
        phdr.p_align   = this.__stream_read_i64();
        MLibelf._free(phdr_addr);
        return phdr;
    }

    this.getshdr = function () {
        var shdr = {};
        var shdr_size = 0x40;
        var shdr_addr = MLibelf._malloc(shdr_size);
        var ret = MLibelf.ccall('gelf_getshdr', 'pointer',
            ['pointer', 'pointer'], [this.elf_ref, shdr_addr]);
        if (ret != shdr_addr) {
            var error = 'Function gelf_getshdr failed';
            throw error;
        }

        this.__stream_set(shdr_addr);
        shdr.sh_name       = this.__stream_read_i32();
        shdr.sh_type       = this.__stream_read_i32();
        shdr.sh_flags      = this.__stream_read_i64();
        shdr.sh_addr       = this.__stream_read_i64();
        shdr.sh_offset     = this.__stream_read_i64();
        shdr.sh_size       = this.__stream_read_i64();
        shdr.sh_link       = this.__stream_read_i32();
        shdr.sh_info       = this.__stream_read_i32();
        shdr.sh_addralign  = this.__stream_read_i64();
        shdr.sh_entsize    = this.__stream_read_i64();
        MLibelf._free(shdr_addr);
        return phdr;
    }

    this.end = function () {
        MLibelf.ccall('elf_end', 'void',
            ['pointer'], [this.elf_ref]);
        MLibelf._free(this.elf_addr);
    }
}
