export const registers = [
  '$s7',
  '$s6',
  '$s5',
  '$s4',
  '$s3',
  '$s2',
  '$s1',
  '$s0',
  '$t9',
  '$t8',
  '$t7',
  '$t6',
  '$t5',
  '$t4',
  '$t3',
  '$t2',
  '$t1',
  '$t0',
  '$a3',
  '$a2',
  '$a1',
  // '$a0',
  '$v1',
  // '$v0',
];

export const exps = [
  {
    value: '1 1 + 3 2 - / 5 *',
    result: '10'
  },
  {
    value: '5 1 2 + 4 * + 3 -',
    result: '14'
  },
  {
    value: '1 2 3 * +',
    result: '7'
  },
  {
    value: '1 2 3 * + 4 /',
    result: '1.75'
  },
  {
    value: '5 1 2 + 4 * + 3 - 11 +',
    result: '25'
  },
  {
    value: '36 s',
    result: '6'
  },
  {
    value: '25 s 6 +',
    result: '11'
  },
  {
    value: '100 s 6 + 1 -',
    result: '15'
  },
  {
    value: '25 s 6 + 5 +',
    result: '16'
  },
  {
    value: '4 F',
    result: '24'
  },
  {
    value: '5 F',
    result: '120'
  },
  {
    value: '5 F 2 +',
    result: '122'
  },
  {
    value: '2 3 p',
    result: '8'
  },
  {
    value: '3 5 p',
    result: '243'
  },
  {
    value: '2 2 + 3 p',
    result: '64'
  },
  {
    value: '25 s 6 + 5 +',
    result: '16'
  },
  {
    value: '2 4 p 5 +',
    result: '21'
  },
  {
    value: '1 1 + 36 s + F',
    result: '40320'
  },
  {
    value: '9 2 - 16 s - F 3 p',
    result: '216'
  },
  {
    value: '1 3 F + 25 s - 8 p',
    result: '256'
  }
];
