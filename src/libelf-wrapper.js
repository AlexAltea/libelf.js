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

    this.getdyn = function (index) {
        var dyn = {};
        var dyn_size = 0x10;
        var dyn_addr = MLibelf._malloc(dyn_size);
        var ret = MLibelf.ccall('gelf_getdyn', 'pointer',
            ['pointer', 'pointer'], [this.elf_ref, index, 0]);
        if (ret != dyn_addr) {
            var error = 'Function gelf_getdyn failed';
            throw error;
        }
        this.__stream_set(dyn_addr);
        dyn.d_tag = this.__stream_read_i64();
        dyn.d_val = this.__stream_read_i64();
        MLibelf._free(dyn_addr);
        return dyn;
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

    this.getphdrnum = function () {
        var phdrnum = 0;
        var phdrnum_size = 4;
        var phdrnum_addr = MLibelf._malloc(phdrnum_size);
        var ret = MLibelf.ccall('elf_getphdrnum', 'pointer',
            ['pointer', 'pointer'], [this.elf_ref, phdrnum_addr]);
        if (ret != 0) {
            MLibelf._free(phdrnum_addr);
            var error = 'Function elf_getphdrnum failed';
            throw error;
        }
        phdrnum = __read_i32(phdrnum_addr);
        MLibelf._free(phdrnum_addr);
        return phdrnum;
    }

    this.getrel = function (index) {
        var rel = {};
        var rel_size = 0x10;
        var rel_addr = MLibelf._malloc(rel_size);
        var ret = MLibelf.ccall('gelf_getrel', 'pointer',
            ['pointer', 'pointer'], [this.elf_ref, index, rel_addr]);
        if (ret != rel_addr) {
            var error = 'Function gelf_getdyn failed';
            throw error;
        }
        this.__stream_set(rel_addr);
        rel.r_offset  = this.__stream_read_i64();
        rel.r_info    = this.__stream_read_i64();
        MLibelf._free(rel_addr);
        return rel;
    }

    this.getrela = function (index) {
        var rela = {};
        var rela_size = 0x18;
        var rela_addr = MLibelf._malloc(rela_size);
        var ret = MLibelf.ccall('gelf_getrela', 'pointer',
            ['pointer', 'pointer'], [this.elf_ref, index, rela_addr]);
        if (ret != rela_addr) {
            var error = 'Function gelf_getdyn failed';
            throw error;
        }
        this.__stream_set(rela_addr);
        rela.r_offset  = this.__stream_read_i64();
        rela.r_info    = this.__stream_read_i64();
        rela.r_addend  = this.__stream_read_i64();
        MLibelf._free(rela_addr);
        return rela;
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

    this.getshdrnum = function () {
        var shdrnum = 0;
        var shdrnum_size = 4;
        var shdrnum_addr = MLibelf._malloc(shdrnum_size);
        var ret = MLibelf.ccall('elf_getshdrnum', 'pointer',
            ['pointer', 'pointer'], [this.elf_ref, shdrnum_addr]);
        if (ret != 0) {
            MLibelf._free(shdrnum_addr);
            var error = 'Function elf_getshdrnum failed';
            throw error;
        }
        shdrnum = __read_i32(shdrnum_addr);
        MLibelf._free(shdrnum_addr);
        return shdrnum;
    }

    this.getsym = function (index) {
        var sym = {};
        var sym_size = 0x18;
        var sym_addr = MLibelf._malloc(sym_size);
        var ret = MLibelf.ccall('gelf_getsym', 'pointer',
            ['pointer', 'pointer'], [this.elf_ref, index, sym_addr]);
        if (ret != sym_addr) {
            var error = 'Function gelf_getsym failed';
            throw error;
        }
        this.__stream_set(sym_addr);
        sym.st_name  = this.__stream_read_i32();
        sym.st_info  = this.__stream_read_i8();
        sym.st_other = this.__stream_read_i8();
        sym.st_shndx = this.__stream_read_i16();
        sym.st_value = this.__stream_read_i64();
        sym.st_size  = this.__stream_read_i64();
        MLibelf._free(sym_addr);
        return sym;
    }

    this.end = function () {
        MLibelf.ccall('elf_end', 'void',
            ['pointer'], [this.elf_ref]);
        MLibelf._free(this.elf_addr);
    }
}
