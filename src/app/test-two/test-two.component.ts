import { Component, OnInit } from '@angular/core';

import { registers, exps } from '../configs';

@Component({
  selector: 'app-test-two',
  templateUrl: './test-two.component.html',
  styleUrls: ['./test-two.component.css']
})
export class TestTwoComponent implements OnInit {

  exp = '1 1 + 3 2 - / 5 *';
  exps = exps;

  registers = registers.slice();

  a1 = '1 1 + 3 2 - / 5 *'; // 10
  a2 = '5 1 2 + 4 * + 3 -'; // 14
  a3 = '1 2 3 * +'; // 7
  a4 = '1 2 3 * + 4 /'; // 1.75
  a5 = '5 1 2 + 4 * + 3 - 11 +'; // 25

  /* sqrt */
  a6 = '25 s 6 +'; // 11
  a7 = '25 s 6 + 1 -'; // 10
  a8 = '25 s 6 + 5 +'; // 16

  /* fatorial */
  a9 = '4 F'; // 24
  a10 = '5 F'; // 120
  a11 = '5 F 2 +'; // 122

  /* potência */
  a12 = '2 3 p'; // 8
  a13 = '3 5 p'; // 243

  operands = [];

  data = `\n.data\n`;
  text = `\n.text`;
  aux = '';
  exec = '';

  constructor() {
  }

  ngOnInit() {
  }

  onClickConfirm() {
    this.resetData();
    this.initAssembly();
  }

  resetData() {
    this.registers = registers.slice();
    this.operands = [];

    this.data = `\n.data\n`;
    this.text = '\n.text';
    this.aux = '';
    this.exec = '';
  }

  initAssembly() {
    const exp: any = this.exp.split(' ');

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
          this.exec += `\n\n  jal  init_sqrt`;

          const result = this.operands.pop();
          this.operands.push(this.printSqrt(result));
        }
        if (el === 'F') {
          this.exec += '\n\n  jal init_fatorial';

          const result = this.operands.pop();
          this.operands.push(this.printFatorial(result));
        }
        if (el === 'p') {
          this.exec += '\n\n  jal init_potencia';

          const exponent = this.operands.pop();
          const result = this.operands.pop();
          this.operands.push(this.printPotencia(result, exponent));
        }
      }
    });

    this.text += `\n${this.exec}`;

    const finalResult = this.operands.pop();

    this.text += `\n\n  move $v0, ${finalResult}`;
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
  }

  printSqrt(source: string) {

    this.data += `\n  error_msg: .asciiz "Não é uma raiz quadrada perfeita"`;

    const destination = this.registers.pop();

    const auxReg1 = this.registers.pop();
    const auxReg2 = this.registers.pop();

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

  printFatorial(source: string) {
    const destination = this.registers.pop();

    const auxReg0 = this.registers.pop();
    const auxReg1 = this.registers.pop();
    const auxReg2 = this.registers.pop();
    const auxReg3 = this.registers.pop();
    const auxReg4 = this.registers.pop();

    this.aux += `\n\n  init_fatorial:
    li ${auxReg2}, 2
    li ${destination}, 1
    li ${auxReg0}, 1
    add ${auxReg3}, ${source}, ${auxReg0}
    slt ${auxReg1}, ${source}, ${auxReg2}                    # testa se num < 2 (retorna 1 se num < 2)
    beq ${auxReg1}, $zero, fatorial_loop`;

    this.aux += `\n\n  fatorial_loop:
    addi ${auxReg4}, ${auxReg4}, 1
    slt ${auxReg1}, ${auxReg4}, ${auxReg3}                    # Verifica se o valor esta na sua ultima posicao
    beq ${auxReg1}, $zero, fatorial_exit        # Se chegou no final sai
    mul ${destination}, ${destination}, ${auxReg4}                    # Começa com 1 e vai incrementando pelo produto
    j fatorial_loop`;

    this.aux += `\n\n   fatorial_exit:
    jr $ra`;

    return destination;
  }

  printPotencia(source: string, exp: string) {
    const destination = this.registers.pop();

    const auxReg0 = this.registers.pop();

    this.aux += `\n\n\n  init_potencia:
    li ${auxReg0}, 1
    move ${destination}, ${source}
    sub ${exp}, ${exp}, ${auxReg0}`;

    this.aux += `\n\n  potencia_loop:
    mul ${destination}, ${destination}, ${source}
    sub ${exp}, ${exp}, ${auxReg0}
    bne ${exp}, $zero, potencia_loop`;

    this.aux += `\n\n   potencia_exit:
    jr $ra`;

    return destination;
  }

}
