# MSP430 Digital Thermometer Makefile

# Compiler and tools
CC = msp430-gcc
OBJCOPY = msp430-objcopy
SIZE = msp430-size

# Target microcontroller
MCU = msp430g2553

# Source files
SOURCES = thermometer.c

# Object files
OBJECTS = $(SOURCES:.c=.o)

# Output files
TARGET = thermometer
ELF = $(TARGET).elf
HEX = $(TARGET).hex

# Compiler flags
CFLAGS = -mmcu=$(MCU) -O2 -Wall -g

# Linker flags
LDFLAGS = -mmcu=$(MCU)

# Default target
all: $(HEX)

# Create hex file from elf
$(HEX): $(ELF)
	$(OBJCOPY) -O ihex $(ELF) $(HEX)
	$(SIZE) $(ELF)
	@echo "Hex file created: $(HEX)"

# Create elf file from objects
$(ELF): $(OBJECTS)
	$(CC) $(LDFLAGS) -o $(ELF) $(OBJECTS)

# Compile source files
%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

# Clean build files
clean:
	rm -f $(OBJECTS) $(ELF) $(HEX)

# Program the microcontroller (requires mspdebug)
program: $(HEX)
	mspdebug rf2500 "prog $(HEX)"

.PHONY: all clean program
