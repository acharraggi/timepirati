import {observable, computed, action} from 'mobx';

export class Counter {
  @observable myCount;

  constructor() {
    this.myCount = 0;
  }

  @action inc() {
    this.myCount += 1;
  }

  @action decrement() {
    this.myCount -= 1;
  }

  @action reset() {
    this.myCount = 0;
  }

  @computed get count() {
    return this.myCount;
  }

  @computed get mydisplay() {
    return this.myCount.toString();
  }
}

export class CounterStore {
  @observable counter;

  constructor(rootStore) {
    this.rootStore = rootStore;
    this.counter = new Counter();
  }

  @action increment() {
    this.counter.inc();
  }

  @computed get mainDisplay() {
    return this.counter.mydisplay;
  }
}
