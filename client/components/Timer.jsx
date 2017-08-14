import React from 'react';
import styles from './Timer.css';
import {observer} from "mobx-react";

export default @observer class Timer extends React.Component {
  constructor(props) {
    super(props);
    //this.state.timerStore = props.timerStore;
    this.state = {
      text: props.testText
    }
  }

  // increment() {
  //   this.setState({
  //     count: this.state.count + 1
  //   });
  // }
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
      // (
      //     <button
      //         onClick={() => this.props.timerStore.lapTimer()}
      //     >
      //       lap
      //     </button>
      // );
    }
    return (
        <div className={styles.timer}>
          <p>Some blue timer text. msg = {this.state.text}</p>
          <p>{this.props.timerStore.mainDisplay}</p>
            {firstButton}
            {secondButton}
         </div>
    );
  }
}