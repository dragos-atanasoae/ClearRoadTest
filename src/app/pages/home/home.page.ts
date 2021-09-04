import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAuthModel } from '../../core/models/google-auth.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  userDetails: GoogleAuthModel;

  initialBudget = 0;
  days = 0;

  machines: Machine[] = [];

  totalProfit = 0;

  listOfCases = [
    {
      id: 1,
      n: 6,
      c: 10,
      d: 20,
      machines: [
        { di: 6, pi: 12, ri: 1, gi: 3 },
        { di: 1, pi: 9, ri: 1, gi: 2 },
        { di: 3, pi: 2, ri: 1, gi: 2 },
        { di: 8, pi: 20, ri: 5, gi: 4 },
        { di: 4, pi: 11, ri: 7, gi: 4 },
        { di: 2, pi: 10, ri: 9, gi: 1 },
      ]
    },
    {
      id: 2,
      n: 0,
      c: 11,
      d: 30,
      machines: []
    },
    {
      id: 3,
      n: 1,
      c: 12,
      d: 30,
      machines: [
        { di: 30, pi: 10, ri: 5, gi: 3 },
      ]
    },
    {
      id: 4,
      n: 1,
      c: 10,
      d: 2,
      machines: [
        { di: 1, pi: 10, ri: 2, gi: 1 },
      ]
    },
    {
      id: 5,
      n: 2,
      c: 10,
      d: 11,
      machines: [
        { di: 1, pi: 10, ri: 4, gi: 3 },
        { di: 1, pi: 10, ri: 9, gi: 1 },
      ]
    },
  ];
  selectedCase: any;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    this.userDetails = JSON.parse(localStorage.getItem('userDetails'));
  }

  signOut() {
    localStorage.removeItem('userDetails');
    this.router.navigateByUrl('');
  }

  selectCase(id: number) {
    console.log('Selected case:', id);
    this.selectedCase = this.listOfCases.find(item => item.id === id);
    this.initialBudget = this.selectedCase.c;
    this.days = this.selectedCase.d;
    this.machines = this.selectedCase.machines;
    this.sortMachineBySaleDay();
  }

  sortMachineBySaleDay() {
    this.machines = this.machines.sort((a, b) => a.di > b.di ? 1 : -1);
    console.log(this.machines);
    this.calculateMaxProfitForMachine();
  }

  calculateMaxProfitForMachine() {
    const firstOutcomeTree = new Node();
    firstOutcomeTree.currentBudget = this.initialBudget;
    let currentRow = [firstOutcomeTree];
    this.machines.forEach(machine => {
      const nextRow = [];
      currentRow.forEach((outcomeTree: Node) => {
        outcomeTree.buy = new Node();
        outcomeTree.stay = new Node();
        outcomeTree.buy.nodeDay = machine.di;
        outcomeTree.stay.nodeDay = machine.di;
        // BUY
        let selingPrice = 0;
        let profit = 0;
        // We have a machine to sell
        console.log('Check if we have a machine', outcomeTree.currentMachine);
        if (outcomeTree.currentMachine.di > 0) {
          selingPrice = outcomeTree.currentMachine.ri;
          // Calculate the profit since last day(when we are seling the machine)
          profit = outcomeTree.currentMachine.gi * (machine.di - outcomeTree.nodeDay - 1);
        }
        // Buy a new machine(if we have enough money)
        console.log('Buy a new machine if you have enough money');
        if (machine.pi <= (outcomeTree.currentBudget + profit + selingPrice)) {
          // Calculate the total profit of the current used machine
          outcomeTree.buy.currentBudget = outcomeTree.currentBudget + profit + selingPrice - machine.pi;
          outcomeTree.buy.currentMachine = machine;
          console.log('New machine', outcomeTree.buy.currentMachine);
          // Push Buy node to tree
          nextRow.push(outcomeTree.buy);
        } else {
          console.log('You don\'t have enough money to buy a new machine');
        }

        // STAY / Don't buy a new machine
        outcomeTree.stay.currentMachine = outcomeTree.currentMachine;
        console.log(outcomeTree.currentMachine);
        if (outcomeTree.currentMachine) {
          console.log('We work with current machine to make profit');
          if (outcomeTree.currentMachine.gi > 0) {
            outcomeTree.stay.currentBudget = outcomeTree.currentBudget + outcomeTree.currentMachine.gi * (machine.di - outcomeTree.nodeDay);
          } else {
            outcomeTree.stay.currentBudget = outcomeTree.currentBudget;
          }
        }
        // Push Stay node to tree
        nextRow.push(outcomeTree.stay);
        console.log('push data to next row', nextRow);
      });

      currentRow = nextRow;
    });
    console.log(currentRow);

    let maxProfit = 0;

    currentRow.forEach(outcome => {
      let amount = 0;
      if (outcome.currentMachine.gi > 0) {
        amount = outcome.currentBudget + outcome.currentMachine.gi * (this.days - outcome.nodeDay) + outcome.currentMachine.ri;
      } else {
        amount = outcome.currentBudget;
      }
      console.log('Profit:', amount);
      maxProfit = amount > maxProfit ? amount : maxProfit;
    });
    this.totalProfit = maxProfit;
    console.log('Max profit:', maxProfit);
  }

}

class Machine {
  di: number;
  pi: number;
  ri: number;
  gi: number;
  constructor() {
    this.di = 0;
    this.pi = 0;
    this.ri = 0;
    this.gi = 0;
  }
}
class Node {
  buy: any;
  stay: any;
  currentMachine: Machine;
  currentBudget: number;
  nodeDay: number;

  constructor() {
    this.buy = {};
    this.stay = {};
    this.currentMachine = new Machine();
    this.currentBudget = 0;
    this.nodeDay = 0;
  }
}


