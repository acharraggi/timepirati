import {observable, computed, action} from 'mobx';
import {v4} from 'uuid';
import moment from 'moment';
import format from 'format-number-with-string';

export class Timer {
  @observable milliseconds;
  @observable savedMilliseconds;

  constructor(initialMilliseconds = 0) {
    this.milliseconds = initialMilliseconds;
    this.savedMilliseconds = 0;
    this.id = v4();
  }

  @action saveTime() {
    this.savedMilliseconds += this.milliseconds;
    this.milliseconds = 0;
  }

  @action reset() {
    this.milliseconds = this.savedMilliseconds = 0;
  }

  @computed get totalMilliSeconds() {
    return this.milliseconds + this.savedMilliseconds;
  }

  @computed get display() {
    const seconds = parseInt(this.totalMilliSeconds / 1000, 10);
    const minutes = parseInt(seconds / 60, 10);
    const hours  = parseInt(seconds / 3600, 10);

    return `${format(hours, '00')}:${format(minutes % 60, '00')}:${format(seconds % 60, '00')}`;
  }
}

export class TimerStore {

  @observable isRunning;
  @observable timer;
  @observable startTime;

  constructor() {
    this.isRunning = false;
    this.timer = new Timer();
  }

  @computed get mainDisplay() {
    return this.timer.display;
  }

  @computed get hasStarted() {
    return this.timer.totalMilliSeconds !== 0;
  }

  @action measure() {
    if (!this.isRunning) return;

    this.timer.milliseconds = moment().diff(this.startTime);

    setTimeout(() => this.measure(), 10);
  }

  @action startTimer() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.startTime = moment();
    this.measure();
  }


  @action stopTimer() {
    this.timer.saveTime();
    this.isRunning = false;
  }

  @action resetTimer() {
    this.timer.reset();
    this.isRunning = false;
  }

}
