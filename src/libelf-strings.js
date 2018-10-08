/**
 * (c) 2018 Libelf.JS
 * Wrapper made by Alexandro Sanchez Bach.
 */

/* ELF constants */

// e_type
const e_type_strings = {
    ET_NONE:             "ET_NONE",
    ET_REL:              "ET_REL",
    ET_EXEC:             "ET_EXEC",
    ET_DYN:              "ET_DYN",
    ET_CORE:             "ET_CORE",
    ET_NUM:              "ET_NUM",
};

// e_machine
const e_machine_strings = {
    EM_NONE:             "EM_NONE",
    EM_M32:              "EM_M32",
    EM_SPARC:            "EM_SPARC",
    EM_386:              "EM_386",
    EM_68K:              "EM_68K",
    EM_88K:              "EM_88K",
    EM_486:              "EM_486",
    EM_860:              "EM_860",
    EM_MIPS:             "EM_MIPS",
    EM_S370:             "EM_S370",
    EM_MIPS_RS3_LE:      "EM_MIPS_RS3_LE",
    EM_SPARC64:          "EM_SPARC64",
    EM_PARISC:           "EM_PARISC",
    EM_VPP500:           "EM_VPP500",
    EM_SPARC32PLUS:      "EM_SPARC32PLUS",
    EM_960:              "EM_960",
    EM_PPC:              "EM_PPC",
    EM_PPC64:            "EM_PPC64",
    EM_S390:             "EM_S390",
    EM_V800:             "EM_V800",
    EM_FR20:             "EM_FR20",
    EM_RH32:             "EM_RH32",
    EM_RCE:              "EM_RCE",
    EM_ARM:              "EM_ARM",
    EM_ALPHA:            "EM_ALPHA",
    EM_SH:               "EM_SH",
    EM_SPARCV9:          "EM_SPARCV9",
    EM_TRICORE:          "EM_TRICORE",
    EM_ARC:              "EM_ARC",
    EM_H8_300:           "EM_H8_300",
    EM_H8_300H:          "EM_H8_300H",
    EM_H8S:              "EM_H8S",
    EM_H8_500:           "EM_H8_500",
    EM_IA_64:            "EM_IA_64",
    EM_MIPS_X:           "EM_MIPS_X",
    EM_COLDFIRE:         "EM_COLDFIRE",
    EM_68HC12:           "EM_68HC12",
    EM_MMA:              "EM_MMA",
    EM_PCP:              "EM_PCP",
    EM_NCPU:             "EM_NCPU",
    EM_NDR1:             "EM_NDR1",
    EM_STARCORE:         "EM_STARCORE",
    EM_ME16:             "EM_ME16",
    EM_ST100:            "EM_ST100",
    EM_TINYJ:            "EM_TINYJ",
    EM_X86_64:           "EM_X86_64",
    EM_PDSP:             "EM_PDSP",
    EM_FX66:             "EM_FX66",
    EM_ST9PLUS:          "EM_ST9PLUS",
    EM_ST7:              "EM_ST7",
    EM_68HC16:           "EM_68HC16",
    EM_68HC11:           "EM_68HC11",
    EM_68HC08:           "EM_68HC08",
    EM_68HC05:           "EM_68HC05",
    EM_SVX:              "EM_SVX",
    EM_ST19:             "EM_ST19",
    EM_VAX:              "EM_VAX",
    EM_CRIS:             "EM_CRIS",
    EM_JAVELIN:          "EM_JAVELIN",
    EM_FIREPATH:         "EM_FIREPATH",
    EM_ZSP:              "EM_ZSP",
    EM_MMIX:             "EM_MMIX",
    EM_HUANY:            "EM_HUANY",
    EM_PRISM:            "EM_PRISM",
    EM_AVR:              "EM_AVR",
    EM_FR30:             "EM_FR30",
    EM_D10V:             "EM_D10V",
    EM_D30V:             "EM_D30V",
    EM_V850:             "EM_V850",
    EM_M32R:             "EM_M32R",
    EM_MN10300:          "EM_MN10300",
    EM_MN10200:          "EM_MN10200",
    EM_PJ:               "EM_PJ",
    EM_OPENRISC:         "EM_OPENRISC",
    EM_ARC_A5:           "EM_ARC_A5",
    EM_XTENSA:           "EM_XTENSA",
    EM_VIDEOCORE:        "EM_VIDEOCORE",
    EM_TMM_GPP:          "EM_TMM_GPP",
    EM_NS32K:            "EM_NS32K",
    EM_TPC:              "EM_TPC",
    EM_SNP1K:            "EM_SNP1K",
    EM_ST200:            "EM_ST200",
    EM_IP2K:             "EM_IP2K",
    EM_MAX:              "EM_MAX",
    EM_CR:               "EM_CR",
    EM_F2MC16:           "EM_F2MC16",
    EM_MSP430:           "EM_MSP430",
    EM_BLACKFIN:         "EM_BLACKFIN",
    EM_SE_C33:           "EM_SE_C33",
    EM_SEP:              "EM_SEP",
    EM_ARCA:             "EM_ARCA",
    EM_UNICORE:          "EM_UNICORE",
    EM_NUM:              "EM_NUM",
};

// p_type
const p_type_strings = {
    PT_NULL:             "PT_NULL",
    PT_LOAD:             "PT_LOAD",
    PT_DYNAMIC:          "PT_DYNAMIC",
    PT_INTERP:           "PT_INTERP",
    PT_NOTE:             "PT_NOTE",
    PT_SHLIB:            "PT_SHLIB",
    PT_PHDR:             "PT_PHDR",
    PT_TLS:              "PT_TLS",
    PT_NUM:              "PT_NUM",
};

// p_flags
const p_flags_strings = {
    PF_X:                "PF_X",
    PF_W:                "PF_W",
    PF_R:                "PF_R",
};

// sh_type
const sh_type_strings = {
    SHT_NULL:            "SHT_NULL",
    SHT_PROGBITS:        "SHT_PROGBITS",
    SHT_SYMTAB:          "SHT_SYMTAB",
    SHT_STRTAB:          "SHT_STRTAB",
    SHT_RELA:            "SHT_RELA",
    SHT_HASH:            "SHT_HASH",
    SHT_DYNAMIC:         "SHT_DYNAMIC",
    SHT_NOTE:            "SHT_NOTE",
    SHT_NOBITS:          "SHT_NOBITS",
    SHT_REL:             "SHT_REL",
    SHT_SHLIB:           "SHT_SHLIB",
    SHT_DYNSYM:          "SHT_DYNSYM",
    SHT_INIT_ARRAY:      "SHT_INIT_ARRAY",
    SHT_FINI_ARRAY:      "SHT_FINI_ARRAY",
    SHT_PREINIT_ARRAY:   "SHT_PREINIT_ARRAY",
    SHT_GROUP:           "SHT_GROUP",
    SHT_SYMTAB_SHNDX:    "SHT_SYMTAB_SHNDX",
    SHT_NUM:             "SHT_NUM",
    SHT_LOOS:            "SHT_LOOS",
    SHT_HIOS:            "SHT_HIOS",
    SHT_LOPROC:          "SHT_LOPROC",
    SHT_HIPROC:          "SHT_HIPROC",
    SHT_LOUSER:          "SHT_LOUSER",
    SHT_HIUSER:          "SHT_HIUSER",
};

// dt_type
const dt_type_strings = {
    DT_NULL:             "DT_NULL",
    DT_NEEDED:           "DT_NEEDED",
    DT_PLTRELSZ:         "DT_PLTRELSZ",
    DT_PLTGOT:           "DT_PLTGOT",
    DT_HASH:             "DT_HASH",
    DT_STRTAB:           "DT_STRTAB",
    DT_SYMTAB:           "DT_SYMTAB",
    DT_RELA:             "DT_RELA",
    DT_RELASZ:           "DT_RELASZ",
    DT_RELAENT:          "DT_RELAENT",
    DT_STRSZ:            "DT_STRSZ",
    DT_SYMENT:           "DT_SYMENT",
    DT_INIT:             "DT_INIT",
    DT_FINI:             "DT_FINI",
    DT_SONAME:           "DT_SONAME",
    DT_RPATH:            "DT_RPATH",
    DT_SYMBOLIC:         "DT_SYMBOLIC",
    DT_REL:              "DT_REL",
    DT_RELSZ:            "DT_RELSZ",
    DT_RELENT:           "DT_RELENT",
    DT_PLTREL:           "DT_PLTREL",
    DT_DEBUG:            "DT_DEBUG",
    DT_TEXTREL:          "DT_TEXTREL",
    DT_JMPREL:           "DT_JMPREL",
    DT_BIND_NOW:         "DT_BIND_NOW",
    DT_INIT_ARRAY:       "DT_INIT_ARRAY",
    DT_FINI_ARRAY:       "DT_FINI_ARRAY",
    DT_INIT_ARRAYSZ:     "DT_INIT_ARRAYSZ",
    DT_FINI_ARRAYSZ:     "DT_FINI_ARRAYSZ",
    DT_RUNPATH:          "DT_RUNPATH",
    DT_FLAGS:            "DT_FLAGS",
    DT_ENCODING:         "DT_ENCODING",
    DT_PREINIT_ARRAY:    "DT_PREINIT_ARRAY",
    DT_PREINIT_ARRAYSZ:  "DT_PREINIT_ARRAYSZ",
    DT_NUM:              "DT_NUM",
};

// dt_flags
const dt_flags_strings = {
    DF_ORIGIN:           "DF_ORIGIN",
    DF_SYMBOLIC:         "DF_SYMBOLIC",
    DF_TEXTREL:          "DF_TEXTREL",
    DF_BIND_NOW:         "DF_BIND_NOW",
    DF_STATIC_TLS:       "DF_STATIC_TLS",
};
