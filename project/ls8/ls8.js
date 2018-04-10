const RAM = require('./ram');
const CPU = require('./cpu');
const fs = require('fs');

/**
 * Load an LS8 program into memory
 *
 * TODO: load this from a file on disk instead of having it hardcoded
 */
function loadMemory() {
    const programToLoad = fs.readFileSync(process.argv[2], 'utf8');
    const formattedProgram = programToLoad.split('').filter(char => (char === '0' || char === '1' || char === '\n')).join('').split('\n').filter(line => line).map(line => line.slice(0,8));
    console.log('Ready to load program onto ls8!', formattedProgram);
    for (let i = 0; i < formattedProgram.length; i++) {
        cpu.poke(i, parseInt(formattedProgram[i], 2));
    }
}

/**
 * Main
 */

let ram = new RAM(256);
let cpu = new CPU(ram);

// TODO: get name of ls8 file to load from command line

loadMemory(cpu);

cpu.startClock();