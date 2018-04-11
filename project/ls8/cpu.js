/**
 * LS-8 v2.0 emulator skeleton code
 */

const IM = 0x05;  // Interrupt mask register R5
const IS = 0x06;  // Interrupt status register R6
const SP = 0x07;  // Stack pointer R7

/**
 * Class for simulating a simple Computer (CPU & memory)
 */
class CPU {

    /**
     * Initialize the CPU
     */
    constructor(ram) {
        this.ram = ram;

        this.reg = new Array(8).fill(0); // General-purpose registers R0-R7
        //this.reg.SP = this.reg[7];
        this.reg[SP] = 0xf4;
        // Special-purpose registers
        this.reg.PC = 0; // Program Counter
    }
	
    /**
     * Store value in memory address, useful for program loading
     */
    poke(address, value) {
        this.ram.write(address, value);
    }

    /**
     * Starts the clock ticking on the CPU
     */
    startClock() {
        this.clock = setInterval(() => {
            this.tick();
        }, 1); // 1 ms delay == 1 KHz clock == 0.000001 GHz
    }

    /**
     * Stops the clock
     */
    stopClock() {
        clearInterval(this.clock);
    }

    /**
     * ALU functionality
     *
     * The ALU is responsible for math and comparisons.
     *
     * If you have an instruction that does math, i.e. MUL, the CPU would hand
     * it off to it's internal ALU component to do the actual work.
     *
     * op can be: ADD SUB MUL DIV INC DEC CMP
     */
    alu(op, regA, regB) {
        console.log("Got first registry address: ", regA);
        console.log("Got second registry address: ", regB);
        const firstVal = this.reg[regA];
        console.log("ALU got first operand from register: ", firstVal);
        const secondVal = this.reg[regB];
        console.log("ALU got second operand from register: ", secondVal);

        switch (op) {
            case 'ADD':
                return this.reg[regA] = firstVal + secondVal;
            case 'DEC':
                return this.reg[regA] = this.reg[regA] - 1;
            case 'DIV':
                if (firstVal || secondVal === 0){
                   return this.reg[regA] = 0;
                } else {
                    return this.reg[regA] = firstVal / secondVal;
                }
            case 'INC':
                return this.reg[regA] = this.reg[regA] + 1;
            case 'MOD':
                return this.reg[regA] = firstVal % secondVal;
            case 'MUL':
                return this.reg[regA] = firstVal * secondVal;
            case 'SUB':
                return this.reg[regA] = firstVal - secondVal;
        }
    }

    /**
     * Advances the CPU one cycle
     */
    tick() {
        // Load the instruction register (IR--can just be a local variable here)
        // from the memory address pointed to by the PC. (I.e. the PC holds the
        // index into memory of the instruction that's about to be executed
        // right now.)
        
        // !!! IMPLEMENT ME

        const PC = this.reg.PC;
        const IR = this.ram.read(PC);
        //console.log("The IR fetched from the top of the RAM stack was ", IR.toString(2));

        // Debugging output
        console.log("\n");
        console.log(`${this.reg.PC}: ${IR.toString(2)}`);
        //console.log("this.reg.SP is currently: ", this.reg.SP);

        // Get the two bytes in memory _after_ the PC in case the instruction
        // needs them.
        const operandA = this.ram.read(PC + 1);
        console.log("First potential operand: ", operandA.toString(2));
        const operandB = this.ram.read(PC + 2);
        console.log("Second potential operand: ", operandB.toString(2));


        // !!! IMPLEMENT ME

        // Execute the instruction. Perform the actions for the instruction as
        // outlined in the LS-8 spec.
        const LDI = 0b10011001;
        const HLT = 0b00000001;
        const PRN = 0b01000011;
        const MUL = 0b10101010;
        const PUSH = 0b01001101;
        const POP = 0b01001100;

        const execute_LDI = () => {
            console.log("The LDI operation is about to run!");
            this.reg[operandA] = operandB;
        };
        const execute_HLT = () => {
            console.log("The HLT operation is about to run!");
            this.stopClock();
        };
        const execute_PRN = () => {
            console.log("The PRN operation is about to run!");
            console.log("Printline output: ", this.reg[operandA]);
        };
        const execute_MUL = () => {
            console.log("The MUL operation is about to run!");
            this.alu('MUL', operandA, operandB);
        }
        const execute_PUSH = () => {
            console.log("The PUSH operation is about to run. Here is the entire register: ", this.reg);
            // this.alu('DEC', SP);
            // this.ram.write(this.reg[SP], operandA)
            console.log("OpA: ", operandA);
            console.log("OpB: ", operandB);
            _pushHelper(this.reg[operandA]);
        };
        const _pushHelper = reg => {
            this.alu('DEC', SP);
            console.log("About to write to stack at this location: ", this.reg[SP]);
            this.ram.write(this.reg[SP], this.reg[operandA]);
            console.log("Wrote to Stack: ", this.ram.read(243));
        }
        const execute_POP = () => {
            console.log("The POP operation is about to run!");
            // this.reg[operandA] = this.ram.read(this.reg[SP]);
            // this.alu('INC', SP);
            console.log("OpA: ", operandA);
            console.log("OpB: ", operandB);
            console.log("About to pop to this address: ", operandA);
            this.reg[operandA] = _popHelper();
        }
        const _popHelper = () => {
            console.log("The contents of the RAM is:", this.ram.mem[243]);
            const val = this.ram.read(this.reg[SP]);
            console.log("The value pop retrieved from the stack: ", val);
            this.alu('INC', SP);
            return val;
        }

        const opIndex = [];
        opIndex[LDI] = execute_LDI;
        opIndex[HLT] = execute_HLT;
        opIndex[PRN] = execute_PRN;
        opIndex[MUL] = execute_MUL;
        opIndex[PUSH] = execute_PUSH;
        opIndex[POP] = execute_POP;

        opIndex[IR]();

        // !!! IMPLEMENT ME
        
        // const opIndex = {
        //     '10101000': () => {
        //         console.log("The ADD operation logic will go here!");
        //     },
        //     '10110011': () => {
        //         console.log("The AND operation logic will go here!");
        //     },
        //     '01001000': () => {
        //         console.log("The CALL operation logic will go here!");
        //     },
        //     '10100000': () => {
        //         console.log("The CMP operation logic will go here!");
        //     },
        //     '01111001': () => {
        //         console.log("The DEC operation logic will go here!");
        //     },
        //     '10101011': () => {
        //         console.log("The DIV operation logic will go here!");
        //     },
        //     '00000001': () => {
        //         console.log("The HLT operation is about to run!");
        //         this.stopClock();
        //     },
        //     '01111000': () => {
        //         console.log("The INC operation logic will go here!");
        //     },
        //     '01001010': () => {
        //         console.log("The INT operation logic will go here!");
        //     },
        //     '00001011': () => {
        //         console.log("The IRET operation logic will go here!");
        //     },
        //     '01010001': () => {
        //         console.log("The JEQ operation logic will go here!");
        //     },
        //     '01010100': () => {
        //         console.log("The JGT operation logic will go here!");
        //     },
        //     '01010011': () => {
        //         console.log("The JLT operation logic will go here!");
        //     },
        //     '01010000': () => {
        //         console.log("The JMP operation logic will go here!");
        //     },
        //     '01010010': () => {
        //         console.log("The JNE operation logic will go here!");
        //     },
        //     '10011000': () => {
        //         console.log("The LD operation logic will go here!");
        //     },
        //     '10011001': () => {
        //         console.log("The LDI operation is about to run!");
        //         this.reg[operandA] = operandB;
        //     },
        //     '10101100': () => {
        //         console.log("The MOD operation logic will go here!");
        //     },
        //     '10101010': () => {
        //         console.log("The MUL operation logic will go here!");
        //     },
        //     '00000000': () => {
        //         console.log("The NOP operation logic will go here!");
        //     },
        //     '01110000': () => {
        //         console.log("The NOT operation logic will go here!");
        //     },
        //     '10110001': () => {
        //         console.log("The OR operation logic will go here!");
        //     },
        //     '01001100': () => {
        //         console.log("The POP operation logic will go here!");
        //     },
        //     '01000010': () => {
        //         console.log("The PRA operation logic will go here!");
        //     },
        //     '01000011': () => {
        //         console.log("The PRN operation is about to run!");
        //         console.log(operandA);
        //     },
        //     '01001101': () => {
        //         console.log("The PUSH operation logic will go here!");
        //     },
        //     '00001001': () => {
        //         console.log("The RET operation logic will go here!");
        //     },
        //     '10011010': () => {
        //         console.log("The ST operation logic will go here!");
        //     },
        //     '10101001': () => {
        //         console.log("The SUB operation logic will go here!");
        //     },
        //     '10110010': () => {
        //         console.log("The XOR operation logic will go here!");
        //     },
        // }
        //console.log("We 'carried out' an op");
        
        // Increment the PC register to go to the next instruction. Instructions
        // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
        // instruction byte tells you how many bytes follow the instruction byte
        // for any particular instruction.
        
        // !!! IMPLEMENT ME
        const operandCount = IR >>> 6
        this.reg.PC++;
        this.reg.PC += operandCount;
    }
}

module.exports = CPU;
