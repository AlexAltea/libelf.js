/**
 * (c) 2018 Libelf.JS
 * Wrapper made by Alexandro Sanchez Bach.
 */

// Emscripten demodularize
var MLibelf = new MLibelf();

// Number conversion modes
ELF_INT_NUMBER  = 1
ELF_INT_STRING  = 2
ELF_INT_OBJECT  = 3

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
    this.__integer = function (value, width) {
        if (typeof value === "number") {
            value = [value];
        }
        switch (this.get_integer_type()) {
        case ELF_INT_NUMBER:
            return value[0];
        case ELF_INT_STRING:
            return value
                .map(x => x.toString(16).toUpperCase())
                .map(x => '0'.repeat(width/4 - x.length) + x)
                .reverse().join('');
        default:
            var error = 'Unimplemented integer type';
            throw error;
        }
    }

    this.__read_i8  = function (addr) {
        return this.__integer(MLibelf.getValue(addr, 'i8'), 8);
    }
    this.__read_i16 = function (addr) {
        return this.__integer(MLibelf.getValue(addr, 'i16'), 16);
    }
    this.__read_i32 = function (addr) {
        return this.__integer(MLibelf.getValue(addr, 'i32'), 32);
    }
    this.__read_i64 = function (addr) {
        return this.__integer([
            MLibelf.getValue(addr+0, 'i32'),
            MLibelf.getValue(addr+4, 'i32')], 32);
    }
    this.__read = function (addr, size) {
        var array = new Uint8Array(size);
        for (var i = 0; i < size; i++) {
            array[i] = this.__read_i8(addr + i);
        }
        return array;
    }

    this.__stream_set = function (addr) {
        this.__stream_addr = addr;
    }
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
    this.__stream_read = function (size) {
        var value = this.__read(this.__stream_addr, size);
        this.__stream_addr += size;
        return value;
    }

    // Configuration
    this.get_integer_type = function () {
        if (this.integer_type == null) {
            return ELF_INT_NUMBER;
        }
        return this.integer_type;
    }

    this.set_integer_type = function (type) {
        this.integer_type = type;
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

    this.getdyn = function (data_addr, index) {
        var dyn = {};
        var dyn_size = 0x10;
        var dyn_addr = MLibelf._malloc(dyn_size);
        var ret = MLibelf.ccall('gelf_getdyn', 'pointer',
            ['pointer', 'pointer'], [data_addr, index, dyn_addr]);
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

    this.getdata = function (scn_addr) {
        var scn_data = MLibelf.ccall('elf_getdata', 'pointer',
            ['pointer', 'pointer'], [scn_addr, 0]);
        if (scn_data == 0) {
            var error = 'Function elf_getdata failed';
            throw error;
        }
        return scn_data;
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
            var error = 'Function gelf_getrel failed';
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
            var error = 'Function gelf_getrela failed';
            throw error;
        }
        this.__stream_set(rela_addr);
        rela.r_offset  = this.__stream_read_i64();
        rela.r_info    = this.__stream_read_i64();
        rela.r_addend  = this.__stream_read_i64();
        MLibelf._free(rela_addr);
        return rela;
    }

    this.getscn = function (index) {
        var scn_addr = MLibelf.ccall('elf_getscn', 'pointer',
            ['pointer', 'number'], [this.elf_ref, index]);
        if (scn_addr == 0) {
            var error = 'Function elf_getscn failed';
            throw error;
        }
        return scn_addr;
    }

    this.getshdr = function (scn_addr) {
        var shdr = {};
        var shdr_size = 0x40;
        var shdr_addr = MLibelf._malloc(shdr_size);
        var ret = MLibelf.ccall('gelf_getshdr', 'pointer',
            ['pointer', 'pointer'], [scn_addr, shdr_addr]);
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
        return shdr;
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

    this.getshdrstrndx = function () {
        var shdrstrndx = 0;
        var shdrstrndx_size = 4;
        var shdrstrndx_addr = MLibelf._malloc(shdrstrndx_size);
        var ret = MLibelf.ccall('elf_getshstrndx', 'pointer',
            ['pointer', 'pointer'], [this.elf_ref, shdrstrndx_addr]);
        if (ret != 0) {
            MLibelf._free(shdrstrndx_addr);
            var error = 'Function elf_getshstrndx failed';
            throw error;
        }
        shdrstrndx = __read_i32(shdrstrndx_addr);
        MLibelf._free(shdrstrndx_addr);
        return shdrstrndx;
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

    this.strptr = function (index, offset) {
        var str = MLibelf.ccall('elf_strptr', 'string',
            ['pointer', 'number', 'number'], [this.elf_ref, index, offset]);
        return str;
    }

    // Shorthands
    this.get_dynamic_entries = function () {
        /* Locate dynamic section */
        var addr = 0;
        var scn_dynamic_addr = 0;
        var scn_dynamic_data = 0;
        var ehdr = this.getehdr();
        for (var i = 1; i < ehdr.e_shnum; i++) {
            var addr = MLibelf.ccall('elf_nextscn', 'pointer',
                ['pointer', 'pointer'], [this.elf_ref, addr]);
            if (addr == 0)
                break;
            var shdr = this.getshdr(addr);
            var sh_name = this.strptr(ehdr.e_shstrndx, shdr.sh_name);
            if (shdr.sh_type == SHT_STRTAB && sh_name == '.dynstr') {
                scn_dynstr_index = i;
            }
            if (shdr.sh_type == SHT_DYNAMIC) {
                scn_dynamic_addr = addr;
                scn_dynamic_shdr = shdr;
            }
        }
        if (scn_dynamic_addr != 0) {
            scn_dynamic_data = this.getdata(scn_dynamic_addr);
        } else {
            return [];
        }

        /* Read dynamic entries */
        var dents = [];
        var count = scn_dynamic_shdr.sh_size / scn_dynamic_shdr.sh_entsize;
        for (var i = 0; i < count; i++) {
            dents.push(this.getdyn(scn_dynamic_data, i));
        }

        /* Comment dynamic entries */
        var elf = this;
        dents.forEach(function (dent) {
            switch (dent.d_tag) {
            case DT_NEEDED:
                if (typeof scn_dynstr_index !== "undefined")
                    dent.value = elf.strptr(scn_dynstr_index, dent.d_val);
                break;
            }
        });
        return dents;
    }
}
