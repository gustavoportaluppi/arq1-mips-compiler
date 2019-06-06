import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-one',
  templateUrl: './test-one.component.html',
  styleUrls: ['./test-one.component.css']
})
export class TestOneComponent implements OnInit {

  a1 = '1 1 + 3 2 - / 5 *';
  a2 = '5 1 2 + 4 * + 3 -';
  a3 = '1 2 3 * +';
  a4 = '1 2 3 * + 4 /';

  operands = [];
  currentOperands = [];
  operators = [];

  constructor() {
  }

  ngOnInit() {
    this.init();
  }

  init() {
    const exp: any = this.a1.split(' ');

    for (const el of exp) {
      if (!isNaN(el)) {
        if (this.currentOperands.length === 2) {
          this.currentOperands.shift();
        }
        this.currentOperands.push(el);
        this.operands.push(el);
      } else {
        if (el === '+') {
          this.process('add');
        }
        if (el === '-') {
          this.process('sub');
        }
        if (el === '/') {
          this.process('div');
        }
        if (el === '*') {
          this.process('mul');
        }
      }
    }
  }

  printOp(op: string, numbers) {
    let s = `${op}`;

    s += ` ${numbers[numbers.length - 2]}`;
    s += ` ${numbers[numbers.length - 1]}`;

    console.log(`>>> ${s}`);
  }

  process(op: string) {
    // console.log(`Numbers: ${this.operands}`);
    // console.log(`Current Operands: ${this.currentOperands}`);
    // console.log(`Ops: ${this.operators}`);

    if (this.currentOperands.length === 2) {
      this.printOp(op, this.currentOperands);
      this.operators.push(op);
      this.currentOperands.pop();
      this.currentOperands.pop();
      this.operands.pop();
      this.operands.pop();
    } else if (this.currentOperands.length === 1 && this.operators.length > 0) {
      this.printOp(op, [this.operators[0], this.currentOperands[0]]);
      this.operators.pop();
      this.operators.push(op);
      this.currentOperands.pop();
      this.operands.pop();
    } else if (this.operators.length > 1) {
      this.printOp(op, this.operators);
      this.operators.pop();
      this.operators.pop();
      this.operators.push(op);
    } else {
      this.printOp(op, [this.operands[0], this.operators[0]]);
      this.operands.pop();
      this.currentOperands.pop();
      this.operators.pop();
      this.operators.push(op);
    }
  }

}
