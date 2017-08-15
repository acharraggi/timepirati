import React from 'react';
import styles from './Timer.css';
import {observer} from "mobx-react";

export default @observer class Timer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let firstButton;
    let secondButton;
    if (!this.props.timerStore.isRunning) {
      firstButton = (
          <button
              onClick={() => this.props.timerStore.startTimer()}
          >
            start
          </button>
      );

      secondButton = (
          <button
              onClick={() => this.props.timerStore.resetTimer()}
          >
            reset
          </button>
      );

      if (!this.props.timerStore.hasStarted) {
        secondButton = null;
      }
    } else {
      firstButton = (
          <button
              onClick={() => this.props.timerStore.stopTimer()}
          >
            stop
          </button>
      );
      secondButton = null;
    }
    return (
        <div className={styles.timer}>
          <p>Some blue timer text.</p>
          <p>{this.props.timerStore.mainDisplay}</p>
            {firstButton}
            {secondButton}
         </div>
    );
  }
}