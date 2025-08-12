# MSP430 Toolchain Installation Guide

To compile the thermometer code and generate the hex file, you need to install the MSP430-GCC toolchain.

## Option 1: Texas Instruments MSP430-GCC (Recommended)

1. **Download MSP430-GCC**:
   - Visit: https://www.ti.com/tool/MSP430-GCC-OPENSOURCE
   - Download the latest version for Windows
   - Current version: msp430-gcc 9.3.1.11

2. **Install**:
   - Run the installer (e.g., `msp430-gcc-9.3.1.11_win64.exe`)
   - Install to default location (usually `C:\ti\msp430-gcc`)
   - The installer should add the tools to your PATH

3. **Verify Installation**:
   ```cmd
   msp430-gcc --version
   msp430-objcopy --version
   ```

## Option 2: Alternative Installation

If the TI installer doesn't work, you can try:

1. **Download from GitHub**:
   - Visit: https://github.com/kemerelab/msp430-gcc-linux64
   - Or search for "MSP430-GCC Windows binaries"

2. **Manual PATH Setup**:
   - Add the `bin` folder to your Windows PATH
   - Example: `C:\ti\msp430-gcc\bin`

## Option 3: Use Code Composer Studio

If you have CCS installed:
1. Navigate to CCS installation folder
2. Find the GCC toolchain (usually in `tools/compiler/msp430-gcc`)
3. Add the `bin` directory to PATH

## After Installation

1. Open a new Command Prompt or PowerShell
2. Navigate to your project folder
3. Run: `compile.bat` or `make`
4. The `thermometer.hex` file will be created

## Troubleshooting

- **"msp430-gcc not found"**: PATH not set correctly
- **Permission errors**: Run as Administrator
- **Missing libraries**: Reinstall the complete toolchain

## Alternative: Online Compilation

If you can't install locally, you can use:
1. TI's online compiler (requires account)
2. Virtual machine with Linux and MSP430-GCC
3. Ask someone with the toolchain to compile for you

## File Needed for WhatsApp

After successful compilation, send your teammate:
- `thermometer.hex` - This is the file to program the MSP430
- Optionally: `thermometer.c` - Source code for reference
