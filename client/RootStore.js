import {TimerStore} from './TimerStore';
import {CounterStore} from './CounterStore';
import {ProjectStore} from './ProjectStore';

export class RootStore {
  constructor () {
    this.timerStore = new TimerStore(this)
    this.counterStore = new CounterStore(this)
    this.projectStore = new ProjectStore(this)
  }
}
