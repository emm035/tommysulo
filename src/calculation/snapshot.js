import _ from 'lodash';

const regCount = 8;

const snapshotBase = {
  resStations: {
    INT: [],
    MUL: [],
    DIV: []
  },
  functionalUnits: {
    INT: [],
    MUL: [],
    DIV: []
  },
  registers: Array(regCount),
  memory: {},
  rat: Array(regCount),
  instr: [],
  instrHist: [],
  pc: 0,
  cycle: 1
};

const resStationBase = {
  instr: null,
  type: null,
  FU: null,
  id: null
};

const functionalUnitBase = {
  instr: null,
  type: null,
  cyclesRemaining: -1,
  id: null
};

const instructionBase = {
  op: undefined,
  i: undefined,
  j: undefined,
  k: undefined,
  state: null
};


const copyOf = (json) => {
  return JSON.parse(JSON.stringify(json));
};


const isInt = (value) => {
  return !isNaN(value) &&
    parseInt(Number(value), 10) === value &&
    !isNaN(parseInt(value, 10));
};


const parseInstr = (instructions) => {
  // Instructions can be separated by '\n' or ';' - first, it replaces any ';'
  // with '\n' and trims whitespace from the string
  const instrs = instructions.replace(/\s*\/\/.*;*.*[\n]?/g, '\n') // allow for simple comments
    .replace(/ {2,}/g, ' ') // Multiple spaces removed
    .replace(/[;\s]{2,}|;/g, '\n'); // Multiple line delimiters removed
  console.log(instrs);
  return _.map(_.trim(instrs).split(/\n/), (instr) => {
    // Use a regex match to pull important info
    instr = _.trim(instr);
    const match = instr.match(/^(ADD|SUB|MUL|DIV)\s+(R[0-9]+)\s+(R?[0-9]+)\s+(R?[0-9]+)\s*$/) // R-type
               || instr.match(/^(LD|ST)\s+(R[0-9]+)\s+([0-9]+)\s*\(\s*(R[0-9]+)\s*\)\s*$/); // Load/Store offset
    // If there's a match, return it, otherwise null (will crash the program)
    if (match !== null) {
      const parsedInstr = {
        op: match[1],
        i: match[2],
        j: isInt(parseInt(match[3], 10)) ? parseInt(match[3], 10) : match[3],
        k: isInt(parseInt(match[4], 10)) ? parseInt(match[4], 10) : match[4]
      };
      return _.assign(copyOf(instructionBase), parsedInstr);
    }
    return null;
  });
};


// Options for the snapshot builder
const defaultOptions = {
  instr: '',
  functionalUnits: {
    INT: {
      count: 2,
      resStations: 3,
      latency: 1
    },
    MUL: {
      count: 1,
      resStations: 2,
      latency: 2
    },
    DIV: {
      count: 1,
      resStations: 2,
      latency: 8
    }
  }
};


const buildSnapshot = (options) => {

  const { instr, functionalUnits } = _.assign(defaultOptions, options);

  console.log(functionalUnits);

  const snapshot = copyOf(snapshotBase);

  _.forEach(_.keys(functionalUnits), (type) => {
    const fuDesc = functionalUnits[type];
    // Add reservation stations to snapshot
    for (var i = 0; i < fuDesc.resStations; i++) {
      snapshot.resStations[type].push(_.assign(copyOf(resStationBase), { type: type, id: `${type} ${i}` }));
    }
    // Add functional units to snapshot
    for (i = 0; i < fuDesc.count; i++) {
      snapshot.functionalUnits[type].push(_.assign(copyOf(functionalUnitBase), { type: type, id: `${type} ${i}`, latency: fuDesc.latency }));
    }
  });

  snapshot.rat.fill(null);

  snapshot.registers.fill(null);

  snapshot.instr = parseInstr(instr);

  return snapshot;
};

export {
  copyOf,
  buildSnapshot,
  parseInstr
};
