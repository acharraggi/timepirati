import {TimerStore} from './TimerStore'
import {CounterStore} from './CounterStore'
import {ProjectStore} from './ProjectStore'
import {UserStore} from './UserStore'

export class RootStore {
  constructor () {
    this.timerStore = new TimerStore(this)
    this.counterStore = new CounterStore(this)
    this.projectStore = new ProjectStore(this)
    this.userStore = new UserStore(this)
  }
}
