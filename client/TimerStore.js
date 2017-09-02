import {observable, computed, action, reaction} from 'mobx'
import {v4} from 'uuid'
import moment from 'moment'
import format from 'format-number-with-string'

export class Timer {
  id = null;
  @observable milliseconds
  @observable savedMilliseconds
  @observable note
  @observable projectID
  @observable taskID

  /**
   * Indicates whether changes in this object
   * should be submitted to the server
   */
  autoSave = true
  /**
   * Indicates whether changes in this object
   * should be saved in localStorage
   */
  localSave = true
  /**
   * Disposer for the side effect that automatically
   * stores this Timer, see @dispose.
   */
  saveHandler = null

  constructor (initialMilliseconds = 0, id = v4()) {
    this.milliseconds = initialMilliseconds
    this.savedMilliseconds = 0
    this.id = id
    this.note = ''
    this.projectID = ''
    this.taskID = ''
    this.saveHandler = reaction(
      // observe everything that is used in the JSON:
      () => this.asJson,
      // if autoSave is on, send json to server
      (json) => {
        if (this.autoSave) {
          // this.store.transportLayer.saveTimer(json)
        }
        if (this.localSave) {
          localStorage.timer = json
        }
      }
    )
  }

  @action saveTime () {
    this.savedMilliseconds += this.milliseconds
    this.milliseconds = 0
  }

  @action reset () {
    this.milliseconds = this.savedMilliseconds = 0
  }

  @computed get totalMilliSeconds () {
    return this.milliseconds + this.savedMilliseconds
  }

  @computed get display () {
    const seconds = parseInt(this.totalMilliSeconds / 1000, 10)
    const minutes = parseInt(seconds / 60, 10)
    const hours = parseInt(seconds / 3600, 10)

    return `${format(hours, '00')}:${format(minutes % 60, '00')}:${format(seconds % 60, '00')}`
  }

  @action setNote (n) {
    this.note = n
  }

  @computed get getNote () {
    return this.note
  }

  @action setProjectID (p) {
    this.projectID = p
  }

  @computed get getProjectID () {
    return this.projectID
  }

  @action setTaskID (t) {
    this.taskID = t
  }

  @computed get getTaskID () {
    return this.taskID
  }

  @computed get asJson () {
    return JSON.stringify(this, ['id', 'milliseconds', 'savedMilliseconds', 'note', 'projectID', 'taskID'])
  }

  /**
   * Update this Timer with information from the server
   */
  @action updateFromJson (json) {
    this.milliseconds = json.milliseconds
    this.savedMilliseconds = json.savedMilliseconds
    this.note = json.note
    this.projectID = json.projectID
    this.taskID = json.taskID
    this.saveTime()   // just in case timer was running when browser closed or page reloaded
  }

  dispose () {
    // clean up the observer
    this.saveHandler()
  }
}

export class TimerStore {
  @observable isRunning
  @observable timer
  @observable startTime

  constructor (rootStore) {
    this.rootStore = rootStore
    this.isRunning = false
    this.loadTimer()
  }

  loadTimer () {
    if (typeof (Storage) !== 'undefined') {
      // Code for localStorage/sessionStorage.
      if (localStorage.timer) {
        // restore stored timer
        const savedValue = JSON.parse(localStorage.timer)
        this.timer = new Timer(savedValue.id)
        this.timer.updateFromJson(savedValue)
      } else {
        // no counter stored, create new
        this.timer = new Timer()
        // localStorage.counter = this.counter.asJson
      }
    } else {
      // Sorry! No Web Storage support.. Just create counter
      this.timer = new Timer()
    }
  }

  @computed get mainDisplay () {
    return this.timer.display
  }

  @computed get hasStarted () {
    return this.timer.totalMilliSeconds !== 0
  }

  @action measure () {
    if (!this.isRunning) return
    this.timer.milliseconds = moment().diff(this.startTime)
    setTimeout(() => this.measure(), 1000)   // measure every 1000ms
  }

  @action startTimer () {
    if (this.isRunning) return
    this.isRunning = true
    this.startTime = moment()   // current date/time
    this.measure()
  }

  @action stopTimer () {
    this.timer.saveTime()
    this.isRunning = false
  }

  @action resetTimer () {
    this.timer.reset()
    this.isRunning = false
  }
}
