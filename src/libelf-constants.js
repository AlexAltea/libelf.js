/**
 * (c) 2018 Libelf.JS
 * Wrapper made by Alexandro Sanchez Bach.
 */

/* Libelf constants */

// Commands
ELF_C_NULL    = 0;
ELF_C_READ    = 1;
ELF_C_WRITE   = 2;
ELF_C_CLR     = 3;
ELF_C_SET     = 4;
ELF_C_FDDONE  = 5;
ELF_C_FDREAD  = 6;
ELF_C_RDWR    = 7;
ELF_C_NUM     = 8;

// File types
ELF_K_NONE    = 0;
ELF_K_AR      = 1;
ELF_K_COFF    = 2;
ELF_K_ELF     = 3;
ELF_K_NUM     = 4;

// Data types
ELF_T_BYTE    = 0;
ELF_T_ADDR    = 1;
ELF_T_DYN     = 2;
ELF_T_EHDR    = 3;
ELF_T_HALF    = 4;
ELF_T_OFF     = 5;
ELF_T_PHDR    = 6;
ELF_T_RELA    = 7;
ELF_T_REL     = 8;
ELF_T_SHDR    = 9;
ELF_T_SWORD   = 10;
ELF_T_SYM     = 11;
ELF_T_WORD    = 12;
ELF_T_SXWORD  = 13;
ELF_T_XWORD   = 14;
ELF_T_VDEF    = 15;
ELF_T_VNEED   = 16;
ELF_T_NUM     = 17;

/* ELF constants */

EI_NIDENT	  = 16;

// e_type
ET_NONE       = 0;
ET_REL        = 1;
ET_EXEC       = 2;
ET_DYN        = 3;
ET_CORE       = 4;
ET_NUM        = 5;
ET_LOOS       = 0xfe00;
ET_HIOS       = 0xfeff;
ET_LOPROC     = 0xff00;
ET_HIPROC     = 0xffff;

// e_machine
EM_NONE          = 0;   /* No machine */
EM_M32           = 1;   /* AT&T WE 32100 */
EM_SPARC         = 2;   /* SPARC */
EM_386           = 3;   /* Intel 80386 */
EM_68K           = 4;   /* Motorola 68000 */
EM_88K           = 5;   /* Motorola 88000 */
EM_486           = 6;   /* Intel i486 (DO NOT USE THIS ONE) */
EM_860           = 7;   /* Intel 80860 */
EM_MIPS          = 8;   /* MIPS I Architecture */
EM_S370          = 9;   /* IBM System/370 Processor */
EM_MIPS_RS3_LE   = 10;  /* MIPS RS3000 Little-endian */
EM_SPARC64       = 11;  /* SPARC 64-bit */
EM_PARISC        = 15;  /* Hewlett-Packard PA-RISC */
EM_VPP500        = 17;  /* Fujitsu VPP500 */
EM_SPARC32PLUS   = 18;  /* Enhanced instruction set SPARC */
EM_960           = 19;  /* Intel 80960 */
EM_PPC           = 20;  /* PowerPC */
EM_PPC64         = 21;  /* 64-bit PowerPC */
EM_S390          = 22;  /* IBM System/390 Processor */
EM_V800          = 36;  /* NEC V800 */
EM_FR20          = 37;  /* Fujitsu FR20 */
EM_RH32          = 38;  /* TRW RH-32 */
EM_RCE           = 39;  /* Motorola RCE */
EM_ARM           = 40;  /* Advanced RISC Machines ARM */
EM_ALPHA         = 41;  /* Digital Alpha */
EM_SH            = 42;  /* Hitachi SH */
EM_SPARCV9       = 43;  /* SPARC Version 9 */
EM_TRICORE       = 44;  /* Siemens TriCore embedded processor */
EM_ARC           = 45;  /* Argonaut RISC Core, Argonaut Technologies Inc. */
EM_H8_300        = 46;  /* Hitachi H8/300 */
EM_H8_300H       = 47;  /* Hitachi H8/300H */
EM_H8S           = 48;  /* Hitachi H8S */
EM_H8_500        = 49;  /* Hitachi H8/500 */
EM_IA_64         = 50;  /* Intel IA-64 processor architecture */
EM_MIPS_X        = 51;  /* Stanford MIPS-X */
EM_COLDFIRE      = 52;  /* Motorola ColdFire */
EM_68HC12        = 53;  /* Motorola M68HC12 */
EM_MMA           = 54;  /* Fujitsu MMA Multimedia Accelerator */
EM_PCP           = 55;  /* Siemens PCP */
EM_NCPU          = 56;  /* Sony nCPU embedded RISC processor */
EM_NDR1          = 57;  /* Denso NDR1 microprocessor */
EM_STARCORE      = 58;  /* Motorola Star*Core processor */
EM_ME16          = 59;  /* Toyota ME16 processor */
EM_ST100         = 60;  /* STMicroelectronics ST100 processor */
EM_TINYJ         = 61;  /* Advanced Logic Corp. TinyJ embedded processor family */
EM_X86_64        = 62;  /* AMD x86-64 architecture */
EM_PDSP          = 63;  /* Sony DSP Processor */
EM_FX66          = 66;  /* Siemens FX66 microcontroller */
EM_ST9PLUS       = 67;  /* STMicroelectronics ST9+ 8/16 bit microcontroller */
EM_ST7           = 68;  /* STMicroelectronics ST7 8-bit microcontroller */
EM_68HC16        = 69;  /* Motorola MC68HC16 Microcontroller */
EM_68HC11        = 70;  /* Motorola MC68HC11 Microcontroller */
EM_68HC08        = 71;  /* Motorola MC68HC08 Microcontroller */
EM_68HC05        = 72;  /* Motorola MC68HC05 Microcontroller */
EM_SVX           = 73;  /* Silicon Graphics SVx */
EM_ST19          = 74;  /* STMicroelectronics ST19 8-bit microcontroller */
EM_VAX           = 75;  /* Digital VAX */
EM_CRIS          = 76;  /* Axis Communications 32-bit embedded processor */
EM_JAVELIN       = 77;  /* Infineon Technologies 32-bit embedded processor */
EM_FIREPATH      = 78;  /* Element 14 64-bit DSP Processor */
EM_ZSP           = 79;  /* LSI Logic 16-bit DSP Processor */
EM_MMIX          = 80;  /* Donald Knuth's educational 64-bit processor */
EM_HUANY         = 81;  /* Harvard University machine-independent object files */
EM_PRISM         = 82;  /* SiTera Prism */
EM_AVR           = 83;  /* Atmel AVR 8-bit microcontroller */
EM_FR30          = 84;  /* Fujitsu FR30 */
EM_D10V          = 85;  /* Mitsubishi D10V */
EM_D30V          = 86;  /* Mitsubishi D30V */
EM_V850          = 87;  /* NEC v850 */
EM_M32R          = 88;  /* Mitsubishi M32R */
EM_MN10300       = 89;  /* Matsushita MN10300 */
EM_MN10200       = 90;  /* Matsushita MN10200 */
EM_PJ            = 91;  /* picoJava */
EM_OPENRISC      = 92;  /* OpenRISC 32-bit embedded processor */
EM_ARC_A5        = 93;  /* ARC Cores Tangent-A5 */
EM_XTENSA        = 94;  /* Tensilica Xtensa Architecture */
EM_VIDEOCORE     = 95;  /* Alphamosaic VideoCore processor */
EM_TMM_GPP       = 96;  /* Thompson Multimedia General Purpose Processor */
EM_NS32K         = 97;  /* National Semiconductor 32000 series */
EM_TPC           = 98;  /* Tenor Network TPC processor */
EM_SNP1K         = 99;  /* Trebia SNP 1000 processor */
EM_ST200         = 100; /* STMicroelectronics (www.st.com) ST200 microcontroller */
EM_IP2K          = 101; /* Ubicom IP2xxx microcontroller family */
EM_MAX           = 102; /* MAX Processor */
EM_CR            = 103; /* National Semiconductor CompactRISC microprocessor */
EM_F2MC16        = 104; /* Fujitsu F2MC16 */
EM_MSP430        = 105; /* Texas Instruments embedded microcontroller msp430 */
EM_BLACKFIN      = 106; /* Analog Devices Blackfin (DSP) processor */
EM_SE_C33        = 107; /* S1C33 Family of Seiko Epson processors */
EM_SEP           = 108; /* Sharp embedded microprocessor */
EM_ARCA          = 109; /* Arca RISC Microprocessor */
EM_UNICORE       = 110; /* Microprocessor series from PKU-Unity Ltd. and MPRC of Peking University */
EM_NUM           = 111;
EM_AMD64         = EM_X86_64;

// e_ident[EI_VERSION], e_version
EV_NONE          = 0;
EV_CURRENT       = 1;
EV_NUM           = 2;

// sh_type
SHT_NULL           = 0;
SHT_PROGBITS       = 1;
SHT_SYMTAB         = 2;
SHT_STRTAB         = 3;
SHT_RELA           = 4;
SHT_HASH           = 5;
SHT_DYNAMIC        = 6;
SHT_NOTE           = 7;
SHT_NOBITS         = 8;
SHT_REL            = 9;
SHT_SHLIB          = 10;
SHT_DYNSYM         = 11;
SHT_INIT_ARRAY     = 14;
SHT_FINI_ARRAY     = 15;
SHT_PREINIT_ARRAY  = 16;
SHT_GROUP          = 17;
SHT_SYMTAB_SHNDX   = 18;
SHT_NUM            = 19;
SHT_LOOS           = 0x60000000;
SHT_HIOS           = 0x6fffffff;
SHT_LOPROC         = 0x70000000;
SHT_HIPROC         = 0x7fffffff;
SHT_LOUSER         = 0x80000000;
SHT_HIUSER         = 0xffffffff;
