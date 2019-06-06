import { Component, OnInit } from '@angular/core';

import { registers } from '../configs';

@Component({
  selector: 'app-test-two',
  templateUrl: './test-two.component.html',
  styleUrls: ['./test-two.component.css']
})
export class TestTwoComponent implements OnInit {

  registers = registers;

  a1 = '1 1 + 3 2 - / 5 *';
  a2 = '5 1 2 + 4 * + 3 -';
  a3 = '1 2 3 * +';
  a4 = '1 2 3 * + 4 /';

  operands = [];

  data = '.data';
  text = '.text';
  exec = '';

  constructor() {
  }

  ngOnInit() {
    this.init();
  }

  init() {
    const exp: any = this.a1.split(' ');

    exp.forEach((el, i) => {
      if (!isNaN(el)) {
        const reg = this.registers.pop();
        // console.log(`${reg}: ${el}`);
        this.initData(reg, el);
        this.operands.push(reg);
      } else {
        if (el === '+') {
          this.operands.push(this.process('add'));
        }
        if (el === '-') {
          this.operands.push(this.process('sub'));
        }
        if (el === '/') {
          this.operands.push(this.process('div'));
        }
        if (el === '*') {
          this.operands.push(this.process('mul'));
        }
      }
    });

    this.text += `\n${this.exec}`;
    this.text += `\n\n  sw  $5, 0(${this.operands[0]})`;


    console.log(this.data);
    console.log(this.text);
  }

  initData(reg: string, value: string) {
    const varName = `var_${reg.replace('$', '')}`;
    this.data += `\n  ${varName}: .word  0x${value}`;
    this.initText(reg, varName);
  }

  initText(reg: string, varName: string) {
    this.text += `\n  la	${reg}, ${varName}`;
    this.text += `\n  lw	${reg}, 0(${reg})`;
  }

  process(op: string) {
    const ref1 = this.operands.pop();
    const ref2 = this.operands.pop();
    this.printOp(op, ref2, ref2, ref1);
    return ref2;
  }

  printOp(op: string, op1: string, op2: string, op3: string) {
    let s = `${op}`;
    s += `  ${op1} ${op2} ${op3}`;

    this.exec += `\n  ${s}`;
    console.log(`>>>>>> ${s}`);
  }

}
