import { Component, OnInit } from '@angular/core';

import { registers } from '../configs';

@Component({
  selector: 'app-test-two',
  templateUrl: './test-two.component.html',
  styleUrls: ['./test-two.component.css']
})
export class TestTwoComponent implements OnInit {

  registers = registers;

  a1 = '1 1 + 3 2 - / 5 *'; // 10
  a2 = '5 1 2 + 4 * + 3 -'; // 14
  a3 = '1 2 3 * +';
  a4 = '1 2 3 * + 4 /';
  a5 = '5 1 2 + 4 * + 3 - 11 +'; // 25
  a6 = '25 s 6 +'; // 11
  a7 = '25 s 6 + 1 -'; // 10
  a8 = '25 s 6 + 5 +'; // 16

  operands = [];

  data = '.data \n  error_msg: .asciiz "Não é uma raiz quadrada perfeita"';
  text = '.text';
  aux = '';
  exec = '';

  constructor() {
  }

  ngOnInit() {
    this.init();
  }

  init() {
    const exp: any = this.a8.split(' ');

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
        if (el === 's') {
          this.text += `\n\n  jal  init_sqrt`;

          const result = this.operands.pop();
          this.operands.push(this.printRaiz(result));
        }
      }
    });

    this.text += `\n${this.exec}`;

    // const result = this.operands.pop();

    // this.text += `\n\n  jal  init_sqrt`;
    //
    // this.operands.push(this.printRaiz(result));

    const resultadoRaiz = this.operands.pop();

    this.text += `\n\n  move $v0, ${resultadoRaiz}`;
    this.text += `\n  move $a0, $v0`;
    this.text += `\n  li $v0, 1`;
    this.text += `\n  syscall`;
    this.text += `\n  j  exit`;

    this.text += this.aux;


    this.text += `\n\n\n exit:`;
  }

  initData(reg: string, value: string) {
    // TODO substituir la e lw por li (?)
    const varName = `var_${reg.replace('$', '')}`;
    this.data += `\n  ${varName}: .word  0x${Number(value).toString(16)}`;
    this.initText(reg, varName);
  }

  initText(reg: string, varName: string) {
    this.text += `\n\n  la	${reg}, ${varName}`;
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
    //  console.log(`>>>>>> ${s}`);
  }

  printRaiz(source: string) {

    const auxReg1 = this.registers.pop();
    const auxReg2 = this.registers.pop();
    const destination = this.registers.pop();

    this.aux += `\n\n\n  init_sqrt:`;
    this.aux += `\n    li	${destination}, 0`;
    this.aux += `\n    la 	${auxReg1}, (${source})`;

    this.aux += `\n\n  isqrt:
    mul ${auxReg2}, ${destination}, 2
    add ${auxReg2}, ${auxReg2}, 1
    sub ${auxReg1}, ${auxReg1}, ${auxReg2}
    add ${destination}, ${destination}, 1                      # incrementa o contador, que sera o resultado da raiz
    beq ${auxReg1}, $zero, success_raiz         # se chegamos a zero a raiz é perfeita
    slt ${auxReg2}, ${auxReg1}, $zero                  # caso seja menor que zero, deu problema
    beq ${auxReg2}, 1, error_raiz               # então mostramos mensagem de erro
    j   isqrt`;

    this.aux += `\n\n  success_raiz:
    jr $ra`;

    this.aux += `\n\n  error_raiz:
    la $a0, error_msg
    la $v0, 4
    syscall
    j  exit`;

    return destination;
  }

}
