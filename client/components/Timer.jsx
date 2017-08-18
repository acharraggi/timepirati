import React from 'react';
import styles from './Timer.css';
import {observer} from "mobx-react";

export default @observer class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.timerStore = props.rootStore.timerStore;
  }

  render() {
    let firstButton;
    let secondButton;
    if (!this.timerStore.isRunning) {
      firstButton = (
          <button
              onClick={() => this.timerStore.startTimer()}
          >
            start
          </button>
      );

      secondButton = (
          <button
              onClick={() => this.timerStore.resetTimer()}
          >
            reset
          </button>
      );

      if (!this.timerStore.hasStarted) {
        secondButton = null;
      }
    } else {
      firstButton = (
          <button
              onClick={() => this.timerStore.stopTimer()}
          >
            stop
          </button>
      );
      secondButton = null;
    }
    return (
        <div className={styles.timer}>
          <p>Some blue timer text.</p>
          <p>{this.timerStore.mainDisplay}</p>
            {firstButton}
            {secondButton}
         </div>
    );
  }
}