import {TimerStore} from './TimerStore'
import {ProjectStore} from './ProjectStore'
import {UserStore} from './UserStore'

export class RootStore {
  constructor (transportLayer) {
    this.timerStore = new TimerStore(this, transportLayer)
    this.projectStore = new ProjectStore(this, transportLayer)
    this.userStore = new UserStore(this, transportLayer)
  }
}
