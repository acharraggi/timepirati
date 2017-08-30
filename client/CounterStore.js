import {observable, computed, action, reaction} from 'mobx'
import {v4} from 'uuid'

export class Counter {
  id = null;
  @observable myCount

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
   * stores this counter, see @dispose.
   */
  saveHandler = null

  constructor (id = v4()) {
    console.log('new counter with id = '+id)
    this.id = id
    this.myCount = 0
    this.saveHandler = reaction(
        // observe everything that is used in the JSON:
        () => this.asJson,
        // if autoSave is on, send json to server
        (json) => {
          if (this.autoSave) {
            // this.store.transportLayer.saveCounter(json)
          }
          if (this.localSave) {
            localStorage.counter = json
          }
        }
    )
  }

  @action inc () {
    this.myCount += 1
  }

  @action decrement () {
    this.myCount -= 1
  }

  @action reset () {
    this.myCount = 0
  }

  @computed get count () {
    return this.myCount
  }

  @computed get mydisplay () {
    return this.myCount.toString()
  }

  @computed get asJson () {
    return JSON.stringify(this, ['id', 'myCount'])
  }

  /**
   * Update this Counter with information from the server
   */
  @action updateFromJson (json) {
    this.myCount = json.myCount
  }

  dispose () {
    // clean up the observer
    this.saveHandler()
  }
}

export class CounterStore {
  @observable counter

  constructor (rootStore) {
    this.rootStore = rootStore
    this.loadCounter()
  }

  loadCounter () {
    if (typeof (Storage) !== 'undefined') {
      // Code for localStorage/sessionStorage.
      if (localStorage.counter) {
        // restore stored counter
        // console.log('localStorage found: '+localStorage.counter)
        const savedValue = JSON.parse(localStorage.counter)
        // console.log('savedValue=' + savedValue.id)

        this.counter = new Counter(savedValue.id)
        this.counter.updateFromJson(savedValue)
      } else {
        // no counter stored, create new
        this.counter = new Counter()
        //localStorage.counter = this.counter.asJson
      }
    } else {
      // Sorry! No Web Storage support.. Just create counter
      this.counter = new Counter()
    }
  }

  @action increment () {
    this.counter.inc()
  }

  @computed get mainDisplay () {
    return this.counter.mydisplay
  }
}
