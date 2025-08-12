@echo off
echo MSP430 Digital Thermometer Compiler
echo ===================================

REM Check if msp430-gcc is available
where msp430-gcc >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: msp430-gcc not found in PATH
    echo Please install MSP430-GCC toolchain first
    pause
    exit /b 1
)

echo Compiling thermometer.c...
msp430-gcc -mmcu=msp430g2553 -O2 -Wall -g -o thermometer.elf thermometer.c

if %errorlevel% neq 0 (
    echo Compilation failed!
    pause
    exit /b 1
)

echo Creating hex file...
msp430-objcopy -O ihex thermometer.elf thermometer.hex

if %errorlevel% neq 0 (
    echo Hex file creation failed!
    pause
    exit /b 1
)

echo.
echo Build successful!
echo Output files:
echo   - thermometer.elf (ELF executable)
echo   - thermometer.hex (Intel HEX file for programming)

msp430-size thermometer.elf

echo.
echo The thermometer.hex file is ready to program to your MSP430G2553!
pause
