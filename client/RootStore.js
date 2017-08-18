import {TimerStore} from './TimerStore';
import {CounterStore} from './CounterStore';

export class RootStore {
  constructor() {
    this.timerStore = new TimerStore(this)
    this.counterStore = new CounterStore(this)
  }
}