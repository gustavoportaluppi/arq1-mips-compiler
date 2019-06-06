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

  constructor() {
  }

  ngOnInit() {
    this.init();
  }

  init() {
    const exp: any = this.a1.split(' ');

    exp.forEach((el, i) => {
      if (!isNaN(el)) {
        this.operands.push(el);
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
  }

  process(op: string) {
    this.printOp(op, this.operands.pop(), this.operands.pop());
    return op;
  }

  printOp(op: string, op1: string, op2: string) {
    let s = `${op}`;
    s += ` ${op2} ${op1}`;
    console.log(`>>>>>> ${s}`);
  }

}
